import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import Invoice from './pages/Invoice';

function AppContent() {
  const location = useLocation();
  const isInvoicePage = location.pathname.startsWith('/invoice/');

  return (
    <>
      {!isInvoicePage && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/invoice/:id" element={<Invoice />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;