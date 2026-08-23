interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: { value: string; up: boolean };
  border?: string;
}

export function KpiCard({ title, value, subtitle, icon, color = '#003580', trend, border }: KpiCardProps) {
  return (
    <div style={{
      background: 'white',
      border: `1px solid ${border || '#e5e7eb'}`,
      borderTop: `3px solid ${color}`,
      borderRadius: 6,
      padding: '14px 16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
            {title}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1 }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{subtitle}</div>
          )}
          {trend && (
            <div style={{
              fontSize: 11, marginTop: 6, display: 'flex', alignItems: 'center', gap: 3,
              color: trend.up ? '#16a34a' : '#dc2626',
              fontWeight: 600,
            }}>
              {trend.up ? '▲' : '▼'} {trend.value}
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            width: 40, height: 40, background: `${color}15`, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  noPadding?: boolean;
}

export function SectionCard({ title, subtitle, children, actions, noPadding }: SectionCardProps) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 6,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111827' }}>{title}</h3>
          {subtitle && <p style={{ margin: 0, fontSize: 11, color: '#6b7280', marginTop: 2 }}>{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div style={noPadding ? {} : { padding: '12px 16px' }}>
        {children}
      </div>
    </div>
  );
}

interface FilterBarProps {
  filters: { label: string; options: string[]; value: string; onChange: (v: string) => void }[];
}

export function FilterBar({ filters }: FilterBarProps) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 6,
      padding: '10px 16px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      alignItems: 'center',
      marginBottom: 16,
    }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Filters:</span>
      {filters.map(f => (
        <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>{f.label}</label>
          <select
            value={f.value}
            onChange={e => f.onChange(e.target.value)}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: 4,
              padding: '4px 24px 4px 8px',
              fontSize: 12,
              background: 'white',
              color: '#374151',
              cursor: 'pointer',
              appearance: 'auto',
            }}
          >
            <option value="">All</option>
            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}

export function PageHeader({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#003580' }}>{title}</h2>
        {badge}
      </div>
      {subtitle && <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{subtitle}</p>}
    </div>
  );
}

export function Table({ headers, children, compact }: { headers: string[]; children: React.ReactNode; compact?: boolean }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="gov-table" style={compact ? { fontSize: 12 } : {}}>
        <thead>
          <tr>
            {headers.map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    'Completed': { bg: '#dcfce7', color: '#166534' },
    'Ongoing': { bg: '#dbeafe', color: '#1e40af' },
    'Sanctioned': { bg: '#e0e7ff', color: '#3730a3' },
    'Recommended': { bg: '#f3f4f6', color: '#374151' },
    'Non-Progress': { bg: '#fee2e2', color: '#991b1b' },
    'Dropped': { bg: '#fef2f2', color: '#7f1d1d' },
    'Open': { bg: '#fee2e2', color: '#991b1b' },
    'Under Review': { bg: '#fff7ed', color: '#9a3412' },
    'Verified': { bg: '#dcfce7', color: '#166534' },
    'Resolved': { bg: '#f0fdf4', color: '#15803d' },
    'False Positive': { bg: '#f3f4f6', color: '#374151' },
  };
  const c = colors[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      background: c.bg, color: c.color, padding: '2px 8px', borderRadius: 4,
      fontSize: 11, fontWeight: 600,
    }}>{status}</span>
  );
}

export function Pagination({
  page, total, perPage, onPage
}: { page: number; total: number; perPage: number; onPage: (p: number) => void }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
      <span style={{ fontSize: 12, color: '#6b7280' }}>
        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
      </span>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onPage(p)}
          style={{
            width: 28, height: 28, borderRadius: 4,
            border: p === page ? '1px solid #003580' : '1px solid #e5e7eb',
            background: p === page ? '#003580' : 'white',
            color: p === page ? 'white' : '#374151',
            fontSize: 12, cursor: 'pointer', fontWeight: p === page ? 600 : 400,
          }}
        >{p}</button>
      ))}
    </div>
  );
}

export function ActionButton({ label, onClick, variant = 'primary' }: {
  label: string; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: '#003580', color: 'white', border: '1px solid #003580' },
    secondary: { background: 'white', color: '#003580', border: '1px solid #003580' },
    danger: { background: '#dc2626', color: 'white', border: '1px solid #dc2626' },
    ghost: { background: 'transparent', color: '#374151', border: '1px solid #e5e7eb' },
  };
  return (
    <button
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: '5px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer',
        fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4,
      }}
    >{label}</button>
  );
}
