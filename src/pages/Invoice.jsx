import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function Invoice() {
  const { id } = useParams();
  const [inv, setInv] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/invoice/${id}`);
      setInv(res.data);
    } catch (e) {
      console.log(e);
      alert("❌ Invoice not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoice();
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading invoice...</div>;
  if (!inv) return <div style={{ padding: 20 }}>No invoice data.</div>;

  return (
    <div style={{ background: "#f2f2f2", padding: 12 }}>
      <div style={styles.a4}>
        <div style={styles.header}>
          <div>
            <h2 style={{ margin: 0 }}>🍽️ Restaurant</h2>
            <div style={{ fontSize: 13, opacity: 0.85 }}>
              Address: Your Restaurant Location
            </div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>
              Phone: +91-XXXXXXXXXX
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14 }}>
              <b>Invoice #</b> {inv.id}
            </div>
            <div style={{ fontSize: 14 }}>
              <b>Date:</b> {new Date(inv.date).toLocaleString()}
            </div>
            <div style={{ fontSize: 14 }}>
              <b>Customer:</b> {inv.mobile}
            </div>
          </div>
        </div>

        <hr />

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Item</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {inv.items.map((x, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{x.name}</td>
                <td style={styles.td}>{x.qty}</td>
                <td style={styles.td}>₹ {x.price}</td>
                <td style={styles.td}>₹ {x.qty * x.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.totalBox}>
          <div style={{ fontSize: 18 }}>
            <b>Total: ₹ {inv.total}</b>
          </div>
        </div>

        <div style={styles.footer}>
          <p style={{ margin: 0 }}>
            ✅ Thank you for visiting! <br />
            Please come again 🙏
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  a4: {
    background: "white",
    maxWidth: 800,
    margin: "0 auto",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    minHeight: "90vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 12,
  },
  th: {
    border: "1px solid #ddd",
    padding: 10,
    textAlign: "left",
    background: "#f6f6f6",
  },
  td: {
    border: "1px solid #ddd",
    padding: 10,
  },
  totalBox: {
    marginTop: 16,
    textAlign: "right",
  },
  footer: {
    marginTop: 25,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
};
