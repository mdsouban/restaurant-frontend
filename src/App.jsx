import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import Menu from "./pages/Menu.jsx";
import Billing from "./pages/Billing.jsx";
import Report from "./pages/Report.jsx";
import Invoice from "./pages/Invoice.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/report" element={<Report />} />
        <Route path="/invoice/:id" element={<Invoice />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
