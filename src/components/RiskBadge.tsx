import type { RiskLevel } from '../types';
import { getRiskBgColor, getRiskColor } from '../lib/riskEngine';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ level, score, size = 'md' }: RiskBadgeProps) {
  const bg = getRiskBgColor(level);
  const color = getRiskColor(level);
  const fontSize = size === 'sm' ? 10 : size === 'lg' ? 13 : 11;
  const padding = size === 'sm' ? '1px 6px' : size === 'lg' ? '4px 12px' : '2px 8px';

  return (
    <span style={{
      background: bg,
      color,
      border: `1px solid ${color}30`,
      padding,
      borderRadius: 4,
      fontSize,
      fontWeight: 700,
      letterSpacing: '0.04em',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      whiteSpace: 'nowrap',
    }}>
      {score !== undefined && <span style={{ fontVariantNumeric: 'tabular-nums' }}>{score}</span>}
      {level}
    </span>
  );
}

interface RiskScoreBarProps {
  score: number;
  showLabel?: boolean;
}

export function RiskScoreBar({ score, showLabel = true }: RiskScoreBarProps) {
  const color = score >= 81 ? '#dc2626' : score >= 61 ? '#ea580c' : score >= 31 ? '#d97706' : '#16a34a';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      {showLabel && <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 28, textAlign: 'right' }}>{score}</span>}
    </div>
  );
}
