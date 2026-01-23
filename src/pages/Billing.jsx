import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Billing() {
  const nav = useNavigate();

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [mobile, setMobile] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // load menu
  const loadMenu = async () => {
    try {
      const res = await api.get("/menu");
      setMenu(res.data || []);
    } catch (e) {
      console.log(e);
      alert("❌ Failed to load menu items");
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const suggestions = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return [];
    return menu
      .filter((x) => (x.name || "").toLowerCase().includes(s))
      .slice(0, 6);
  }, [query, menu]);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((x) => x.id === item.id);
      if (found) {
        return prev.map((x) =>
          x.id === item.id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });

    setQuery("");
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty + delta } : x))
        .filter((x) => x.qty > 0)
    );
  };

  const total = useMemo(() => {
    return cart.reduce((sum, x) => sum + Number(x.price) * x.qty, 0);
  }, [cart]);

// Send bill via WhatsApp
const sendBill = async () => {
  try {
    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    // 1) Create bill in backend (Render)
    const res = await api.post("/bill", {
      mobile,
      items: cart,
      total,
    });

    const invoiceId = res.data?.invoiceId;

    if (!invoiceId) {
      alert("InvoiceId not returned from backend");
      return;
    }

    // 2) Create invoice link (Vercel frontend)
    const invoiceLink = `https://restaurant-frontend-five-snowy.vercel.app/invoice/${invoiceId}`;

    // 3) WhatsApp message
    let msg = `🧾 Restaurant Invoice\n\n`;

    cart.forEach((i) => {
      msg += `${i.name} x ${i.qty} = ₹${i.qty * i.price}\n`;
    });

    msg += `\nTotal: ₹${total}\n\n`;
    msg += `Invoice Link:\n${invoiceLink}`;

    // 4) Open WhatsApp
    window.open(
      `https://wa.me/91${mobile}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  } catch (err) {
    console.log(err);
    alert("Send Bill failed: " + (err?.response?.data?.message || err.message));
  }
};
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button onClick={() => nav("/")} style={styles.backBtn}>
          ⬅ Dashboard
        </button>
        <h2 style={{ margin: 0 }}>🧾 Billing</h2>
        <p style={{ margin: "6px 0 0", opacity: 0.9 }}>
          Search item → Add cart → Send invoice WhatsApp
        </p>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>🔎 Search Item</h3>

        <input
          style={styles.input}
          placeholder="Type item name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {suggestions.length > 0 && (
          <div style={styles.suggBox}>
            {suggestions.map((x) => (
              <div key={x.id} style={styles.suggRow}>
                <div style={{ flex: 1 }}>
                  <b>{x.name}</b>
                  <div style={{ color: "#666" }}>₹ {x.price}</div>
                </div>
                <button
                  style={{
                    ...styles.smallBtn,
                    background: "linear-gradient(135deg,#00c6ff,#0072ff)",
                    color: "white",
                  }}
                  onClick={() => addToCart(x)}
                >
                  Add ➕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>🛒 Cart</h3>

        {cart.length === 0 ? (
          <div style={{ color: "#666" }}>No items in cart</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {cart.map((x) => (
              <div key={x.id} style={styles.cartRow}>
                <div style={{ flex: 1 }}>
                  <b>{x.name}</b>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    ₹ {x.price} × {x.qty} = ₹ {Number(x.price) * x.qty}
                  </div>
                </div>

                <div style={styles.qtyBox}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => changeQty(x.id, -1)}
                  >
                    −
                  </button>
                  <b style={{ minWidth: 20, textAlign: "center" }}>{x.qty}</b>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => changeQty(x.id, +1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.totalBox}>
          Total: <span style={{ fontSize: 20 }}>₹ {total}</span>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>📱 Customer Mobile</h3>

        <input
          style={styles.input}
          placeholder="Enter 10 digit mobile number"
          value={mobile}
          inputMode="numeric"
          onChange={(e) => setMobile(e.target.value)}
        />

        <button
          disabled={loading}
          onClick={sendBill}
          style={{
            ...styles.bigBtn,
            background: "linear-gradient(135deg,#25D366,#128C7E)",
          }}
        >
          🟢 Send Invoice via WhatsApp
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 16, fontFamily: "Arial, sans-serif" },
  header: {
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(135deg,#1e3c72,#2a5298)",
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
  suggBox: {
    marginTop: 10,
    display: "grid",
    gap: 10,
    padding: 10,
    borderRadius: 14,
    border: "1px solid #eee",
    background: "#fafafa",
  },
  suggRow: {
    display: "flex",
    gap: 10,
    padding: 10,
    borderRadius: 14,
    border: "1px solid #eee",
    background: "white",
    alignItems: "center",
  },
  smallBtn: {
    border: "none",
    padding: "10px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold",
  },
  cartRow: {
    display: "flex",
    gap: 12,
    border: "1px solid #eee",
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
  },
  qtyBox: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    borderRadius: 14,
    padding: "6px 10px",
    border: "1px solid #eee",
    background: "#fafafa",
  },
  qtyBtn: {
    border: "none",
    background: "#ddd",
    padding: "6px 12px",
    borderRadius: 12,
    fontSize: 18,
    cursor: "pointer",
    fontWeight: "bold",
  },
  totalBox: {
    marginTop: 14,
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 18,
  },
};
