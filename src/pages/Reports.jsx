import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { billApi } from "../api";

export default function Reports() {
  const nav = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await billApi.getReport(date);
      setBills(data);
    } catch (err) {
      alert("Failed to load report: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalSales = bills.reduce((sum, bill) => sum + Number(bill.total), 0);

  return (
    <div style={{padding: 20, fontFamily: 'Arial'}}>
      <h2>Daily Reports</h2>
      
      <div style={{marginBottom: 20}}>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          style={{padding: 10, marginRight: 10}}
        />
        <button 
          onClick={loadReport} 
          disabled={loading}
          style={{padding: '10px 20px', cursor: 'pointer'}}
        >
          {loading ? 'Loading...' : 'Generate Report'}
        </button>
        <button 
          onClick={() => nav("/")}
          style={{padding: '10px 20px', marginLeft: 10, cursor: 'pointer'}}
        >
          Back to Dashboard
        </button>
      </div>

      {bills.length > 0 && (
        <div style={{marginBottom: 20, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8}}>
          <h3>Total Sales: ₹{totalSales.toFixed(2)}</h3>
          <p>Total Bills: {bills.length}</p>
        </div>
      )}

      <div>
        <h3>Bill Details:</h3>
        {bills.length === 0 ? (
          <p>No bills found for this date</p>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #333', textAlign: 'left'}}>
                <th>Bill #</th>
                <th>Mobile</th>
                <th>Time</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id} style={{borderBottom: '1px solid #eee'}}>
                  <td>{bill.id}</td>
                  <td>{bill.mobile}</td>
                  <td>{new Date(bill.created_at).toLocaleTimeString()}</td>
                  <td>₹{Number(bill.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}