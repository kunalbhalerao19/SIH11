import { useState } from 'react';
import { PROJECTS, STATES } from '../data/demoData';
import { StatusBadge } from '../components/ui';
import { Search, Flag, MapPin, User, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

let reportCounter = 100000;

export default function CitizenPortal() {
  const [filterState, setFilterState] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchMp, setSearchMp] = useState('');
  const [searched, setSearched] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Report form
  const [reportProject, setReportProject] = useState('');
  const [reportState, setReportState] = useState('');
  const [reportDistrict, setReportDistrict] = useState('');
  const [reportIssueType, setReportIssueType] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportContact, setReportContact] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportRef, setReportRef] = useState('');

  const results = searched
    ? PROJECTS.filter(p => {
        if (filterState && p.state !== filterState) return false;
        if (filterStatus && p.work_status !== filterStatus) return false;
        if (searchMp && !p.mp_name.toLowerCase().includes(searchMp.toLowerCase()) &&
          !p.constituency.toLowerCase().includes(searchMp.toLowerCase())) return false;
        return true;
      }).slice(0, 20)
    : [];

  const handleSearch = () => setSearched(true);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `RPT-${++reportCounter}`;
    setReportRef(ref);
    setReportSubmitted(true);
  };

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div style={{ background: '#003580', padding: '24px 32px', color: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
            Ministry of Statistics and Programme Implementation | Government of India
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            MPLADS Public Transparency Portal
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
            Track MPLAD Scheme projects in your constituency. Monitor fund utilization and project progress.
          </p>
          <div style={{ marginTop: 10, display: 'inline-block', background: '#FF6B00', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>
            ℹ Demo Environment — Data shown for demonstration purposes only
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>

        {/* Search Section */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: '20px', marginBottom: 20 }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 16, color: '#111827', fontWeight: 700 }}>
            Find Projects in Your Area
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>State</label>
              <select value={filterState} onChange={e => setFilterState(e.target.value)} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '8px 10px', fontSize: 13 }}>
                <option value="">All States</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>MP / Constituency</label>
              <div style={{ position: 'relative' }}>
                <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text" placeholder="MP name or constituency..."
                  value={searchMp} onChange={e => setSearchMp(e.target.value)}
                  style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '8px 10px 8px 30px', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Project Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '8px 10px', fontSize: 13 }}>
                <option value="">All</option>
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Sanctioned">Sanctioned</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleSearch}
            style={{ background: '#003580', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Search Projects
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Projects Found: {results.length}</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Demo data — not official records</span>
            </div>
            {results.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                No projects found. Try different filters.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#003580', color: 'white' }}>
                    <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: 12 }}>Project Name</th>
                    <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: 12 }}>State / Constituency</th>
                    <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: 12 }}>Sector</th>
                    <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: 12 }}>Status</th>
                    <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: 12 }}>Cost</th>
                    <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: 12 }}>Progress</th>
                    <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: 12 }}>Monitoring</th>
                    <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: 12 }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(p => (
                    <>
                      <tr key={p.project_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '9px 12px', fontWeight: 600, color: '#111827' }}>{p.work_name.slice(0, 42)}</td>
                        <td style={{ padding: '9px 12px', fontSize: 12, color: '#6b7280' }}>
                          <div>{p.state}</div>
                          <div style={{ fontSize: 11 }}>{p.constituency}</div>
                        </td>
                        <td style={{ padding: '9px 12px', fontSize: 12 }}>{p.sector}</td>
                        <td style={{ padding: '9px 12px' }}><StatusBadge status={p.work_status} /></td>
                        <td style={{ padding: '9px 12px', fontSize: 12, fontWeight: 600 }}>₹{p.sanctioned_cost}L</td>
                        <td style={{ padding: '9px 12px', minWidth: 100 }}>
                          <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden', marginBottom: 2 }}>
                            <div style={{ width: `${p.physical_progress}%`, height: '100%', background: p.physical_progress >= 70 ? '#16a34a' : '#d97706', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 11, color: '#6b7280' }}>{p.physical_progress}%</span>
                        </td>
                        <td style={{ padding: '9px 12px' }}>
                          {p.risk_level === 'HIGH' || p.risk_level === 'CRITICAL' ? (
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#d97706', background: '#fffbeb', padding: '2px 6px', borderRadius: 3 }}>Under Monitoring</span>
                          ) : (
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', background: '#f0fdf4', padding: '2px 6px', borderRadius: 3 }}>Normal</span>
                          )}
                        </td>
                        <td style={{ padding: '9px 12px' }}>
                          <button onClick={() => setExpandedId(expandedId === p.project_id ? null : p.project_id)} style={{ background: 'none', border: '1px solid #003580', color: '#003580', padding: '3px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Eye size={11} /> View
                          </button>
                        </td>
                      </tr>
                      {expandedId === p.project_id && (
                        <tr key={p.project_id + '-detail'}>
                          <td colSpan={8} style={{ padding: '14px 16px', background: '#f9fafb', borderBottom: '2px solid #003580' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 10 }}>
                              <div style={{ fontSize: 12 }}><span style={{ color: '#9ca3af' }}>MP: </span><strong>{p.mp_name}</strong></div>
                              <div style={{ fontSize: 12 }}><span style={{ color: '#9ca3af' }}>District: </span><strong>{p.district}</strong></div>
                              <div style={{ fontSize: 12 }}><span style={{ color: '#9ca3af' }}>Implementing Agency: </span><strong>{p.implementing_agency}</strong></div>
                              <div style={{ fontSize: 12 }}><span style={{ color: '#9ca3af' }}>Expected Completion: </span><strong>{p.expected_completion_date}</strong></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                              {[1, 2, 3].map(i => (
                                <div key={i} style={{ height: 60, background: '#e5e7eb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#9ca3af' }}>No photo available</div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Report an Issue */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Flag size={18} color="#dc2626" />
            <h2 style={{ margin: 0, fontSize: 16, color: '#111827', fontWeight: 700 }}>Report a Project Issue</h2>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6b7280' }}>
            Citizens can report issues with MPLAD projects in their area. Your report will be reviewed by official authorities.
          </p>

          {reportSubmitted ? (
            <div style={{ padding: '16px 20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <CheckCircle size={20} color="#16a34a" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>Thank you! Your report has been submitted.</div>
                <div style={{ fontSize: 12, color: '#15803d', marginTop: 2 }}>Reference Number: <strong>{reportRef}</strong></div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>Our team will review your report within 7 working days.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#374151' }}>Project Name / ID</label>
                  <input value={reportProject} onChange={e => setReportProject(e.target.value)} placeholder="Enter project name or ID..." style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '8px', fontSize: 13, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#374151' }}>State</label>
                  <select value={reportState} onChange={e => setReportState(e.target.value)} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '8px', fontSize: 13 }}>
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#374151' }}>District</label>
                  <input value={reportDistrict} onChange={e => setReportDistrict(e.target.value)} placeholder="District..." style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '8px', fontSize: 13, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#374151' }}>Issue Type *</label>
                  <select value={reportIssueType} onChange={e => setReportIssueType(e.target.value)} required style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '8px', fontSize: 13 }}>
                    <option value="">Select issue type</option>
                    <option>Project not found in locality</option>
                    <option>Work has stopped</option>
                    <option>Poor quality construction</option>
                    <option>Progress shown is incorrect</option>
                    <option>Funds misused</option>
                    <option>Other issue</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#374151' }}>Description *</label>
                <textarea
                  value={reportDesc} onChange={e => setReportDesc(e.target.value)} required
                  placeholder="Describe the issue in detail..."
                  style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '8px', fontSize: 13, minHeight: 80, resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#374151' }}>Contact (Optional)</label>
                <input value={reportContact} onChange={e => setReportContact(e.target.value)} placeholder="Phone or email (optional)..." style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '8px', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginTop: 14 }}>
                <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Submit Report
                </button>
              </div>
            </form>
          )}
        </div>

        <div style={{ marginTop: 20, padding: '10px 14px', background: 'white', borderRadius: 6, fontSize: 11, color: '#9ca3af', border: '1px solid #e5e7eb', textAlign: 'center' }}>
          This is a demo citizen portal. Official MPLADS data is available at <strong>mplads.mospi.gov.in</strong> |
          Data shown is synthetic and for SIH 2026 demonstration purposes only.
        </div>
      </div>
    </div>
  );
}
