import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import AIRiskAnalysis from './pages/AIRiskAnalysis';
import AIAnalyticsModules from './pages/AIAnalyticsModules';
import AnomalyDetection from './pages/AnomalyDetection';
import FundMonitoring from './pages/FundMonitoring';
import MPAnalytics from './pages/MPAnalytics';
import StateAnalytics from './pages/StateAnalytics';
import MapView from './pages/MapView';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import DataExplorer from './pages/DataExplorer';
import AIModel from './pages/AIModel';
import CitizenPortal from './pages/CitizenPortal';
import Settings from './pages/Settings';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page (no sidebar) */}
        <Route path="/" element={<Landing />} />
        <Route path="/citizen" element={<CitizenPortal />} />

        {/* Dashboard routes with sidebar layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/ai-analytics" element={<AIAnalyticsModules />} />
          <Route path="/ai-risk" element={<AIRiskAnalysis />} />
          <Route path="/anomalies" element={<AnomalyDetection />} />
          <Route path="/fund-monitoring" element={<FundMonitoring />} />
          <Route path="/mp-analytics" element={<MPAnalytics />} />
          <Route path="/state-analytics" element={<StateAnalytics />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/data-explorer" element={<DataExplorer />} />
          <Route path="/ai-model" element={<AIModel />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Catch-all redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
