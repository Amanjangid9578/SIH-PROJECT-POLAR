import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExpeditionPlanningPage } from './pages/ExpeditionPlanningPage';
import { CargoTrackingPage } from './pages/CargoTrackingPage';
import { InventoryPage } from './pages/InventoryPage';
import { PersonnelPage } from './pages/PersonnelPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AutomationPage } from './pages/AutomationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Cinematic Entry Landing Screen */}
          <Route path="/" element={<LandingPage />} />

          {/* Operational Shell Layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/planning" element={<ExpeditionPlanningPage />} />
            <Route path="/cargo" element={<CargoTrackingPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/personnel" element={<PersonnelPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/automation" element={<AutomationPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Wildcard redirect to Mission Control */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
