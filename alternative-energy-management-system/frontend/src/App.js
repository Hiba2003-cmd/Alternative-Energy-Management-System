import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Authentication from './pages/Authentication';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import ElectricalDeviceManagement from './pages/ElectricalDeviceManagement';
import SolarPanelManagement from './pages/SolarPanelManagement';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };
  
  
  return (
    <PrimeReactProvider>
      <Router>
        {isAuthenticated ? (
          <div className="layout-wrapper">
            <Navbar onLogout={handleLogout} />
            <div className="layout-content">
              <Sidebar />
              <div className="layout-main">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<UserProfile title="User Profile" />} />
                  <Route path="/devices" element={<ElectricalDeviceManagement title="Electrical Devices" />} />
                  <Route path="/panels" element={<SolarPanelManagement title="Solar Panels" />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/auth" element={<Authentication onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        )}
      </Router>
    </PrimeReactProvider>
  );
};

export default App;