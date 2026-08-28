import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Shield, UserCheck, Building2, Users, ArrowRight, Lock, CheckCircle2, Globe } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { loginAs, user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { success } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole>('officer');
  const [customName, setCustomName] = useState('');
  const [customJurisdiction, setCustomJurisdiction] = useState('');

  const handleLogin = (roleToLogin?: UserRole) => {
    const role = roleToLogin || selectedRole;
    loginAs(role, customName || undefined, customJurisdiction || undefined);
    
    const roleLabels = {
      officer: 'Ministry Officer (MoSPI)',
      collector: 'District Collector',
      citizen: 'Citizen Auditor',
    };
    
    success('Session Authenticated', `Logged in as ${roleLabels[role]}`);

    if (role === 'citizen') {
      navigate('/citizen');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
      {/* Top Government Header Strip */}
      <header className="bg-[#003580] text-white px-6 py-3 shadow-md flex justify-between items-center border-b-2 border-[#FF6B00]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <Shield className="w-5 h-5 text-[#FF6B00]" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide">भारत सरकार • GOVERNMENT OF INDIA</div>
            <div className="text-xs text-white/80">Ministry of Statistics & Programme Implementation (MoSPI)</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-xs font-semibold transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-xs text-white/80 hover:text-white underline transition-colors"
          >
            Back to Public Portal
          </button>
        </div>
      </header>

      {/* Main Login Form Area */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-2xl w-full overflow-hidden">
          {/* Header */}
          <div className="bg-slate-50 p-6 border-b border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#003580]/10 text-[#003580] mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[#003580]">MPLADS AI Insight • Sentinel Login</h1>
            <p className="text-xs text-gray-600 mt-1">
              Select your administrative role to access personalized vigilance and monitoring tools
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="p-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              1. Select Administrative Role:
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {/* Role 1: Ministry Officer */}
              <div
                onClick={() => setSelectedRole('officer')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === 'officer'
                    ? 'border-[#003580] bg-blue-50/60 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#003580]">
                    <Shield className="w-4 h-4" />
                  </div>
                  {selectedRole === 'officer' && <CheckCircle2 className="w-4 h-4 text-[#003580]" />}
                </div>
                <div className="font-bold text-xs text-gray-900">Ministry Officer</div>
                <div className="text-[11px] text-gray-500 mt-1">MoSPI National Wing</div>
                <div className="mt-3 text-[10px] text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded font-medium inline-block">
                  All 15 Pages & AI Models
                </div>
              </div>

              {/* Role 2: District Collector */}
              <div
                onClick={() => setSelectedRole('collector')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === 'collector'
                    ? 'border-[#003580] bg-blue-50/60 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                    <Building2 className="w-4 h-4" />
                  </div>
                  {selectedRole === 'collector' && <CheckCircle2 className="w-4 h-4 text-[#003580]" />}
                </div>
                <div className="font-bold text-xs text-gray-900">District Collector</div>
                <div className="text-[11px] text-gray-500 mt-1">District / DRDA</div>
                <div className="mt-3 text-[10px] text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded font-medium inline-block">
                  Field Audits & Triage
                </div>
              </div>

              {/* Role 3: Citizen Auditor */}
              <div
                onClick={() => setSelectedRole('citizen')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === 'citizen'
                    ? 'border-[#003580] bg-blue-50/60 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <Users className="w-4 h-4" />
                  </div>
                  {selectedRole === 'citizen' && <CheckCircle2 className="w-4 h-4 text-[#003580]" />}
                </div>
                <div className="font-bold text-xs text-gray-900">Citizen Auditor</div>
                <div className="text-[11px] text-gray-500 mt-1">Public Social Audit</div>
                <div className="mt-3 text-[10px] text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded font-medium inline-block">
                  Public Data & QR Grievance
                </div>
              </div>
            </div>

            {/* Optional Custom Credentials */}
            <div className="bg-slate-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-3">
              <div className="text-xs font-semibold text-gray-700">Optional Profile Customization:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Officer / User Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Verma, IAS"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#003580]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Jurisdiction / District:</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune / Maharashtra"
                    value={customJurisdiction}
                    onChange={e => setCustomJurisdiction(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#003580]"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <button
                type="button"
                onClick={() => handleLogin('officer')}
                className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              >
                ⚡ Instant Demo Login (Ministry Officer)
              </button>

              <button
                type="button"
                onClick={() => handleLogin()}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#003580] hover:bg-[#002860] text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Footer notice */}
          <div className="bg-slate-100 px-6 py-3 text-center border-t border-gray-200">
            <div className="text-[11px] text-gray-500">
              Smart India Hackathon 2026 Prototype • Problem Statement 26102 • Demo Access
            </div>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="bg-slate-900 text-white/60 text-[11px] text-center py-3 border-t border-slate-800">
        © 2026 Ministry of Statistics & Programme Implementation • Smart India Hackathon Prototype
      </footer>
    </div>
  );
}
