import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Report() {
  const nav = useNavigate();

  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/report?date=${date}`);
      setList(res.data || []);
    } catch (e) {
      console.log(e);
      alert("❌ Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const totalSales = list.reduce((sum, x) => sum + Number(x.total || 0), 0);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button onClick={() => nav("/")} style={styles.backBtn}>
          ⬅ Dashboard
        </button>
        <h2 style={{ margin: 0 }}>📊 Sales Report</h2>
        <p style={{ margin: "6px 0 0", opacity: 0.9 }}>
          Select date and see daily report
        </p>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>📅 Select Date</h3>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={loadReport}
          disabled={loading}
          style={{
            ...styles.bigBtn,
            background: "linear-gradient(135deg,#11998e,#38ef7d)",
          }}
        >
          ✅ View Report
        </button>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>💰 Total Sales: ₹ {totalSales}</h3>

        {loading && <div>Loading...</div>}

        {!loading && list.length === 0 && (
          <div style={{ color: "#666" }}>No sales found for this date.</div>
        )}

        <div style={{ display: "grid", gap: 10 }}>
          {list.map((x) => (
            <div key={x.id} style={styles.row}>
              <div style={{ flex: 1 }}>
                <b>Invoice #{x.id}</b>
                <div style={{ color: "#666" }}>Mobile: {x.mobile}</div>
                <div style={{ color: "#666" }}>
                  Items: {(x.items || []).length}
                </div>
              </div>
              <div style={{ fontWeight: "bold" }}>₹ {x.total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 16, fontFamily: "Arial, sans-serif" },
  header: {
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(135deg,#11998e,#38ef7d)",
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
  row: {
    display: "flex",
    gap: 12,
    border: "1px solid #eee",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
  },
};
