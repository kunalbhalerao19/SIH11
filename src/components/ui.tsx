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
      background: '#ffffff',
      border: `1px solid ${border || '#e2e8f0'}`,
      borderTop: `3px solid ${color}`,
      borderRadius: 6,
      padding: '14px 16px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 6 }}>
            {title}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{subtitle}</div>
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
            width: 36, height: 36, background: `${color}12`, borderRadius: 4,
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
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 6,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e2e8f0',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{title}</h3>
          {subtitle && <p style={{ margin: 0, fontSize: 11, color: '#64748b', marginTop: 2 }}>{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div style={noPadding ? {} : { padding: '14px 16px' }}>
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
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 6,
      padding: '10px 16px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      alignItems: 'center',
      marginBottom: 16,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
    }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Filter By:</span>
      {filters.map(f => (
        <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{f.label}</label>
          <select
            value={f.value}
            onChange={e => f.onChange(e.target.value)}
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: 4,
              padding: '4px 24px 4px 8px',
              fontSize: 12,
              background: '#ffffff',
              color: '#334155',
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
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
        <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#003580', letterSpacing: '-0.01em' }}>{title}</h2>
        {badge}
      </div>
      {subtitle && <p style={{ margin: 0, fontSize: 12.5, color: '#64748b' }}>{subtitle}</p>}
    </div>
  );
}

export function Table({ headers, children, compact }: { headers: string[]; children: React.ReactNode; compact?: boolean }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 4 }}>
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
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    'Completed': { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
    'Ongoing': { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
    'Sanctioned': { bg: '#eef2ff', color: '#3730a3', border: '#c7d2fe' },
    'Recommended': { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
    'Non-Progress': { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
    'Dropped': { bg: '#fef2f2', color: '#7f1d1d', border: '#fecaca' },
    'Open': { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
    'Under Review': { bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
    'Verified': { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
    'Resolved': { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    'False Positive': { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
  };
  const c = colors[status] || { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      padding: '2px 7px', borderRadius: 4,
      fontSize: 11, fontWeight: 600, display: 'inline-block',
    }}>{status}</span>
  );
}

export function Pagination({
  page, total, perPage, onPage
}: { page: number; total: number; perPage: number; onPage: (p: number) => void }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginTop: 12 }}>
      <span style={{ fontSize: 11.5, color: '#64748b' }}>
        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
      </span>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onPage(p)}
          style={{
            minWidth: 26, height: 26, borderRadius: 4, padding: '0 6px',
            border: p === page ? '1px solid #003580' : '1px solid #cbd5e1',
            background: p === page ? '#003580' : '#ffffff',
            color: p === page ? '#ffffff' : '#334155',
            fontSize: 11.5, cursor: 'pointer', fontWeight: p === page ? 700 : 500,
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
    primary: { background: '#003580', color: '#ffffff', border: '1px solid #003580' },
    secondary: { background: '#ffffff', color: '#003580', border: '1px solid #003580' },
    danger: { background: '#dc2626', color: '#ffffff', border: '1px solid #dc2626' },
    ghost: { background: 'transparent', color: '#334155', border: '1px solid #cbd5e1' },
  };
  return (
    <button
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: '5px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer',
        fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4,
      }}
    >{label}</button>
  );
}
