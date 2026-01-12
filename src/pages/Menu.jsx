import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Menu() {
  const nav = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("General");
  const [imageFile, setImageFile] = useState(null);

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter((x) => (x.name || "").toLowerCase().includes(s));
  }, [items, search]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/menu");
      setItems(res.data || []);
    } catch (e) {
      console.log(e);
      alert("❌ Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const saveItem = async () => {
    if (!name.trim()) return alert("Enter item name");
    if (!price || isNaN(price)) return alert("Enter valid price");
    if (!imageFile) return alert("Select image");

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("price", price);
      fd.append("category", category);
      fd.append("image", imageFile);

      await api.post("/menu", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setPrice("");
      setCategory("General");
      setImageFile(null);

      await loadItems();
      alert("✅ Item saved");
     } catch (e) {
  console.log("SAVE ITEM ERROR:", e);
  const msg =
    e?.response?.data?.message ||
    e?.message ||
    "Unknown error";
  alert("❌ Save failed: " + msg);

} finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      setLoading(true);
      await api.delete(`/menu/${id}`);
      await loadItems();
    } catch (e) {
      console.log(e);
      alert("❌ Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button onClick={() => nav("/")} style={styles.backBtn}>
          ⬅ Dashboard
        </button>
        <h2 style={{ margin: 0 }}>🍽️ Menu Items</h2>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>➕ Add Item</h3>

        <input
          style={styles.input}
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Price ₹"
          value={price}
          inputMode="numeric"
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          style={styles.input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>General</option>
          <option>Starters</option>
          <option>Main Course</option>
          <option>Drinks</option>
          <option>Dessert</option>
        </select>

        <input
          style={styles.input}
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        <button
          disabled={loading}
          onClick={saveItem}
          style={{
            ...styles.bigBtn,
            background: "linear-gradient(135deg,#00b09b,#96c93d)",
          }}
        >
          💾 Save Item
        </button>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>📋 Item List</h3>

        <input
          style={styles.input}
          placeholder="Search item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <div>Loading...</div>}

        {!loading && filtered.length === 0 && (
          <div style={{ color: "#666" }}>No items found</div>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((x) => (
            <div key={x.id} style={styles.itemRow}>
              <img
                src={x.imageUrl ? `https://restaurant-backend-pos.onrender.com${x.imageUrl}` : ""}
                alt=""
                style={styles.img}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold" }}>{x.name}</div>
                <div style={{ color: "#666", fontSize: 13 }}>
                  {x.category || "General"}
                </div>
                <div style={{ fontWeight: "bold" }}>₹ {x.price}</div>
              </div>

              <button
                onClick={() => deleteItem(x.id)}
                style={{
                  ...styles.smallBtn,
                  background: "linear-gradient(135deg,#ff416c,#ff4b2b)",
                  color: "white",
                }}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}

const styles = {
  page: { padding: 16, fontFamily: "Arial, sans-serif" },
  header: {
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(135deg,#ff512f,#f09819)",
    color: "white",
    marginBottom: 14,
    position: "relative",
    textAlign: "center",
  },
  backBtn: {
    position: "absolute",
    left: 12,
    top: 12,
    border: "none",
    borderRadius: 12,
    padding: "8px 10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  card: {
    background: "white",
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #ddd",
    fontSize: 16,
    marginBottom: 10,
  },
  bigBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 16,
    border: "none",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    cursor: "pointer",
  },
  itemRow: {
    display: "flex",
    gap: 12,
    border: "1px solid #eee",
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 12,
    objectFit: "cover",
    background: "#f1f1f1",
  },
  smallBtn: {
    border: "none",
    padding: 10,
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold",
  },
};
