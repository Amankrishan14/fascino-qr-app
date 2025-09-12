import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import PublicPortfolio from './components/PublicPortfolio';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/p/:handle" element={<PublicPortfolio />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;