import { useParams, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Invoice() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    fetch(`${API}/bill/${id}`)
      .then((r) => r.json())
      .then(setBill)
      .catch(() => alert("Invoice not found"));
  }, [id]);

  if (!bill) return <h3>Loading...</h3>;

  return (
    <div>
      <h2>Invoice #{bill.id}</h2>
      <p>Mobile: {bill.mobile}</p>
      <p>Total: ₹{bill.total}</p>

      <ul>
        {bill.items.map((i, idx) => (
          <li key={idx}>
            {i.name} × {i.qty} = ₹{i.price * i.qty}
          </li>
        ))}
      </ul>
    </div>
  );
}
