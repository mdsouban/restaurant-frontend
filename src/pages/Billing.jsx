import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { billApi } from "../api";

export default function Billing() {
  const nav = useNavigate();
  const [mobile, setMobile] = useState("");
  const [items, setItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const backendBase = api.defaults.baseURL?.replace("/api", "") || "";

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
  try {
    const data = await menuApi.getAll();
    setMenuItems(data || []);
  } catch (err) {
    console.log(err);
    alert("Failed to load menu items: " + err.message);
  } finally {
    setLoading(false);
  }
};

  const addItem = (menuItem) => {
    const existing = items.find(x => x.id === menuItem.id);
    if (existing) {
      setItems(items.map(x => 
        x.id === menuItem.id ? {...x, qty: x.qty + 1} : x
      ));
    } else {
      setItems([...items, {...menuItem, qty: 1}]);
    }
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

  const total = items.reduce((sum, x) => sum + (x.price * x.qty), 0);

  const saveBill = async () => {
  if (!mobile || items.length === 0) {
    alert("Enter mobile & add items");
    return;
  }

  try {
    // CHANGE: Use Supabase instead of Render backend
    const invoiceId = await billApi.create(mobile, items, total);
    
    const invoiceUrl = `${window.location.origin}/invoice/${invoiceId}`;
    const whatsappMsg = encodeURIComponent(`Your bill is ready:\n${invoiceUrl}`);

    window.open(`https://wa.me/91${mobile}?text=${whatsappMsg}`, "_blank");
    
    // Reset form
    setMobile("");
    setItems([]);
    alert("✅ Bill saved & WhatsApp sent!");
  } catch (err) {
    alert("❌ Failed to save bill: " + err.message);
    console.error(err);
  }
  };

  return (
    <div className="container">
      <div className="topbar yellow">
        <button className="btn small" onClick={() => nav("/")}>
          ← Dashboard
        </button>
        <h2 className="title">Billing & Invoice</h2>
      </div>

      <div className="card">
        <h3 className="subtitle">📱 Customer Details</h3>
        <input
          className="input"
          placeholder="Customer Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>

      <div className="card">
        <h3 className="subtitle">🍽️ Menu Items</h3>
        <div className="search-container">
          <input
            className="input"
            placeholder="Search items..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            onFocus={() => setShowDropdown(search.length > 0)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {showDropdown && filteredItems.length > 0 && (
            <div className="dropdown">
              {filteredItems.slice(0, 5).map((item) => (
                <div 
                  key={item.id} 
                  className="dropdown-item" 
                  onClick={() => {
                    addItem(item);
                    setSearch("");
                    setShowDropdown(false);
                  }}
                >
                  <span className="dropdown-name">{item.name}</span>
                  <span className="dropdown-price">₹{item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {loading ? (
          <p>Loading menu...</p>
        ) : (
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="menu-item" onClick={() => addItem(item)}>
                {item.imageUrl ? (
                  <img src={`${backendBase}${item.imageUrl}`} alt={item.name} className="menu-img" />
                ) : (
                  <div className="menu-img placeholder">No Image</div>
                )}
                <div className="menu-name">{item.name}</div>
                <div className="menu-price">₹{item.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="subtitle">🧾 Bill Items</h3>
        {items.length === 0 ? (
          <p>No items added</p>
        ) : (
          <div className="bill-items">
            {items.map((item) => (
              <div key={item.id} className="bill-item">
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">₹{item.price} each</div>
                </div>
                <div className="qty-controls">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <div className="item-total">₹{item.price * item.qty}</div>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>×</button>
              </div>
            ))}
          </div>
        )}
        
        <div className="total-section">
          <h3>Total: ₹{total}</h3>
          <button className="btn btn-green full" onClick={saveBill} disabled={!mobile || items.length === 0}>
            💾 Save Bill & Send WhatsApp
          </button>
        </div>
      </div>

      <style>{`
        .container { padding: 14px; font-family: Arial; }
        .topbar { display:flex; align-items:center; justify-content:space-between; padding:12px; border-radius:12px; color:#fff; margin-bottom:12px; }
        .yellow { background: linear-gradient(90deg,#f7971e,#ffd200); color:#111; }
        .title { margin:0; font-size:20px; font-weight:800; }
        .subtitle { margin:0 0 10px 0; font-size:16px; font-weight:800; }
        .card { background:#fff; border-radius:14px; padding:14px; margin-bottom:12px; box-shadow:0 6px 14px rgba(0,0,0,0.08); }
        .input { width:100%; padding:12px; margin-top:10px; border-radius:10px; border:1px solid #ddd; font-size:16px; box-sizing:border-box; }
        .btn { padding:10px 12px; border:none; border-radius:10px; font-weight:800; cursor:pointer; }
        .btn.small { padding:8px 10px; font-size:14px; }
        .btn.full { width:100%; margin-top:12px; font-size:16px; }
        .btn-green { background: linear-gradient(90deg,#11998e,#38ef7d); color:#fff; }
        .btn:disabled { opacity:0.5; cursor:not-allowed; }
        .menu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:10px; }
        .menu-item { border:1px solid #eee; border-radius:10px; padding:8px; text-align:center; cursor:pointer; transition:all 0.2s; }
        .menu-item:hover { border-color:#007bff; transform:scale(1.02); }
        .menu-img { width:100%; height:80px; border-radius:8px; object-fit:cover; margin-bottom:6px; }
        .placeholder { display:flex; align-items:center; justify-content:center; font-size:10px; color:#666; background:#f2f2f2; }
        .menu-name { font-weight:700; font-size:14px; margin-bottom:4px; }
        .menu-price { color:#007bff; font-weight:800; }
        .bill-items { display:flex; flex-direction:column; gap:8px; }
        .bill-item { display:flex; align-items:center; gap:10px; padding:8px; border:1px solid #eee; border-radius:8px; }
        .item-info { flex:1; }
        .item-name { font-weight:700; }
        .item-price { font-size:12px; color:#666; }
        .qty-controls { display:flex; align-items:center; gap:8px; }
        .qty-controls button { width:30px; height:30px; border:1px solid #ddd; border-radius:6px; background:#fff; cursor:pointer; }
        .item-total { font-weight:800; min-width:60px; text-align:right; }
        .remove-btn { width:30px; height:30px; border:none; border-radius:6px; background:#ff4757; color:#fff; cursor:pointer; }
        .total-section { border-top:2px solid #eee; padding-top:12px; margin-top:12px; text-align:center; }
        .search-container { position:relative; }
        .dropdown { position:absolute; top:100%; left:0; right:0; background:#fff; border:1px solid #ddd; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); z-index:1000; max-height:200px; overflow-y:auto; }
        .dropdown-item { padding:12px; border-bottom:1px solid #eee; cursor:pointer; display:flex; justify-content:space-between; align-items:center; }
        .dropdown-item:hover { background:#f8f9fa; }
        .dropdown-item:last-child { border-bottom:none; }
        .dropdown-name { font-weight:600; }
        .dropdown-price { color:#007bff; font-weight:700; }
      `}</style>
    </div>
  );
}
