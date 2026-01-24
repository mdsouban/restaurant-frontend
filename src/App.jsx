import { BrowserRouter, Routes, Route } from "react-router-dom";
import Billing from "./pages/Billing";
import Invoice from "./pages/Invoice";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Billing />} />
        <Route path="/invoice/:id" element={<Invoice />} />
      </Routes>
    </BrowserRouter>
  );
}
