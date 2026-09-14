import React from 'react';

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
    <div
      className="gov-card transition-colors duration-200"
      style={{
        borderTop: `3px solid ${color}`,
        borderColor: border || undefined,
        padding: '14px 16px',
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
            {title}
          </div>
          <div className="text-[22px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {value}
          </div>
          {subtitle && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{subtitle}</div>
          )}
          {trend && (
            <div className={`text-[11px] mt-1.5 flex items-center gap-1 font-semibold ${trend.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.up ? '▲' : '▼'} {trend.value}
            </div>
          )}
        </div>
        {icon && (
          <div
            className="w-9 h-9 rounded flex items-center justify-center shrink-0"
            style={{ background: `${color}18` }}
          >
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
    <div className="gov-card p-0 overflow-hidden transition-colors duration-200">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-[#111e38] flex items-center justify-between">
        <div>
          <h3 className="m-0 text-[13px] font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          {subtitle && <p className="m-0 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className={noPadding ? '' : 'p-4'}>
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
    <div className="gov-card py-2.5 px-4 flex flex-wrap gap-3 items-center mb-4 transition-colors duration-200">
      <span className="text-[11.5px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Filter By:</span>
      {filters.map(f => (
        <div key={f.label} className="flex items-center gap-1.5">
          <label className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{f.label}</label>
          <select
            value={f.value}
            onChange={e => f.onChange(e.target.value)}
            className="border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:border-blue-500"
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
    <div className="mb-4.5">
      <div className="flex items-center gap-2.5 mb-0.5">
        <h2 className="m-0 text-[19px] font-bold text-[#003580] dark:text-[#60a5fa] tracking-tight">{title}</h2>
        {badge}
      </div>
      {subtitle && <p className="m-0 text-[12.5px] text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}

export function Table({ headers, children, compact }: { headers: string[]; children: React.ReactNode; compact?: boolean }) {
  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-slate-800 rounded">
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
  const statusClasses: Record<string, string> = {
    'Completed': 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    'Ongoing': 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
    'Sanctioned': 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
    'Recommended': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
    'Non-Progress': 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
    'Dropped': 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
    'Open': 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
    'Under Review': 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    'Verified': 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    'Resolved': 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    'False Positive': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
  };
  const cls = statusClasses[status] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700';
  return (
    <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold inline-block ${cls}`}>
      {status}
    </span>
  );
}

export function Pagination({
  page, total, perPage, onPage
}: { page: number; total: number; perPage: number; onPage: (p: number) => void }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1.5 justify-end mt-3">
      <span className="text-[11.5px] text-slate-500 dark:text-slate-400">
        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
      </span>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`min-w-[26px] h-[26px] rounded px-1.5 text-[11.5px] cursor-pointer font-medium border transition-colors ${
            p === page
              ? 'bg-[#003580] dark:bg-blue-600 text-white border-[#003580] dark:border-blue-600 font-bold'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >{p}</button>
      ))}
    </div>
  );
}

export function ActionButton({ label, onClick, variant = 'primary' }: {
  label: string; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}) {
  const variantClasses: Record<string, string> = {
    primary: 'bg-[#003580] dark:bg-blue-600 text-white border-[#003580] dark:border-blue-600 hover:opacity-90',
    secondary: 'bg-white dark:bg-slate-800 text-[#003580] dark:text-blue-400 border-[#003580] dark:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700',
    ghost: 'bg-transparent text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded text-xs cursor-pointer font-semibold inline-flex items-center gap-1 border transition-colors ${variantClasses[variant]}`}
    >{label}</button>
  );
}
