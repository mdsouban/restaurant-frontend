import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Billing from "./pages/Billing";
import Report from "./pages/Report";
import Invoice from "./pages/Invoice";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Dashboard />} />

        {/* Pages */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/report" element={<Report />} />

        {/* ✅ Invoice page for WhatsApp link */}
        <Route path="/invoice/:id" element={<Invoice />} />

        {/* If wrong URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
