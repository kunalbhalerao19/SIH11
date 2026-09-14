import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

// Lazy loaded page components
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const SectorAnalytics = lazy(() => import('./pages/SectorAnalytics'));
const AIRiskAnalysis = lazy(() => import('./pages/AIRiskAnalysis'));
const AIAnalyticsModules = lazy(() => import('./pages/AIAnalyticsModules'));
const AnomalyDetection = lazy(() => import('./pages/AnomalyDetection'));
const FundMonitoring = lazy(() => import('./pages/FundMonitoring'));
const MPAnalytics = lazy(() => import('./pages/MPAnalytics'));
const StateAnalytics = lazy(() => import('./pages/StateAnalytics'));
const MapView = lazy(() => import('./pages/MapView'));
const DataSources = lazy(() => import('./pages/DataSources'));
const DataQuality = lazy(() => import('./pages/DataQuality'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Reports = lazy(() => import('./pages/Reports'));
const DataExplorer = lazy(() => import('./pages/DataExplorer'));
const AIModel = lazy(() => import('./pages/AIModel'));
const CitizenPortal = lazy(() => import('./pages/CitizenPortal'));
const Settings = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-3 border-blue-200 border-t-[#003580] rounded-full animate-spin" />
      <span className="text-xs font-semibold text-gray-500 tracking-wide">Loading module...</span>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes (no sidebar) */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/citizen" element={<CitizenPortal />} />

                {/* Dashboard routes with sidebar layout protected by auth */}
                <Route
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/sector-analytics" element={<SectorAnalytics />} />
                  <Route path="/ai-analytics" element={<AIAnalyticsModules />} />
                  <Route path="/ai-risk" element={<AIRiskAnalysis />} />
                  <Route path="/anomalies" element={<AnomalyDetection />} />
                  <Route path="/fund-monitoring" element={<FundMonitoring />} />
                  <Route path="/mp-analytics" element={<MPAnalytics />} />
                  <Route path="/state-analytics" element={<StateAnalytics />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/data-sources" element={<DataSources />} />
                  <Route path="/data-quality" element={<DataQuality />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/data-explorer" element={<DataExplorer />} />
                  <Route path="/ai-model" element={<AIModel />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
