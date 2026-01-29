import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { menuApi } from "../api";  // Changed from api to menuApi

export default function Menu() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const data = await menuApi.getAll();  // Changed from api.get()
      setItems(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!name || !price) {
      alert("Enter name and price");
      return;
    }
    try {
      await menuApi.add({ name, price });  // Changed from api.post()
      setName("");
      setPrice("");
      loadMenu();
    } catch (err) {
      alert("Failed to add item: " + err.message);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await menuApi.delete(id);  // Changed from api.delete()
      loadMenu();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div style={{padding: 20, fontFamily: 'Arial'}}>
      <h2>Menu Management</h2>
      
      <div style={{marginBottom: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8}}>
        <h3>Add New Item</h3>
        <input
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{padding: 8, marginRight: 10}}
        />
        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{padding: 8, marginRight: 10, width: 100}}
        />
        <button onClick={addItem} style={{padding: '8px 15px'}}>Add Item</button>
      </div>

      <button onClick={() => nav("/")} style={{marginBottom: 20, padding: '8px 15px'}}>
        ← Back to Dashboard
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{backgroundColor: '#333', color: 'white', textAlign: 'left'}}>
              <th style={{padding: 10}}>ID</th>
              <th style={{padding: 10}}>Name</th>
              <th style={{padding: 10}}>Price</th>
              <th style={{padding: 10}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{borderBottom: '1px solid #ddd'}}>
                <td style={{padding: 10}}>{item.id}</td>
                <td style={{padding: 10}}>{item.name}</td>
                <td style={{padding: 10}}>₹{item.price}</td>
                <td style={{padding: 10}}>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    style={{background: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 4, cursor: 'pointer'}}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}