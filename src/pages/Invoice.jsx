import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function Invoice() {
  const { id } = useParams(); // invoiceId
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bill, setBill] = useState(null);
  const [error, setError] = useState("");

  const loadInvoice = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/bill/${id}`);
      setBill(res.data);
    } catch (err) {
      console.log("INVOICE LOAD ERROR:", err);
      setBill(null);
      setError(err?.response?.data?.message || "Invoice not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const totals = useMemo(() => {
    const items = bill?.items || [];
    const subTotal = items.reduce(
      (sum, x) => sum + Number(x.price || 0) * Number(x.qty || 0),
      0
    );
    return {
      subTotal,
      grandTotal: Number(bill?.total ?? subTotal),
    };
  }, [bill]);

  if (loading) {
    return (
      <div style={{ padding: 20, fontFamily: "Arial" }}>
        <h2>Loading Invoice...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, fontFamily: "Arial" }}>
        <h2 style={{ color: "#e11d48" }}>❌ {error}</h2>
        <button style={styles.btn} onClick={() => nav("/")}>
          ⬅ Back to Dashboard
        </button>
      </div>
    );
  }

  const invoiceDate = bill?.created_at || bill?.date || new Date().toISOString();

  return (
    <div style={styles.page}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <button style={styles.btn} onClick={() => nav("/")}>
          ⬅ Dashboard
        </button>

        <div style={{ flex: 1 }} />

        <button style={styles.printBtn} onClick={() => window.print()}>
          🖨 Save / Print (A4)
        </button>
      </div>

      {/* A4 Invoice */}
      <div style={styles.a4} className="invoice-a4">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.shop}>🍽 Restaurant POS</h1>
            <div style={{ color: "#444" }}>
              Address: Your Restaurant Address
            </div>
            <div style={{ color: "#444" }}>Phone: +91 XXXXX XXXXX</div>
          </div>

          <div style={styles.invoiceBox}>
            <div style={styles.invTitle}>INVOICE</div>
            <div style={styles.invRow}>
              <b>Invoice ID:</b> <span>{bill?.id}</span>
            </div>
            <div style={styles.invRow}>
              <b>Date:</b>{" "}
              <span>{new Date(invoiceDate).toLocaleString()}</span>
            </div>
            <div style={styles.invRow}>
              <b>Customer:</b> <span>{bill?.mobile}</span>
            </div>
          </div>
        </div>

        <hr style={styles.hr} />

        {/* Items table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Item</th>
              <th style={styles.thRight}>Price</th>
              <th style={styles.thRight}>Qty</th>
              <th style={styles.thRight}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {(bill?.items || []).map((x, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{idx + 1}</td>
                <td style={styles.td}>{x.name || x.item_name}</td>
                <td style={styles.tdRight}>₹ {Number(x.price || 0)}</td>
                <td style={styles.tdRight}>{Number(x.qty || 0)}</td>
                <td style={styles.tdRight}>
                  ₹ {Number(x.price || 0) * Number(x.qty || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={styles.totalArea}>
          <div style={{ flex: 1 }} />

          <div style={styles.totalBox}>
            <div style={styles.totalRow}>
              <span>Sub Total</span>
              <b>₹ {totals.subTotal}</b>
            </div>

            <div style={styles.totalRow}>
              <span>Grand Total</span>
              <b style={{ fontSize: 18 }}>₹ {totals.grandTotal}</b>
            </div>
          </div>
        </div>

        <hr style={styles.hr} />

        {/* Footer */}
        <div style={styles.footer}>
          <div>
            <b>Thank you 🙏 Visit again!</b>
            <div style={{ color: "#666", marginTop: 6 }}>
              This is a system generated invoice.
            </div>
          </div>
        </div>
      </div>

      {/* Print CSS */}
      <style>{`
        @media print {
          body {
            background: #fff !important;
          }
          .invoice-a4 {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
          }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    background: "#f3f4f6",
    minHeight: "100vh",
    padding: 14,
    fontFamily: "Arial, sans-serif",
  },
  toolbar: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  btn: {
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "bold",
    background: "#111827",
    color: "white",
  },
  printBtn: {
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "bold",
    background: "linear-gradient(135deg,#ff6a00,#ee0979)",
    color: "white",
  },

  // A4 paper
  a4: {
    background: "white",
    maxWidth: "794px", // A4 width @96dpi
    margin: "0 auto",
    padding: 24,
    borderRadius: 18,
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  },
  shop: { margin: 0, color: "#111827" },

  invoiceBox: {
    minWidth: 240,
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 12,
    background: "#fafafa",
  },
  invTitle: {
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 6,
    color: "#111827",
  },
  invRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    fontSize: 14,
    padding: "3px 0",
  },

  hr: { border: "none", borderTop: "1px solid #e5e7eb", margin: "18px 0" },

  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    borderBottom: "2px solid #e5e7eb",
    padding: "10px 8px",
    fontWeight: "900",
    background: "#f9fafb",
  },
  thRight: {
    textAlign: "right",
    borderBottom: "2px solid #e5e7eb",
    padding: "10px 8px",
    fontWeight: "900",
    background: "#f9fafb",
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #f1f5f9",
  },
  tdRight: {
    padding: "10px 8px",
    borderBottom: "1px solid #f1f5f9",
    textAlign: "right",
  },

  totalArea: {
    display: "flex",
    marginTop: 14,
  },
  totalBox: {
    width: 320,
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 12,
    background: "#fafafa",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: 15,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
};
