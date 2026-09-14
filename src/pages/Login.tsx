import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import {
  Shield, Building2, Users, ArrowRight, Lock, KeyRound, Eye, EyeOff, Sparkles, Globe, Check, Award
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { success, error } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole>('officer');
  const [customName, setCustomName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCustomName('');
    setPassword('');
  };

  const executeLogin = () => {
    // 1. Ministry Officer Validation
    if (selectedRole === 'officer') {
      const trimmedName = customName.trim().toLowerCase();
      const trimmedPass = password.trim().toLowerCase();

      if (!trimmedName || !['modi jii', 'modi ji', 'modi', 'narendra modi'].includes(trimmedName)) {
        error('Authentication Failed', 'Invalid Officer Name for Ministry Wing.');
        return;
      }

      if (trimmedPass !== 'meloni') {
        error('Authentication Failed', 'Incorrect security password for Ministry Officer.');
        return;
      }
    }

    // 2. District Collector Validation
    else if (selectedRole === 'collector') {
      const trimmedName = customName.trim().toLowerCase();
      const trimmedPass = password.trim().toLowerCase();

      if (!trimmedName || !['tukaram mundhe', 'tukaram', 'mundhe', 'tukaram mundhe, ias'].includes(trimmedName)) {
        error('Authentication Failed', 'Invalid Collector Name for District Nodal.');
        return;
      }

      if (trimmedPass !== 'password') {
        error('Authentication Failed', 'Incorrect security password for District Collector.');
        return;
      }
    }

    // 3. Authenticate Session
    setIsAuthenticating(true);
    setTimeout(() => {
      const defaultJurisdictions = {
        officer: 'PMO & MoSPI National Wing, New Delhi',
        collector: 'District Magistrate & Collector, Pune',
        citizen: 'Public Constituency Audit',
      };

      const finalName = customName.trim() || (selectedRole === 'citizen' ? 'Citizen Auditor' : 'Authorized Officer');
      loginAs(selectedRole, finalName, defaultJurisdictions[selectedRole]);
      
      success('Session Authenticated', `Welcome, ${finalName}!`);
      setIsAuthenticating(false);

      if (selectedRole === 'citizen') {
        navigate('/citizen');
      } else {
        navigate('/dashboard');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between font-sans selection:bg-[#003580] selection:text-white">
      {/* Top Government Header Strip */}
      <header className="bg-[#002060] text-white px-6 py-2.5 shadow-md flex justify-between items-center border-b-2 border-[#FF6B00]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
            <Shield className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider text-white">भारत सरकार • GOVERNMENT OF INDIA</div>
            <div className="text-[11px] text-white/80 font-medium">Ministry of Statistics &amp; Programme Implementation (MoSPI)</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sentinel Core Online</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-xs font-semibold transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="text-xs text-white/80 hover:text-white underline transition-colors cursor-pointer hidden md:block"
          >
            Public Portal
          </button>
        </div>
      </header>

      {/* Main Dual-Column Authentication Canvas */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
          
          {/* LEFT SHOWCASE PANEL (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#002060] via-[#003580] to-slate-900 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-white border-b lg:border-b-0 lg:border-r border-blue-900/50">
            {/* Background glowing watermark */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-16 -top-16 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold text-blue-200 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Smart India Hackathon 2026 Prototype</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  MPLADS AI Insight
                </h1>
                <p className="text-sm font-semibold text-[#FF6B00] mt-1">
                  National Financial Vigilance &amp; Anomaly Detection System
                </p>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Advanced multi-modal artificial intelligence engineered for MoSPI, District Collectors, and Citizens to audit ₹8,300+ Cr annual development funds.
                </p>
              </div>

              {/* Live Feature Highlights */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-slate-200">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white">Cross-Scheme Duplication Guard:</strong> Geospatial proximity analysis against PMGSY, JJM, and SCM assets.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-slate-200">
                  <div className="p-1 rounded bg-blue-500/20 text-blue-300 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white">64-bit dHash &amp; EXIF GPS:</strong> Client-side tamper detection on site completion photographs.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-slate-200">
                  <div className="p-1 rounded bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white">Explainable AI (XAI):</strong> SHAP-style breakdown for every flagged risk score.
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Stats Bar */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm font-bold text-white">₹8,320 Cr</div>
                <div className="text-[9px] text-slate-300 uppercase tracking-wider">Funds Tracked</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm font-bold text-emerald-400">543 Seats</div>
                <div className="text-[9px] text-slate-300 uppercase tracking-wider">Covered</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm font-bold text-[#FF6B00]">287 Alerts</div>
                <div className="text-[9px] text-slate-300 uppercase tracking-wider">Under Review</div>
              </div>
            </div>
          </div>

          {/* RIGHT AUTH TERMINAL (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header inside Form */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#003580]" />
                    <span>Sentinel Access Gateway</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Select your administrative role and enter credentials
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#003580] border border-blue-200">
                  v1.0-2026
                </span>
              </div>

              {/* Role Selection Cards */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    1. Select Administrative Role:
                  </label>
                  <span className="text-[11px] text-[#003580] font-medium">Click to choose role</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Role 1: Ministry Officer */}
                  <div
                    onClick={() => handleRoleSelect('officer')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRole === 'officer'
                        ? 'border-[#003580] bg-blue-50/70 shadow-sm ring-1 ring-[#003580]'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#003580]">
                        <Shield className="w-4 h-4" />
                      </div>
                      {selectedRole === 'officer' ? (
                        <span className="w-4 h-4 rounded-full bg-[#003580] text-white flex items-center justify-center text-[10px]">✓</span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-gray-300"></span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-gray-900">Ministry Officer</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">MoSPI National Wing</div>
                    <div className="mt-2 text-[9.5px] text-blue-900 bg-blue-100 px-2 py-0.5 rounded font-semibold inline-block">
                      Full Access
                    </div>
                  </div>

                  {/* Role 2: District Collector */}
                  <div
                    onClick={() => handleRoleSelect('collector')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRole === 'collector'
                        ? 'border-[#003580] bg-blue-50/70 shadow-sm ring-1 ring-[#003580]'
                        : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                        <Building2 className="w-4 h-4" />
                      </div>
                      {selectedRole === 'collector' ? (
                        <span className="w-4 h-4 rounded-full bg-[#003580] text-white flex items-center justify-center text-[10px]">✓</span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-gray-300"></span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-gray-900">District Collector</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">District / DRDA Nodal</div>
                    <div className="mt-2 text-[9.5px] text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-semibold inline-block">
                      Field Audits
                    </div>
                  </div>

                  {/* Role 3: Citizen Auditor */}
                  <div
                    onClick={() => handleRoleSelect('citizen')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRole === 'citizen'
                        ? 'border-[#003580] bg-blue-50/70 shadow-sm ring-1 ring-[#003580]'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                        <Users className="w-4 h-4" />
                      </div>
                      {selectedRole === 'citizen' ? (
                        <span className="w-4 h-4 rounded-full bg-[#003580] text-white flex items-center justify-center text-[10px]">✓</span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-gray-300"></span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-gray-900">Citizen Auditor</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Public Social Audit</div>
                    <div className="mt-2 text-[9.5px] text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded font-semibold inline-block">
                      Public Portal
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Credentials & Security Input Block */}
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 text-xs space-y-3">
                <div className="font-semibold text-gray-800 flex items-center justify-between">
                  <span>2. Credentials &amp; Authentication:</span>
                  <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                    {selectedRole === 'officer' && 'Ministry Sign In'}
                    {selectedRole === 'collector' && 'Collector Sign In'}
                    {selectedRole === 'citizen' && 'Citizen Sign In'}
                  </span>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-[10px] text-gray-600 font-bold uppercase mb-1">
                    {selectedRole === 'officer' && 'Officer Name / User ID'}
                    {selectedRole === 'collector' && 'Collector Name / User ID'}
                    {selectedRole === 'citizen' && 'Citizen Name / ID (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder={
                      selectedRole === 'officer'
                        ? 'Enter Ministry Officer Name'
                        : selectedRole === 'collector'
                        ? 'Enter District Collector Name'
                        : 'Enter your name (optional)'
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#003580] text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* Password Input Field */}
                <div>
                  <label className="block text-[10px] text-gray-600 font-bold uppercase mb-1 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-[#003580]" />
                    <span>Security Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={selectedRole === 'citizen' ? 'No password required for Public access' : 'Enter Password'}
                      disabled={selectedRole === 'citizen'}
                      className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#003580] pr-9 text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-400"
                    />
                    {selectedRole !== 'citizen' && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-700 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Capability Checklist preview */}
              <div className="flex items-center gap-2.5 text-[11px] text-gray-600 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                <Award className="w-4 h-4 text-[#003580] shrink-0" />
                <span>
                  {selectedRole === 'officer' && 'Authorized Scope: AI Model Pipeline, Sector Analytics, Data Quality Monitor, National Telemetry.'}
                  {selectedRole === 'collector' && 'Authorized Scope: Field Inspection Docket Generator, GIS Proximity Radar, Alert Queue.'}
                  {selectedRole === 'citizen' && 'Authorized Scope: Public Project Transparency, Photo Progress Viewer, Citizen Suggestion Loop.'}
                </span>
              </div>
            </div>

            {/* Bottom Form Action */}
            <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-end">
              <button
                type="button"
                onClick={executeLogin}
                disabled={isAuthenticating}
                className="w-full sm:w-auto px-8 py-2.5 bg-[#003580] hover:bg-[#002860] text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>{isAuthenticating ? 'Authenticating Credentials...' : 'Enter Monitoring Platform'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Security Compliance Strip */}
            <div className="pt-2.5 mt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>256-bit TLS Encrypted Session</span>
              </div>
              <div>NIC / MoSPI SIH 2026 Standards</div>
            </div>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="bg-[#001438] text-white/60 text-[11px] text-center py-2.5 border-t border-white/10">
        © 2026 Ministry of Statistics &amp; Programme Implementation • Smart India Hackathon Prototype (Problem Statement 26102)
      </footer>
    </div>
  );
}
