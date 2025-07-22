import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
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

  return (
    <BrowserRouter>
      <div className="dashboard-root">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed}
        />
        <div className={`dashboard-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="dashboard-content">
            <Routes>
              <Route path="/" element={<MainDashboard/>} />
              <Route path="/monitoring" element={<Monitoring/>} />
              {/* Добавьте другие маршруты */}
              <Route path="/communication-analysis" element={<CommunicationAnalysis/>} />
              <Route path="/analytics" element={<Analytics/>} />
              <Route path="/flowchart" element={<Flowchart/>} />  
              <Route path="/export" element={<Export/>} />
              <Route path="/help" element={<Help/>} />
              <Route path="/profile" element={<Profile/>} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;