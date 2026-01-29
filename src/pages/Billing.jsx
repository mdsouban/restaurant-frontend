import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { billApi, menuApi } from "../api";

export default function Billing() {
  const nav = useNavigate();
  const [mobile, setMobile] = useState("");
  const [items, setItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const data = await menuApi.getAll();
      console.log("Menu loaded:", data);
      setMenuItems(data || []);
    } catch (err) {
      console.error("Menu error:", err);
      alert("Failed to load menu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (menuItem) => {
    const existing = items.find(x => x.id === menuItem.id);
    if (existing) {
      setItems(items.map(x => x.id === menuItem.id ? {...x, qty: x.qty + 1} : x));
    } else {
      setItems([...items, {...menuItem, qty: 1}]);
    }
    setSearch("");
    setShowDropdown(false);
  };

  const removeItem = (id) => {
    setItems(items.filter(x => x.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems(items.map(x => x.id === id ? {...x, qty} : x));
  };

  const total = items.reduce((sum, x) => sum + (Number(x.price) * x.qty), 0);

  const saveBill = async () => {
  if (!mobile || items.length === 0) {
    alert("Enter mobile & add items");
    return;
  }

  try {
    const invoiceId = await billApi.create(mobile, items, total);
    const invoiceUrl = `${window.location.origin}/invoice/${invoiceId}`;
    
    // Format message for WhatsApp with clickable link
    const message = `🧾 *Your Restaurant Bill*\n\n` +
               `💰 Total: ₹${total}\n\n` +
               `📄 View Invoice: ${invoiceUrl}\n\n` +
               `Thank you for dining with us! 🙏`;
    
    const whatsappMsg = encodeURIComponent(message);
    
    // Open WhatsApp
    window.open(`https://wa.me/${mobile}?text=${whatsappMsg}`, "_blank");
    
    setMobile("");
    setItems([]);
    alert("✅ Bill saved & WhatsApp opened!");
  } catch (err) {
    alert("❌ Failed to save bill: " + err.message);
    console.error(err);
  }
};
  const filteredItems = menuItems.filter(item => 
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{padding: 20, fontFamily: 'Arial'}}>
      <h2>Billing & Invoice</h2>
      
      <div style={{marginBottom: 20}}>
        <button onClick={() => nav("/")} style={{padding: '8px 15px', marginBottom: 10}}>
          ← Back to Dashboard
        </button>
        
        <input
          placeholder="Customer Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={{padding: 10, width: '100%', marginBottom: 10, fontSize: 16}}
        />
      </div>

      <div style={{marginBottom: 20}}>
        <h3>Add Items</h3>
        <div style={{position: 'relative'}}>
          <input
            placeholder="Search items..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            onFocus={() => setShowDropdown(search.length > 0)}
            style={{padding: 10, width: '100%', marginBottom: 10}}
          />
          
          {showDropdown && filteredItems.length > 0 && (
            <div style={{
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              background: 'white', 
              border: '1px solid #ddd',
              maxHeight: 200,
              overflowY: 'auto',
              zIndex: 1000
            }}>
              {filteredItems.slice(0, 5).map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => addItem(item)}
                  style={{
                    padding: 10, 
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {loading ? <p>Loading menu...</p> : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginTop: 10}}>
            {menuItems.slice(0, 6).map((item) => (
              <div 
                key={item.id} 
                onClick={() => addItem(item)}
                style={{
                  border: '1px solid #ddd', 
                  padding: 10, 
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{fontWeight: 'bold'}}>{item.name}</div>
                <div style={{color: '#007bff'}}>₹{item.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{marginBottom: 20}}>
        <h3>Bill Items</h3>
        {items.length === 0 ? (
          <p>No items added</p>
        ) : (
          <div>
            {items.map((item) => (
              <div key={item.id} style={{
                display: 'flex', 
                alignItems: 'center', 
                padding: 10, 
                borderBottom: '1px solid #eee',
                gap: 10
              }}>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 'bold'}}>{item.name}</div>
                  <div>₹{item.price} each</div>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)} style={{padding: '5px 10px'}}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} style={{padding: '5px 10px'}}>+</button>
                </div>
                
                <div style={{minWidth: 80, textAlign: 'right', fontWeight: 'bold'}}>
                  ₹{item.price * item.qty}
                </div>
                
                <button 
                  onClick={() => removeItem(item.id)}
                  style={{background: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 4}}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        borderTop: '2px solid #333', 
        paddingTop: 20, 
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold'
      }}>
        Total: ₹{total}
      </div>

      <button 
        onClick={saveBill}
        disabled={!mobile || items.length === 0}
        style={{
          width: '100%',
          padding: 15,
          marginTop: 20,
          fontSize: 18,
          background: mobile && items.length > 0 ? '#28a745' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: mobile && items.length > 0 ? 'pointer' : 'not-allowed'
        }}
      >
        💾 Save Bill & Send WhatsApp
      </button>
    </div>
  );
}