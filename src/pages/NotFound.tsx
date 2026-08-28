import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft, Search, Layers, Brain } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
      {/* Top Bar */}
      <header className="bg-[#003580] text-white px-6 py-3 shadow-md flex justify-between items-center border-b-2 border-[#FF6B00]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-[#FF6B00]" />
          </div>
          <div>
            <div className="text-sm font-bold">MPLADS AI Insight • Error 404</div>
            <div className="text-[11px] text-white/70">Ministry of Statistics and Programme Implementation</div>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-white font-medium transition-colors"
        >
          Return to Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-lg w-full p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-700 mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="text-4xl font-extrabold text-[#003580] tracking-tight">404</div>
          <h1 className="text-lg font-bold text-gray-900 mt-1">Page Not Found / पृष्ठ नहीं मिला</h1>
          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
            The requested monitoring page or MIS record does not exist on the portal. Please verify the URL or use the quick links below.
          </p>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3 mt-6 text-left">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-3 rounded-lg border border-gray-200 hover:border-[#003580] hover:bg-blue-50/50 transition-all flex items-center gap-2 text-xs font-semibold text-gray-800"
            >
              <Home className="w-4 h-4 text-[#003580]" />
              <span>Executive Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="p-3 rounded-lg border border-gray-200 hover:border-[#003580] hover:bg-blue-50/50 transition-all flex items-center gap-2 text-xs font-semibold text-gray-800"
            >
              <Search className="w-4 h-4 text-[#003580]" />
              <span>Search Projects</span>
            </button>
            <button
              onClick={() => navigate('/ai-analytics')}
              className="p-3 rounded-lg border border-gray-200 hover:border-[#003580] hover:bg-blue-50/50 transition-all flex items-center gap-2 text-xs font-semibold text-gray-800"
            >
              <Layers className="w-4 h-4 text-[#003580]" />
              <span>AI Analytics Modules</span>
            </button>
            <button
              onClick={() => navigate('/ai-risk')}
              className="p-3 rounded-lg border border-gray-200 hover:border-[#003580] hover:bg-blue-50/50 transition-all flex items-center gap-2 text-xs font-semibold text-gray-800"
            >
              <Brain className="w-4 h-4 text-[#003580]" />
              <span>AI Risk Scoring</span>
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2 bg-[#003580] hover:bg-[#002860] text-white text-xs font-bold rounded transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white/50 text-[11px] text-center py-3">
        MPLADS AI Insight Sentinel • Problem Statement 26102
      </footer>
    </div>
  );
}
