import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';  // Add this
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import Invoice from './pages/Invoice';

function App() {
  return (
    <BrowserRouter>
      <Navbar />  {/* Add this line */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/invoice/:id" element={<Invoice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;