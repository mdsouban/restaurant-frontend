import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();

  return (
    <div style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          padding: 18,
          borderRadius: 18,
          color: "white",
          background: "linear-gradient(135deg,#7F00FF,#E100FF)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          marginBottom: 18,
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>🍽️ Restaurant POS</h2>
        <p style={{ margin: "6px 0 0", opacity: 0.9 }}>
          Menu • Billing • WhatsApp Invoice • Daily Report
        </p>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        <button
          onClick={() => nav("/menu")}
          style={{
            ...styles.btn,
            background: "linear-gradient(135deg,#00c6ff,#0072ff)",
          }}
        >
          ➕ Menu Item Creation
        </button>

        <button
          onClick={() => nav("/billing")}
          style={{
            ...styles.btn,
            background: "linear-gradient(135deg,#f7971e,#ffd200)",
            color: "#111",
          }}
        >
          🧾 Billing + Send Invoice
        </button>

        <button
          onClick={() => nav("/report")}
          style={{
            ...styles.btn,
            background: "linear-gradient(135deg,#11998e,#38ef7d)",
          }}
        >
          📊 Daily Report (Date Filter)
        </button>
      </div>
    </div>
  );
}

const styles = {
  btn: {
    width: "100%",
    padding: 16,
    borderRadius: 18,
    border: "none",
    fontWeight: "bold",
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
  },
};
