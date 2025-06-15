import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import CustomerDashboard from './pages/CustomerDashboard';
import ContactPage from './components/ContactPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/contact" element={<ContactPage/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
