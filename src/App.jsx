import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Billing from "./pages/Billing";
import Report from "./pages/Report";
import Invoice from "./pages/Invoice";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/report" element={<Report />} />
        <Route path="/invoice/:id" element={<Invoice />} />
      </Routes>
    </BrowserRouter>
  );
}
