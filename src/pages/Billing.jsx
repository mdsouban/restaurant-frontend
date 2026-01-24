import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Billing() {
  const [mobile, setMobile] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // example add item (you may already have this)
  const addItem = (item) => {
    setItems([...items, item]);
    setTotal(total + item.price * item.qty);
  };

  // ✅ THIS WAS MISSING
  const saveBill = async () => {
    if (!mobile || items.length === 0) {
      alert("Enter mobile & items");
      return;
    }

    try {
      const res = await fetch(`${API}/bill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile,
          items,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create bill");
        return;
      }

      const invoiceId = data.invoiceId;

      // ✅ WhatsApp link
      const invoiceUrl =
        `${window.location.origin}/invoice/${invoiceId}`;

      const whatsappMsg = encodeURIComponent(
        `Your bill is ready:\n${invoiceUrl}`
      );

      window.open(
        `https://wa.me/91${mobile}?text=${whatsappMsg}`,
        "_blank"
      );
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Billing</h2>

      <input
        placeholder="Customer Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <h3>Total: ₹{total}</h3>

      <button onClick={saveBill}>Save & Send WhatsApp</button>
    </div>
  );
}
