import { useState } from 'react';
import { PageHeader, SectionCard } from '../components/ui';
import {
  FileText, Download, Printer, BarChart3, AlertTriangle, IndianRupee,
  Users, Map, Clock, CheckCircle, RefreshCw
} from 'lucide-react';
import { PROJECTS, ANOMALIES, KPI, MPs, STATES, SECTORS } from '../data/demoData';
import { formatCrore, formatNumber } from '../lib/utils';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  count: string;
  border: string;
}

export default function Reports() {
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState<Record<string, boolean>>({});

  const currentDateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const REPORTS: ReportCard[] = [
    { id: 'anomaly', title: 'AI Anomaly Report', description: 'All AI-detected anomalies with risk scores, contributing factors, and investigation status.', icon: <AlertTriangle size={20} color="#dc2626" />, count: `${formatNumber(ANOMALIES.length)} anomalies`, border: '#dc2626' },
    { id: 'state-perf', title: 'State Performance Report', description: 'State-wise fund utilization, completion rates, anomaly counts, and risk assessments.', icon: <Map size={20} color="#1e40af" />, count: `${STATES.length} states`, border: '#1e40af' },
    { id: 'mp-perf', title: 'MP Performance Report', description: 'MP-wise efficiency scores, expenditure analysis, and project completion statistics.', icon: <Users size={20} color="#7c3aed" />, count: `${formatNumber(MPs.length)} MPs`, border: '#7c3aed' },
    { id: 'fund', title: 'Fund Utilization Report', description: 'Year-wise and state-wise fund release, utilization, and unspent balance tracking.', icon: <IndianRupee size={20} color="#16a34a" />, count: `${formatCrore(KPI.total_funds_released)} tracked`, border: '#16a34a' },
    { id: 'high-risk', title: 'High Risk Project Report', description: 'All HIGH and CRITICAL risk projects with AI explanations and recommended actions.', icon: <BarChart3 size={20} color="#ea580c" />, count: `${formatNumber(KPI.high_risk_projects)} projects`, border: '#ea580c' },
    { id: 'delayed', title: 'Delayed Project Report', description: 'All projects running behind the expected completion schedule with delay analysis.', icon: <Clock size={20} color="#d97706" />, count: `${formatNumber(PROJECTS.filter(p => p.delay_days > 0).length)} projects`, border: '#d97706' },
    { id: 'sector', title: 'Sector Analysis Report', description: 'Sector-wise spending patterns, anomaly rates, and performance comparison.', icon: <BarChart3 size={20} color="#0891b2" />, count: `${SECTORS.length} sectors`, border: '#0891b2' },
    { id: 'irregularity', title: 'Financial Irregularity Report', description: 'Potential financial irregularities detected by AI requiring official verification.', icon: <AlertTriangle size={20} color="#9f1239" />, count: `${KPI.financial_irregularities} flagged`, border: '#9f1239' },
    { id: 'completed', title: 'Completed Works Report', description: 'All completed works verification data including actual vs expected completion timelines.', icon: <CheckCircle size={20} color="#15803d" />, count: `${formatNumber(KPI.works_completed)} works`, border: '#15803d' },
  ];

  const handleGenerate = (id: string) => {
    setGenerating(p => ({ ...p, [id]: true }));
    setReady(p => ({ ...p, [id]: false }));
    setTimeout(() => {
      setGenerating(p => ({ ...p, [id]: false }));
      setReady(p => ({ ...p, [id]: true }));
    }, 1800);
  };

  return (
    <div>
      <PageHeader title="Reports" subtitle="Generate and export government-grade MPLADS monitoring reports" />

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-md p-3.5 mb-4 flex gap-2.5 flex-wrap items-center">
        <span className="text-xs font-semibold text-slate-700">Quick Export:</span>
        {[
          { label: 'All Projects CSV', icon: <Download size={12} /> },
          { label: 'Anomaly Summary', icon: <Download size={12} /> },
          { label: 'Print Dashboard', icon: <Printer size={12} /> },
          { label: 'Refresh Data', icon: <RefreshCw size={12} /> },
        ].map(btn => (
          <button
            key={btn.label}
            className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs cursor-pointer hover:bg-slate-50 transition-colors"
          >
            {btn.icon} {btn.label}
          </button>
        ))}
        <div className="ml-auto text-[11px] text-slate-400">
          Last refresh: {currentDateStr}
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {REPORTS.map(report => (
          <div
            key={report.id}
            className="bg-white border border-gray-200 rounded-md p-4 shadow-sm"
            style={{ borderTop: `3px solid ${report.border}` }}
          >
            <div className="flex items-start gap-3 mb-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: report.border + '15' }}
              >
                {report.icon}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-slate-900 mb-0.5">{report.title}</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">{report.description}</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-2.5 text-[11px] text-slate-400">
              <span>Records: <strong className="text-slate-700">{report.count}</strong></span>
              {ready[report.id] && (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle size={11} /> Report Ready
                </span>
              )}
              {!ready[report.id] && (
                <span>Last generated: {currentDateStr}</span>
              )}
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={() => handleGenerate(report.id)}
                disabled={generating[report.id]}
                className={`flex-1 py-1.5 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors ${
                  generating[report.id]
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-[#003580] hover:opacity-90 text-white cursor-pointer'
                }`}
              >
                {generating[report.id] ? (
                  <><RefreshCw size={11} className="animate-spin" /> Generating...</>
                ) : (
                  'Generate'
                )}
              </button>
              <button className="bg-white border border-slate-300 px-2.5 py-1.5 rounded text-[11px] cursor-pointer text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors">
                <FileText size={11} /> PDF
              </button>
              <button className="bg-white border border-slate-300 px-2.5 py-1.5 rounded text-[11px] cursor-pointer text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors">
                <Download size={11} /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled Reports */}
      <div className="mt-5">
        <SectionCard title="Automated Report Schedule" subtitle="Configure reports to be generated automatically">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: 'Daily Anomaly Summary', schedule: 'Every day at 06:00 IST', status: 'Active' },
              { label: 'Weekly State Performance', schedule: 'Every Monday at 08:00 IST', status: 'Active' },
              { label: 'Monthly MP Report', schedule: '1st of each month', status: 'Inactive' },
            ].map(sr => (
              <div
                key={sr.label}
                className="p-3 bg-slate-50 rounded-md border border-slate-200"
              >
                <div className="text-xs font-bold text-slate-900 mb-1">{sr.label}</div>
                <div className="text-[11px] text-slate-500 mb-1.5">{sr.schedule}</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  sr.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {sr.status}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
