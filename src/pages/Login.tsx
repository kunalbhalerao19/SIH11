import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserRole } from '../context/auth-context';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/useLanguage';
import { useToast } from '../context/useToast';
import {
  Shield, Home, Eye, EyeOff, Globe, Building2, Users, ArrowRight
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { success } = useToast();

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

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Prototype authentication for SIH 2026 hackathon demo:
    // Any valid role can be authenticated directly with default or custom credentials.
    setIsAuthenticating(true);
    setTimeout(() => {
      const defaultJurisdictions = {
        officer: 'PMO & MoSPI National Wing, New Delhi',
        collector: 'District Magistrate & Collector, Pune',
        citizen: 'Public Social Audit / Constituency',
      };

      const defaultNames = {
        officer: 'Ministry Nodal Officer',
        collector: 'District Magistrate',
        citizen: 'Citizen Auditor',
      };

      const finalName = customName.trim() || defaultNames[selectedRole];
      loginAs(selectedRole, finalName, defaultJurisdictions[selectedRole]);
      
      success('Session Authenticated', `Welcome, ${finalName}!`);
      setIsAuthenticating(false);

      if (selectedRole === 'citizen') {
        navigate('/citizen');
      } else {
        navigate('/dashboard');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-[#003580] selection:text-white">
      {/* 1. TOP BLUE GOVERNMENT APP BAR */}
      <header className="bg-[#1565C0] text-white px-4 sm:px-8 py-2.5 shadow-md flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Go to Home"
          >
            <Home className="w-5 h-5 text-white" />
          </button>
          <div className="h-5 w-[1px] bg-white/30 hidden sm:block"></div>
          <div className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-2">
            <span>भारत सरकार • Government of India</span>
            <span className="text-white/60 font-normal hidden md:inline">|</span>
            <span className="text-xs text-white/90 font-medium hidden md:inline">Ministry of Statistics &amp; PI</span>
          </div>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-xs font-semibold transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-white" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="text-xs text-white/80 hover:text-white underline transition-colors cursor-pointer hidden sm:block"
          >
            Public Portal
          </button>
        </div>
      </header>

      {/* 2. MAIN VIKASPEDIA-STYLE DUAL-PANEL BODY */}
      <main className="flex-1 flex flex-col lg:flex-row relative overflow-hidden bg-white">
        
        {/* LEFT WAVE ART PANEL (55% width on desktop) */}
        <div className="lg:w-[55%] relative bg-[#1565C0] overflow-hidden p-8 sm:p-12 lg:p-16 flex flex-col justify-between text-white min-h-[420px] lg:min-h-auto">
          {/* Decorative Layered Organic Waves */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Top Wave in Light Sky Blue */}
            <svg
              className="absolute top-0 left-0 w-full h-[65%] text-[#e3f2fd]"
              viewBox="0 0 800 600"
              preserveAspectRatio="none"
              fill="currentColor"
            >
              <path d="M0,0 L800,0 L800,180 C620,320 540,60 320,240 C180,360 80,280 0,380 Z" />
            </svg>

            {/* Middle Deep Navy Wave */}
            <svg
              className="absolute top-0 left-0 w-full h-[80%] text-[#0d47a1]"
              viewBox="0 0 800 600"
              preserveAspectRatio="none"
              fill="currentColor"
            >
              <path d="M0,0 L800,0 L800,280 C640,420 520,120 300,320 C140,460 60,380 0,500 Z" opacity="0.95" />
            </svg>
          </div>

          {/* Top Emblem and Brand Name in Left Panel */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-[#1565C0] p-1">
                <Shield className="w-7 h-7 text-[#1565C0]" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-slate-800 lg:text-slate-900">
                  MPLADS AI Insight
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  National Vigilance &amp; Decision Support
                </div>
              </div>
            </div>
          </div>

          {/* Hero Pitch & 3 Flow Step Cards */}
          <div className="relative z-10 space-y-8 mt-12 lg:mt-0">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Get Started<br />with Us
              </h1>
              <p className="text-sm text-blue-100 mt-3 max-w-md leading-relaxed font-normal">
                Ministry-grade artificial intelligence auditing ₹8,300+ Cr annual development funds across 543 Parliamentary constituencies.
              </p>
            </div>

            {/* 3 Step Cards in a Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Card 1 */}
              <div className="bg-white rounded-md p-4 text-slate-900 border border-slate-200">
                <div className="w-6 h-6 rounded bg-[#003580] text-white text-xs font-bold flex items-center justify-center mb-3">
                  1
                </div>
                <div className="text-xs font-bold text-slate-800 leading-snug">
                  Select Official Role
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Ministry, District Collector, or Citizen
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#1976D2] rounded-md p-4 text-white border border-white/20">
                <div className="w-6 h-6 rounded bg-white text-[#003580] text-xs font-bold flex items-center justify-center mb-3">
                  2
                </div>
                <div className="text-xs font-bold text-white leading-snug">
                  Verify Credentials
                </div>
                <div className="text-[10px] text-blue-100 mt-1">
                  Authorized access for governance
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#002860] rounded-md p-4 text-white border border-white/20">
                <div className="w-6 h-6 rounded bg-white text-[#002860] text-xs font-bold flex items-center justify-center mb-3">
                  3
                </div>
                <div className="text-xs font-bold text-white leading-snug">
                  Access AI Sentinel
                </div>
                <div className="text-[10px] text-blue-100 mt-1">
                  Real-time audit &amp; fraud prevention
                </div>
              </div>
            </div>
          </div>

          {/* Footer note in left wave */}
          <div className="relative z-10 text-[11px] text-blue-200 mt-8">
            Smart India Hackathon 2026 • MoSPI Problem Statement 26102
          </div>
        </div>

        {/* RIGHT SIGN-IN FORM PANEL (45% width on desktop) */}
        <div className="lg:w-[45%] bg-white p-6 sm:p-10 lg:p-14 flex flex-col justify-center items-center">
          <div className="w-full max-w-md space-y-6">
            
            {/* Top Logo / Emblem in Form */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 border-2 border-[#003580] mb-1">
                <Shield className="w-7 h-7 text-[#003580]" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                Sign in to MPLADS Sentinel
              </h2>
              <p className="text-xs text-slate-500">
                Official Ministry of Statistics &amp; Programme Implementation Portal
              </p>
            </div>

            {/* Quick Role Selection Buttons */}
            <div className="space-y-2 pt-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center">
                Select Sign-in Category:
              </label>

              <div className="grid grid-cols-3 gap-2">
                {/* Role 1: Ministry Officer */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('officer')}
                  className={`py-2 px-1.5 rounded border text-xs font-bold flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                    selectedRole === 'officer'
                      ? 'border-[#003580] bg-blue-50 text-[#003580] ring-1 ring-[#003580]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-[11px] truncate w-full text-center">Ministry Officer</span>
                </button>

                {/* Role 2: District Collector */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('collector')}
                  className={`py-2 px-1.5 rounded border text-xs font-bold flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                    selectedRole === 'collector'
                      ? 'border-[#003580] bg-blue-50 text-[#003580] ring-1 ring-[#003580]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-[11px] truncate w-full text-center">District Collector</span>
                </button>

                {/* Role 3: Citizen Auditor */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('citizen')}
                  className={`py-2 px-1.5 rounded border text-xs font-bold flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                    selectedRole === 'citizen'
                      ? 'border-[#003580] bg-blue-50 text-[#003580] ring-1 ring-[#003580]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-[11px] truncate w-full text-center">Citizen Auditor</span>
                </button>
              </div>
            </div>

            {/* Form Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">
                Credentials
              </span>
              <div className="border-t border-slate-200 w-full"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Officer / User Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {selectedRole === 'officer' && 'Ministry Officer Name *'}
                  {selectedRole === 'collector' && 'District Collector Name *'}
                  {selectedRole === 'citizen' && 'Citizen Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  placeholder={
                    selectedRole === 'officer'
                      ? 'Enter Officer Name'
                      : selectedRole === 'collector'
                      ? 'Enter Collector Name'
                      : 'Enter Citizen Name (Optional)'
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#003580] focus:bg-white transition-colors"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Security Password *</span>
                  {selectedRole === 'citizen' && (
                    <span className="text-[10px] text-emerald-600 font-normal">Public Access (No Password)</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={selectedRole === 'citizen' ? 'No password required' : 'Enter Password'}
                    disabled={selectedRole === 'citizen'}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#003580] focus:bg-white transition-colors pr-10 disabled:bg-slate-100 disabled:text-slate-400"
                  />
                  {selectedRole !== 'citizen' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-2.5 bg-[#003580] hover:bg-[#002860] text-white text-xs font-bold rounded shadow-sm hover:shadow transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>{isAuthenticating ? 'Authenticating...' : 'Sign in to Sentinel'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom Support Link */}
            <div className="text-center pt-2 space-y-1">
              <div className="text-xs text-slate-500">
                New User?{' '}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('citizen')}
                  className="text-[#1565C0] font-bold hover:underline cursor-pointer"
                >
                  Access as Citizen Auditor
                </button>
              </div>

              <div className="text-[11px] text-slate-400 pt-3">
                If you face any issues, write to{' '}
                <a href="mailto:support-mplads@mospi.gov.in" className="text-slate-600 hover:underline">
                  support-mplads@mospi.gov.in
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 3. BOTTOM FOOTER STRIP */}
      <footer className="bg-slate-900 text-slate-400 text-[11px] text-center py-2.5 border-t border-slate-800">
        © 2026 Ministry of Statistics &amp; Programme Implementation • Government of India • SIH 2026 Prototype
      </footer>
    </div>
  );
}
