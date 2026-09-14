import { useState } from 'react';
import { ALERTS } from '../data/demoData';
import type { AlertSeverity, AlertStatus } from '../types';
import { PageHeader, KpiCard } from '../components/ui';
import { Bell, AlertTriangle, AlertCircle, User, Info, Clock, ChevronRight, MapPin } from 'lucide-react';

const SEVERITY_CONFIG: Record<AlertSeverity, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  CRITICAL: { color: '#ef4444', bg: '#fee2e2', icon: <AlertTriangle size={13} className="text-red-600" />, label: 'CRITICAL' },
  HIGH: { color: '#f97316', bg: '#fff7ed', icon: <AlertCircle size={13} className="text-orange-600" />, label: 'HIGH' },
  MEDIUM: { color: '#f59e0b', bg: '#fffbeb', icon: <Info size={13} className="text-amber-600" />, label: 'MEDIUM' },
  LOW: { color: '#64748b', bg: '#f9fafb', icon: <Bell size={13} className="text-slate-500" />, label: 'LOW' },
};

function formatAlertDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function Alerts() {
  const [filterSeverity, setFilterSeverity] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterState, setFilterState] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, AlertStatus>>({});
  const [assignInput, setAssignInput] = useState<Record<string, string>>({});
  const [showAssign, setShowAssign] = useState<Record<string, boolean>>({});
  const [showComment, setShowComment] = useState<Record<string, boolean>>({});

  const filtered = ALERTS.filter(a => {
    if (filterSeverity && a.severity !== filterSeverity) return false;
    const status = statuses[a.alert_id] || a.status;
    if (filterStatus && status !== filterStatus) return false;
    if (filterState && a.state !== filterState) return false;
    return true;
  });

  const critCount = ALERTS.filter(a => a.severity === 'CRITICAL').length;
  const highCount = ALERTS.filter(a => a.severity === 'HIGH').length;
  const openCount = ALERTS.filter(a => (statuses[a.alert_id] || a.status) === 'Open').length;

  const handleMarkReviewed = (alert_id: string) => {
    setStatuses(p => ({ ...p, [alert_id]: 'Under Review' }));
  };
  const handleResolve = (alert_id: string) => {
    setStatuses(p => ({ ...p, [alert_id]: 'Resolved' }));
  };
  const handleAddComment = (alert_id: string) => {
    if (commentInput[alert_id]) {
      setComments(p => ({ ...p, [alert_id]: commentInput[alert_id] }));
      setCommentInput(p => ({ ...p, [alert_id]: '' }));
      setShowComment(p => ({ ...p, [alert_id]: false }));
    }
  };

  return (
    <div>
      <PageHeader title="Alert Center" subtitle="AI-generated monitoring alerts requiring official attention" />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <KpiCard title="Total Alerts" value={String(ALERTS.length)} icon={<Bell size={16} color="#003580" />} color="#003580" />
        <KpiCard title="Critical Alerts" value={String(critCount)} icon={<AlertTriangle size={16} color="#dc2626" />} color="#dc2626" />
        <KpiCard title="High Severity" value={String(highCount)} icon={<AlertCircle size={16} color="#ea580c" />} color="#ea580c" />
        <KpiCard title="Open / Unresolved" value={String(openCount)} icon={<Clock size={16} color="#d97706" />} color="#d97706" />
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center mb-4 p-2.5 px-3.5 bg-white border border-gray-200 rounded-md">
        <span className="text-xs font-semibold text-slate-700">Filters:</span>
        {[
          { label: 'Severity', options: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], value: filterSeverity, onChange: setFilterSeverity },
          { label: 'Status', options: ['Open', 'Under Review', 'Resolved', 'False Positive'], value: filterStatus, onChange: setFilterStatus },
          { label: 'State', options: ['Maharashtra', 'Bihar', 'Rajasthan', 'Tamil Nadu'], value: filterState, onChange: setFilterState },
        ].map(f => (
          <div key={f.label} className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-500 font-semibold">{f.label}</label>
            <select
              value={f.value}
              onChange={e => f.onChange(e.target.value)}
              className="border border-slate-300 bg-white text-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="">All</option>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <span className="text-[11px] text-slate-400 ml-auto">Showing {filtered.length} of {ALERTS.length} alerts</span>
      </div>

      {/* Alert Cards */}
      <div className="flex flex-col gap-3">
        {filtered.map(alert => {
          const cfg = SEVERITY_CONFIG[alert.severity];
          const status = statuses[alert.alert_id] || alert.status;
          const isExpanded = expandedId === alert.alert_id;
          const comment = comments[alert.alert_id] || alert.investigation_comment;

          const statusBadgeColors: Record<string, string> = {
            Open: 'bg-red-50 text-red-800 border-red-200',
            'Under Review': 'bg-amber-50 text-amber-800 border-amber-200',
            Resolved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            'False Positive': 'bg-slate-50 text-slate-700 border-slate-200',
          };

          return (
            <div
              key={alert.alert_id}
              className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden"
              style={{ borderLeft: `4px solid ${cfg.color}` }}
            >
              {/* Header */}
              <div
                className="p-3.5 px-4 cursor-pointer flex items-start justify-between gap-3"
                onClick={() => setExpandedId(isExpanded ? null : alert.alert_id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {cfg.icon}
                    <span style={{ background: cfg.bg, color: cfg.color }} className="px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {cfg.label}
                    </span>
                    <span className="text-[11px] text-slate-400">{alert.alert_id}</span>
                    {alert.project_id && (
                      <span className="text-[11px] text-[#003580] font-semibold">{alert.project_id}</span>
                    )}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${statusBadgeColors[status] || 'bg-slate-100 text-slate-700'}`}>
                      {status}
                    </span>
                  </div>
                  <div className="text-[13px] font-bold text-slate-900 mb-1">{alert.title}</div>
                  <div className="text-[11.5px] text-slate-600 leading-relaxed">{alert.description}</div>
                  <div className="flex gap-2.5 mt-2 items-center flex-wrap">
                    {alert.state && (
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 flex items-center gap-1">
                        <MapPin size={10} className="text-slate-500 shrink-0" />
                        <span>{alert.state}{alert.district ? `, ${alert.district}` : ''}</span>
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {formatAlertDate(alert.created_at)}
                    </span>
                    {alert.assigned_to && (
                      <span className="text-[10px] text-blue-700 flex items-center gap-1">
                        <User size={10} /> {alert.assigned_to}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} className={`text-slate-400 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-3.5 px-4 bg-slate-50/70">
                  {comment && (
                    <div className="mb-2.5 p-2.5 bg-blue-50 rounded border border-blue-200 text-[11px] text-blue-950">
                      <div className="font-semibold mb-0.5">Investigation Comment:</div>
                      {comment}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {status === 'Open' && (
                      <button
                        onClick={() => handleMarkReviewed(alert.alert_id)}
                        className="bg-[#003580] hover:opacity-90 text-white px-3 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors"
                      >
                        Mark as Under Review
                      </button>
                    )}
                    {status !== 'Resolved' && (
                      <button
                        onClick={() => handleResolve(alert.alert_id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => setShowAssign(p => ({ ...p, [alert.alert_id]: !p[alert.alert_id] }))}
                      className="bg-white text-slate-700 border border-slate-300 px-3 py-1 rounded text-[11px] font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      Assign Officer
                    </button>
                    <button
                      onClick={() => setShowComment(p => ({ ...p, [alert.alert_id]: !p[alert.alert_id] }))}
                      className="bg-white text-slate-700 border border-slate-300 px-3 py-1 rounded text-[11px] font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      Add Comment
                    </button>
                    {alert.project_id && (
                      <button className="bg-white text-[#003580] border border-[#003580] px-3 py-1 rounded text-[11px] font-semibold cursor-pointer hover:bg-blue-50 transition-colors">
                        View Project
                      </button>
                    )}
                    <button
                      onClick={() => setStatuses(p => ({ ...p, [alert.alert_id]: 'False Positive' }))}
                      className="bg-white text-slate-500 border border-slate-300 px-3 py-1 rounded text-[11px] font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      False Positive
                    </button>
                  </div>

                  {showAssign[alert.alert_id] && (
                    <div className="mt-2.5 flex gap-2">
                      <input
                        placeholder="Officer name..."
                        value={assignInput[alert.alert_id] || ''}
                        onChange={e => setAssignInput(p => ({ ...p, [alert.alert_id]: e.target.value }))}
                        className="border border-slate-300 bg-white text-slate-900 rounded px-2.5 py-1 text-xs flex-1 focus:outline-none focus:border-blue-500"
                      />
                      <button className="bg-[#003580] hover:opacity-90 text-white px-3 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors">
                        Assign
                      </button>
                    </div>
                  )}

                  {showComment[alert.alert_id] && (
                    <div className="mt-2.5">
                      <textarea
                        placeholder="Add investigation comment..."
                        value={commentInput[alert.alert_id] || ''}
                        onChange={e => setCommentInput(p => ({ ...p, [alert.alert_id]: e.target.value }))}
                        className="border border-slate-300 bg-white text-slate-900 rounded p-2 text-xs w-full min-h-[60px] focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex gap-2 mt-1.5">
                        <button
                          onClick={() => handleAddComment(alert.alert_id)}
                          className="bg-[#003580] hover:opacity-90 text-white px-3 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors"
                        >
                          Save Comment
                        </button>
                        <button
                          onClick={() => setShowComment(p => ({ ...p, [alert.alert_id]: false }))}
                          className="border border-slate-300 text-slate-700 px-3 py-1 rounded text-[11px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center p-10 text-slate-400 text-[13px]">
            No alerts match the selected filters.
          </div>
        )}
      </div>

      {/* Workflow */}
      <div className="mt-5 p-4 px-5 bg-white border border-gray-200 rounded-md">
        <div className="text-[13px] font-bold text-slate-900 mb-3">Anomaly Investigation Workflow</div>
        <div className="flex items-center gap-0 overflow-x-auto pb-1">
          {[
            'AI Detects Anomaly', 'Alert Generated', 'Officer Opens Project',
            'Reviews AI Explanation', 'Adds Investigation Notes', 'Status Updated', 'Decision Made'
          ].map((step, i, arr) => (
            <div key={step} className="flex items-center">
              <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-[11px] font-semibold text-blue-900 whitespace-nowrap">
                {step}
              </div>
              {i < arr.length - 1 && <ChevronRight size={16} className="text-slate-400 shrink-0 mx-0.5" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
