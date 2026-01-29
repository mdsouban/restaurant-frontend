import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { menuApi } from "../api";

export default function Menu() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // ✅ Backend base url for images
  // If api.js has baseURL = backend url, this works:
  const backendBase = api.defaults.baseURL?.replace("/api", "") || "";

  const filteredItems = useMemo(() => {
    return items.filter((x) =>
      (x.name || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  // ✅ Load menu items
  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/menu");
      setItems(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // ✅ Save new item
  const saveItem = async () => {
    try {
      if (!name.trim()) {
        alert("Enter item name");
        return;
      }
      if (!price || isNaN(price)) {
        alert("Enter valid price");
        return;
      }

      await api.post("/menu", {
        name: name.trim(),
        price: Number(price)
      });

      alert("✅ Item saved");

      setName("");
      setPrice("");
      setImage(null);

      // Refresh list
      loadItems();
    } catch (err) {
      console.log("Save error:", err);
      alert("❌ Save failed: " + (err?.response?.data?.message || err.message));
    }
  };

  // ✅ Delete item
  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;

    try {
      await api.delete(`/menu/${id}`);
      alert("✅ Deleted");
      loadItems();
    } catch (err) {
      console.log(err);
      alert("❌ Delete failed");
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="topbar orange">
        <button className="btn small" onClick={() => nav("/")}>
          ← Dashboard
        </button>
        <h2 className="title">Menu Items</h2>
      </div>

      {/* Add Form */}
      <div className="card">
        <h3 className="subtitle">➕ Add Item</h3>

        <input
          className="input"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Price (₹)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* ✅ Image upload */}
        <div style={{ marginTop: 10 }}>
          <label style={{ fontWeight: 700 }}>Item Image (optional)</label>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>

        <button className="btn btn-blue full" onClick={saveItem}>
          💾 Save Item
        </button>
      </div>

      {/* List */}
      <div className="card">
        <h3 className="subtitle">📋 Item List</h3>

        <input
          className="input"
          placeholder="Search item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p>Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p>No items found</p>
        ) : (
          <div className="list">
            {filteredItems.map((x) => (
              <div key={x.id} className="listItem">
                <div className="itemLeft">
                  {/* ✅ Show image */}
                  {x.imageUrl ? (
                    <img
                      src={`${backendBase}${x.imageUrl}`}
                      alt={x.name}
                      className="thumb"
                    />
                  ) : (
                    <div className="thumb placeholder">No Image</div>
                  )}

                  <div>
                    <div className="itemName">{x.name}</div>
                    <div className="itemPrice">₹ {x.price}</div>
                  </div>
                </div>

                <button
                  className="btn btn-red small"
                  onClick={() => deleteItem(x.id)}
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        .container { padding: 14px; font-family: Arial; }
        .topbar { display:flex; align-items:center; justify-content:space-between; padding:12px; border-radius:12px; color:#fff; margin-bottom:12px; }
        .orange { background: linear-gradient(90deg,#ff7a18,#ffb347); }
        .title { margin:0; font-size:20px; font-weight:800; }
        .subtitle { margin:0 0 10px 0; font-size:16px; font-weight:800; }
        .card { background:#fff; border-radius:14px; padding:14px; margin-bottom:12px; box-shadow:0 6px 14px rgba(0,0,0,0.08); }
        .input { width:100%; padding:12px; margin-top:10px; border-radius:10px; border:1px solid #ddd; font-size:16px; box-sizing:border-box; }
        .btn { padding:10px 12px; border:none; border-radius:10px; font-weight:800; cursor:pointer; }
        .btn.small { padding:8px 10px; font-size:14px; }
        .btn.full { width:100%; margin-top:12px; font-size:16px; }
        .btn-blue { background: linear-gradient(90deg,#00c6ff,#0072ff); color:#fff; }
        .btn-red { background: linear-gradient(90deg,#ff416c,#ff4b2b); color:#fff; }
        .list { margin-top:12px; display:flex; flex-direction:column; gap:10px; }
        .listItem { display:flex; justify-content:space-between; align-items:center; padding:10px; border-radius:12px; border:1px solid #eee; }
        .itemLeft { display:flex; align-items:center; gap:10px; }
        .thumb { width:56px; height:56px; border-radius:10px; object-fit:cover; border:1px solid #ddd; }
        .placeholder { display:flex; align-items:center; justify-content:center; font-size:11px; color:#666; background:#f2f2f2; }
        .itemName { font-weight:900; font-size:16px; }
        .itemPrice { font-weight:800; color:#222; margin-top:2px; }
      `}</style>
    </div>
  );
}
