import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function Invoice() {
  const { id } = useParams();
  const nav = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const res = await api.get(`/bill/${id}`);
      setBill(res.data);
    } catch (err) {
      alert("Invoice not found");
      nav("/");
    } finally {
      setLoading(false);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  if (loading) return <div className="loading">Loading invoice...</div>;
  if (!bill) return <div className="error">Invoice not found</div>;

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="invoice-container">
      <div className="invoice">
        <div className="header">
          <h1>🍽️ Restaurant POS</h1>
          <div className="invoice-info">
            <h2>INVOICE #{bill.id}</h2>
            <p>Date: {currentDate}</p>
          </div>
        </div>

        <div className="customer-info">
          <h3>Customer Details</h3>
          <p><strong>Mobile:</strong> {bill.mobile}</p>
        </div>

        <div className="items-section">
          <h3>Items Ordered</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(bill.items || []).map((item, idx) => (
                <tr key={idx}>
                  <td>{item.item_name}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="total-section">
          <h2>Total Amount: ₹{bill.total}</h2>
        </div>

        <div className="footer">
          <p>Thank you for your business!</p>
          <p>Visit us again soon 😊</p>
        </div>
      </div>

      <div className="actions no-print">
        <button className="btn btn-blue" onClick={() => nav("/")}>
          ← Back to Dashboard
        </button>
        <button className="btn btn-green" onClick={printInvoice}>
          🖨️ Print Invoice
        </button>
      </div>

      <style>{`
        .invoice-container { padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .invoice { background: white; border: 1px solid #ddd; border-radius: 12px; padding: 30px; margin-bottom: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #007bff; font-size: 28px; }
        .invoice-info { text-align: right; }
        .invoice-info h2 { margin: 0; color: #333; }
        .invoice-info p { margin: 5px 0 0; color: #666; }
        .customer-info { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
        .customer-info h3 { margin: 0 0 10px; color: #333; }
        .items-section { margin-bottom: 20px; }
        .items-section h3 { margin: 0 0 15px; color: #333; }
        .items-table { width: 100%; border-collapse: collapse; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .items-table th { background: #f8f9fa; font-weight: bold; color: #333; }
        .items-table td:nth-child(2), .items-table td:nth-child(3), .items-table td:nth-child(4) { text-align: right; }
        .total-section { text-align: right; padding: 20px; background: #007bff; color: white; border-radius: 8px; margin-bottom: 20px; }
        .total-section h2 { margin: 0; font-size: 24px; }
        .footer { text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        .footer p { margin: 5px 0; }
        .actions { display: flex; gap: 10px; justify-content: center; }
        .btn { padding: 12px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 16px; }
        .btn-blue { background: #007bff; color: white; }
        .btn-green { background: #28a745; color: white; }
        .btn:hover { opacity: 0.9; }
        .loading, .error { text-align: center; padding: 50px; font-size: 18px; }
        .error { color: #dc3545; }
        
        @media print {
          .no-print { display: none !important; }
          .invoice-container { padding: 0; }
          .invoice { border: none; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}
