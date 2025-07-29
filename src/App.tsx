import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth';
import Monitoring from './components/Monitoring';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import Analytics from './components/Analytics';
import CommunicationAnalysis from './components/CommunicationAnalysis';
import Flowchart from './components/Flowchart';
import Export from './components/Export';
import Help from './components/Help';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const refresh_token = localStorage.getItem('refresh_token');
      if (refresh_token) {
        try {
          const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
          const response = await fetch(`${API_URL}/api/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ refresh_token }),
          });
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('refresh_token', data.refresh_token);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('refresh_token');
            setIsAuthenticated(false);
          }
        } catch (error) {
          localStorage.removeItem('refresh_token');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280', margin: 0 }}>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <div className="dashboard-root">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed}
          onLogout={handleLogout}
        />
        <div className={`dashboard-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="dashboard-content">
            <Routes>
              <Route path="/" element={<MainDashboard/>} />
              <Route path="/monitoring" element={<Monitoring/>} />
              <Route path="/communication-analysis" element={<CommunicationAnalysis/>} />
              <Route path="/analytics" element={<Analytics/>} />
              <Route path="/flowchart" element={<Flowchart/>} />  
              <Route path="/export" element={<Export/>} />
              <Route path="/help" element={<Help/>} />
              <Route path="/profile" element={<Profile onLogout={handleLogout}/>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;