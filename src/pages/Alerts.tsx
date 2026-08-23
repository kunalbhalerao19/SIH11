import { useState } from 'react';
import { ALERTS } from '../data/demoData';
import type { Alert, AlertSeverity, AlertStatus } from '../types';
import { PageHeader, SectionCard, KpiCard, ActionButton } from '../components/ui';
import { Bell, AlertTriangle, AlertCircle, CheckCircle, MessageSquare, User, Clock, Info, ChevronRight } from 'lucide-react';

const SEVERITY_CONFIG: Record<AlertSeverity, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  CRITICAL: { color: '#991b1b', bg: '#fee2e2', icon: <AlertTriangle size={13} color="#991b1b" />, label: 'CRITICAL' },
  HIGH: { color: '#9a3412', bg: '#fff7ed', icon: <AlertCircle size={13} color="#9a3412" />, label: 'HIGH' },
  MEDIUM: { color: '#92400e', bg: '#fffbeb', icon: <Info size={13} color="#92400e" />, label: 'MEDIUM' },
  LOW: { color: '#374151', bg: '#f9fafb', icon: <Bell size={13} color="#374151" />, label: 'LOW' },
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <KpiCard title="Total Alerts" value={String(ALERTS.length)} icon={<Bell size={16} color="#003580" />} color="#003580" />
        <KpiCard title="Critical Alerts" value={String(critCount)} icon={<AlertTriangle size={16} color="#dc2626" />} color="#dc2626" />
        <KpiCard title="High Severity" value={String(highCount)} icon={<AlertCircle size={16} color="#ea580c" />} color="#ea580c" />
        <KpiCard title="Open / Unresolved" value={String(openCount)} icon={<Clock size={16} color="#d97706" />} color="#d97706" />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16, padding: '10px 14px', background: 'white', border: '1px solid #e5e7eb', borderRadius: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Filters:</span>
        {[
          { label: 'Severity', options: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], value: filterSeverity, onChange: setFilterSeverity },
          { label: 'Status', options: ['Open', 'Under Review', 'Resolved', 'False Positive'], value: filterStatus, onChange: setFilterStatus },
          { label: 'State', options: ['Maharashtra', 'Bihar', 'Rajasthan', 'Tamil Nadu'], value: filterState, onChange: setFilterState },
        ].map(f => (
          <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 11, color: '#6b7280' }}>{f.label}</label>
            <select value={f.value} onChange={e => f.onChange(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '4px 8px', fontSize: 12 }}>
              <option value="">All</option>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 'auto' }}>Showing {filtered.length} of {ALERTS.length} alerts</span>
      </div>

      {/* Alert Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(alert => {
          const cfg = SEVERITY_CONFIG[alert.severity];
          const status = statuses[alert.alert_id] || alert.status;
          const isExpanded = expandedId === alert.alert_id;
          const comment = comments[alert.alert_id] || alert.investigation_comment;

          const statusColors: Record<string, string> = {
            Open: '#dc2626', 'Under Review': '#d97706', Resolved: '#16a34a', 'False Positive': '#6b7280',
          };

          return (
            <div
              key={alert.alert_id}
              style={{
                background: 'white', borderRadius: 6,
                border: '1px solid #e5e7eb',
                borderLeft: `4px solid ${cfg.color}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}
                onClick={() => setExpandedId(isExpanded ? null : alert.alert_id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {cfg.icon}
                    <span style={{ background: cfg.bg, color: cfg.color, padding: '1px 7px', borderRadius: 3, fontSize: 10, fontWeight: 800 }}>{cfg.label}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{alert.alert_id}</span>
                    {alert.project_id && (
                      <span style={{ fontSize: 11, color: '#003580', fontWeight: 600 }}>{alert.project_id}</span>
                    )}
                    <span style={{
                      background: (statusColors[status] || '#6b7280') + '20',
                      color: statusColors[status] || '#6b7280',
                      padding: '1px 7px', borderRadius: 3, fontSize: 10, fontWeight: 600,
                    }}>{status}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{alert.title}</div>
                  <div style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.5 }}>{alert.description}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                    {alert.state && <span style={{ fontSize: 10, background: '#f3f4f6', padding: '2px 6px', borderRadius: 3, color: '#374151' }}>📍 {alert.state}{alert.district ? `, ${alert.district}` : ''}</span>}
                    <span style={{ fontSize: 10, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={10} /> {formatAlertDate(alert.created_at)}
                    </span>
                    {alert.assigned_to && (
                      <span style={{ fontSize: 10, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <User size={10} /> {alert.assigned_to}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} color="#9ca3af" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid #f3f4f6', padding: '12px 16px', background: '#fafafa' }}>
                  {comment && (
                    <div style={{ marginBottom: 10, padding: '8px 12px', background: '#f0f9ff', borderRadius: 6, border: '1px solid #bae6fd', fontSize: 11, color: '#0c4a6e' }}>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>Investigation Comment:</div>
                      {comment}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {status === 'Open' && (
                      <button onClick={() => handleMarkReviewed(alert.alert_id)} style={{ background: '#003580', color: 'white', border: 'none', padding: '5px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                        Mark as Under Review
                      </button>
                    )}
                    {status !== 'Resolved' && (
                      <button onClick={() => handleResolve(alert.alert_id)} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '5px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => setShowAssign(p => ({ ...p, [alert.alert_id]: !p[alert.alert_id] }))}
                      style={{ background: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '5px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                    >
                      Assign Officer
                    </button>
                    <button
                      onClick={() => setShowComment(p => ({ ...p, [alert.alert_id]: !p[alert.alert_id] }))}
                      style={{ background: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '5px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                    >
                      Add Comment
                    </button>
                    {alert.project_id && (
                      <button style={{ background: 'white', color: '#003580', border: '1px solid #003580', padding: '5px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                        View Project
                      </button>
                    )}
                    <button
                      onClick={() => setStatuses(p => ({ ...p, [alert.alert_id]: 'False Positive' }))}
                      style={{ background: 'white', color: '#6b7280', border: '1px solid #e5e7eb', padding: '5px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                    >
                      False Positive
                    </button>
                  </div>

                  {showAssign[alert.alert_id] && (
                    <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                      <input
                        placeholder="Officer name..."
                        value={assignInput[alert.alert_id] || ''}
                        onChange={e => setAssignInput(p => ({ ...p, [alert.alert_id]: e.target.value }))}
                        style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '5px 10px', fontSize: 12, flex: 1 }}
                      />
                      <button style={{ background: '#003580', color: 'white', border: 'none', padding: '5px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                        Assign
                      </button>
                    </div>
                  )}

                  {showComment[alert.alert_id] && (
                    <div style={{ marginTop: 10 }}>
                      <textarea
                        placeholder="Add investigation comment..."
                        value={commentInput[alert.alert_id] || ''}
                        onChange={e => setCommentInput(p => ({ ...p, [alert.alert_id]: e.target.value }))}
                        style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '8px', fontSize: 12, width: '100%', minHeight: 60, resize: 'vertical' }}
                      />
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <button onClick={() => handleAddComment(alert.alert_id)} style={{ background: '#003580', color: 'white', border: 'none', padding: '5px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Save Comment</button>
                        <button onClick={() => setShowComment(p => ({ ...p, [alert.alert_id]: false }))} style={{ background: 'none', border: '1px solid #e5e7eb', padding: '5px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 13 }}>
            No alerts match the selected filters.
          </div>
        )}
      </div>

      {/* Workflow */}
      <div style={{ marginTop: 20, padding: '16px 20px', background: 'white', border: '1px solid #e5e7eb', borderRadius: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Anomaly Investigation Workflow</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
          {[
            'AI Detects Anomaly', 'Alert Generated', 'Officer Opens Project',
            'Reviews AI Explanation', 'Adds Investigation Notes', 'Status Updated', 'Decision Made'
          ].map((step, i, arr) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ padding: '8px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#1e40af', whiteSpace: 'nowrap' }}>
                {step}
              </div>
              {i < arr.length - 1 && <ChevronRight size={16} color="#9ca3af" style={{ flexShrink: 0, margin: '0 2px' }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
