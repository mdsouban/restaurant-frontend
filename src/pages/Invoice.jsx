import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { billApi } from "../api";

export default function Invoice() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const data = await billApi.getById(id);
      setBill(data);
    } catch (err) {
      setError("Invoice not found");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{padding: 20}}>Loading invoice...</div>;
  if (error) return <div style={{padding: 20, color: 'red'}}>{error}</div>;
  if (!bill) return <div style={{padding: 20}}>No invoice found</div>;

  return (
    <div style={{padding: 20, maxWidth: 600, margin: '0 auto', fontFamily: 'Arial'}}>
      <div style={{textAlign: 'center', marginBottom: 20}}>
        <h1>🍽️ Restaurant Invoice</h1>
        <p>Bill #{bill.id}</p>
        <p>Date: {new Date(bill.created_at).toLocaleString()}</p>
        <p>Mobile: {bill.mobile}</p>
      </div>

      <hr/>

      <h3>Order Details:</h3>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{borderBottom: '2px solid #333'}}>
            <th align="left">Item</th>
            <th align="right">Qty</th>
            <th align="right">Price</th>
            <th align="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, idx) => (
            <tr key={idx} style={{borderBottom: '1px solid #eee'}}>
              <td>{item.item_name}</td>
              <td align="right">{item.qty}</td>
              <td align="right">₹{item.price}</td>
              <td align="right">₹{(item.price * item.qty).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{fontWeight: 'bold', fontSize: 18, borderTop: '2px solid #333'}}>
            <td colSpan="3" align="right">Total:</td>
            <td align="right">₹{Number(bill.total).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div style={{marginTop: 30, textAlign: 'center', color: '#666'}}>
        <p>Thank you for dining with us!</p>
        <button 
          onClick={() => window.print()}
          style={{
            padding: '10px 20px',
            fontSize: 16,
            cursor: 'pointer',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 5
          }}
        >
          🖨️ Print Invoice
        </button>
      </div>
    </div>
  );
}