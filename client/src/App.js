import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import LeadForm from './components/LeadForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function Header() {
  const location = useLocation();
  const isOnAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="App-header">
      <h1>Lead Management System</h1>
      {isOnAdminPage ? (
        <Link to="/" className="admin-link">Back to Forms</Link>
      ) : (
        <Link to="/admin/login" className="admin-link">Admin Login</Link>
      )}
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LeadForm />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
