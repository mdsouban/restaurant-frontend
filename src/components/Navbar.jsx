import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  const navStyle = {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    background: 'linear-gradient(90deg, #f7971e, #ffd200)',
    marginBottom: '20px'
  };
  
  const linkStyle = (path) => ({
    padding: '10px 20px',
    textDecoration: 'none',
    color: location.pathname === path ? '#fff' : '#333',
    fontWeight: 'bold',
    borderRadius: '8px',
    background: location.pathname === path ? '#333' : 'transparent'
  });

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle('/')}>Dashboard</Link>
      <Link to="/menu" style={linkStyle('/menu')}>Menu Items</Link>
      <Link to="/billing" style={linkStyle('/billing')}>Billing</Link>
      <Link to="/reports" style={linkStyle('/reports')}>Reports</Link>
    </nav>
  );
}