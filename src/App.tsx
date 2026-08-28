import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
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
    <AuthProvider>
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes (no sidebar) */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
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

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
