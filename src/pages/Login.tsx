import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import {
  Shield, UserCheck, Building2, Users, ArrowRight, Lock, CheckCircle2,
  Globe, Check, Award, Sparkles, KeyRound, Eye, EyeOff, Info
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { loginAs, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { success, error } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole>('officer');
  const [customName, setCustomName] = useState('Modi Jii');
  const [customJurisdiction, setCustomJurisdiction] = useState('PMO & MoSPI National Wing, New Delhi');
  const [password, setPassword] = useState('Meloni');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleRoleSelect = (role: UserRole, presetName: string, presetJurisdiction: string, defaultPass: string) => {
    setSelectedRole(role);
    setCustomName(presetName);
    setCustomJurisdiction(presetJurisdiction);
    setPassword(defaultPass);
  };

  const executeLogin = (roleToLogin?: UserRole) => {
    const targetRole = roleToLogin || selectedRole;
    
    // Password Verification
    if (targetRole === 'officer') {
      if (password.trim().toLowerCase() !== 'meloni') {
        error('Authentication Failed', 'Invalid password for Modi Jii. (Hint: Meloni)');
        return;
      }
    } else if (targetRole === 'collector') {
      if (!['password', 'mundhe', 'tukaram'].includes(password.trim().toLowerCase())) {
        error('Authentication Failed', 'Invalid password for Tukaram Mundhe. (Hint: Password)');
        return;
      }
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      loginAs(targetRole, customName || undefined, customJurisdiction || undefined);
      
      const roleLabels = {
        officer: `Ministry Officer (${customName || 'Modi Jii'})`,
        collector: `District Collector (${customName || 'Tukaram Mundhe'})`,
        citizen: 'Citizen Auditor (Public Social Audit)',
      };
      
      success('Session Authenticated', `Welcome, ${customName || 'User'}! Logged in as ${roleLabels[targetRole]}`);
      setIsAuthenticating(false);

      if (targetRole === 'citizen') {
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
                    Select your authorized administrative role and credentials
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
                  {/* Role 1: Ministry Officer (Modi Jii) */}
                  <div
                    onClick={() => handleRoleSelect('officer', 'Modi Jii', 'PMO & MoSPI National Wing, New Delhi', 'Meloni')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRole === 'officer'
                        ? 'border-[#003580] bg-blue-50/70 shadow-sm ring-1 ring-[#003580]'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-[#003580]">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      {selectedRole === 'officer' ? (
                        <span className="w-4 h-4 rounded-full bg-[#003580] text-white flex items-center justify-center text-[10px]">✓</span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-gray-300"></span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-gray-900">Ministry Officer</div>
                    <div className="text-[11px] font-semibold text-blue-800 mt-0.5">Modi Jii</div>
                    <div className="mt-2 text-[9.5px] text-blue-900 bg-blue-100/80 px-1.5 py-0.5 rounded font-semibold inline-block">
                      Password: Meloni
                    </div>
                  </div>

                  {/* Role 2: District Collector (Tukaram Mundhe) */}
                  <div
                    onClick={() => handleRoleSelect('collector', 'Tukaram Mundhe', 'District Magistrate & Collector, Pune', 'Password')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRole === 'collector'
                        ? 'border-[#003580] bg-blue-50/70 shadow-sm ring-1 ring-[#003580]'
                        : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      {selectedRole === 'collector' ? (
                        <span className="w-4 h-4 rounded-full bg-[#003580] text-white flex items-center justify-center text-[10px]">✓</span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-gray-300"></span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-gray-900">District Collector</div>
                    <div className="text-[11px] font-semibold text-amber-800 mt-0.5">Tukaram Mundhe</div>
                    <div className="mt-2 text-[9.5px] text-amber-900 bg-amber-100/80 px-1.5 py-0.5 rounded font-semibold inline-block">
                      Password: Password
                    </div>
                  </div>

                  {/* Role 3: Citizen Auditor */}
                  <div
                    onClick={() => handleRoleSelect('citizen', 'Rahul G. (Citizen Auditor)', 'Pune Constituency', '')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRole === 'citizen'
                        ? 'border-[#003580] bg-blue-50/70 shadow-sm ring-1 ring-[#003580]'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      {selectedRole === 'citizen' ? (
                        <span className="w-4 h-4 rounded-full bg-[#003580] text-white flex items-center justify-center text-[10px]">✓</span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-gray-300"></span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-gray-900">Citizen Auditor</div>
                    <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">Public Social Audit</div>
                    <div className="mt-2 text-[9.5px] text-emerald-900 bg-emerald-100/80 px-1.5 py-0.5 rounded font-semibold inline-block">
                      Public Access (No Pass)
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Credentials & Password Details */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 text-xs space-y-2.5">
                <div className="font-semibold text-gray-800 flex items-center justify-between">
                  <span>2. Active Credentials &amp; Security:</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                    ✓ Verified Credentials
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Authenticated Name</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      placeholder="e.g. Modi Jii"
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#003580] font-semibold text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Administrative Jurisdiction</label>
                    <input
                      type="text"
                      value={customJurisdiction}
                      onChange={e => setCustomJurisdiction(e.target.value)}
                      placeholder="e.g. PMO / Pune District"
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#003580] text-gray-800"
                    />
                  </div>
                </div>

                {/* Password Input Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-[#003580]" />
                      <span>Security Password</span>
                    </label>
                    <span className="text-[10px] text-blue-800 font-medium">
                      {selectedRole === 'officer' && '(Enter: Meloni)'}
                      {selectedRole === 'collector' && '(Enter: Password)'}
                      {selectedRole === 'citizen' && '(Public Guest Access)'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={selectedRole === 'citizen' ? 'No password required' : 'Enter password'}
                      disabled={selectedRole === 'citizen'}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#003580] pr-8 font-medium disabled:bg-gray-100 disabled:text-gray-400"
                    />
                    {selectedRole !== 'citizen' && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-700 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Capability Checklist preview */}
              <div className="flex items-center gap-2.5 text-[11px] text-gray-600 bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                <Award className="w-4 h-4 text-[#003580] shrink-0" />
                <span>
                  {selectedRole === 'officer' && 'Full National Access: AI Model Pipeline, Sector Analytics, Data Quality, Macro Forensics.'}
                  {selectedRole === 'collector' && 'District Nodal Access: Field Inspection Docket Generator, Overlap Radar, Alert Queue.'}
                  {selectedRole === 'citizen' && 'Public Citizen Access: Public Works Transparency, Progress Photo Viewer, Grievance Loop.'}
                </span>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="pt-3.5 mt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2 items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  handleRoleSelect('officer', 'Modi Jii', 'PMO & MoSPI National Wing, New Delhi', 'Meloni');
                  executeLogin('officer');
                }}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>⚡ 1-Click Modi Jii Access</span>
              </button>

              <button
                type="button"
                onClick={() => executeLogin()}
                disabled={isAuthenticating}
                className="w-full sm:w-auto px-7 py-2.5 bg-[#003580] hover:bg-[#002860] text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
