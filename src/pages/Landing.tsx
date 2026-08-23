import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  DollarSign,
  Activity,
  CheckCircle,
  Eye,
  FileText,
  Users,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', color: '#111', background: '#fff' }}>
      {/* Top Strip */}
      <div
        style={{
          background: '#1e3a5f',
          color: '#cdd8e8',
          textAlign: 'center',
          fontSize: '0.72rem',
          padding: '6px 16px',
          letterSpacing: '0.03em',
        }}
      >
        Ministry of Statistics and Programme Implementation &nbsp;|&nbsp; SIH 2026 Prototype
      </div>

      {/* Header */}
      <header
        style={{
          background: '#003580',
          color: '#fff',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldAlert size={22} color="#003580" />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#a8c4e0', letterSpacing: '0.04em' }}>
              भारत सरकार / Government of India
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.01em' }}>
              MPLADS AI Insight
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.5)',
              color: '#fff',
              borderRadius: '4px',
              padding: '7px 20px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#FF6B00',
              border: 'none',
              color: '#fff',
              borderRadius: '4px',
              padding: '7px 20px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(255,107,0,0.4)',
            }}
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          background: '#fff',
          padding: '56px 40px 48px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-block',
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: '4px',
              padding: '4px 14px',
              fontSize: '0.75rem',
              color: '#c2410c',
              fontWeight: 600,
              marginBottom: '22px',
              letterSpacing: '0.02em',
            }}
          >
            Demo Environment — Prototype for SIH 2026 Problem Statement 26102
          </div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#003580',
              margin: '0 0 16px',
              lineHeight: 1.3,
              maxWidth: '750px',
            }}
          >
            AI-Powered MPLADS Monitoring &amp; Anomaly Detection System
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#374151',
              marginBottom: '32px',
              maxWidth: '680px',
              lineHeight: 1.65,
            }}
          >
            Detect anomalies. Monitor funds. Improve project efficiency. Strengthen accountability in
            MPLAD Scheme implementation.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#003580',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '11px 28px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,53,128,0.3)',
              }}
            >
              Open Monitoring Dashboard
            </button>
            <button
              onClick={() => navigate('/projects')}
              style={{
                background: '#fff',
                color: '#003580',
                border: '1.5px solid #003580',
                borderRadius: '4px',
                padding: '11px 28px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Explore Public Data
            </button>
          </div>

          {/* Stats bar */}
          <div
            style={{
              display: 'flex',
              gap: '0',
              background: '#f0f4fa',
              border: '1px solid #d1dff5',
              borderRadius: '6px',
              overflow: 'hidden',
              maxWidth: '780px',
            }}
          >
            {[
              { label: 'Works Monitored', value: '42,318' },
              { label: '₹ Tracked', value: '₹1,185 Cr' },
              { label: 'Anomalies Detected', value: '287' },
              { label: 'MPs Covered', value: '790' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  textAlign: 'center',
                  borderRight: i < 3 ? '1px solid #d1dff5' : 'none',
                }}
              >
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#003580' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#4b5563', marginTop: '2px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section style={{ background: '#f8fafc', padding: '56px 40px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#003580',
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            Core Capabilities
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '36px', fontSize: '0.9rem' }}>
            Comprehensive tools to monitor, analyze, and audit MPLADS project data.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {/* Card: AI Anomaly Detection */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '28px 24px',
                borderTop: '4px solid #FF6B00',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  background: '#fff7ed',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Brain size={24} color="#FF6B00" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#003580', marginBottom: '10px' }}>
                AI Anomaly Detection
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6 }}>
                Automatically identify unusual expenditure patterns, cost outliers, and suspicious
                project activities using ML algorithms.
              </p>
            </div>

            {/* Card: Financial Monitoring */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '28px 24px',
                borderTop: '4px solid #16a34a',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  background: '#f0fdf4',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <DollarSign size={24} color="#16a34a" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#003580', marginBottom: '10px' }}>
                Financial Monitoring
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6 }}>
                Track fund release, utilization, and expenditure across states, districts and MPs in
                real-time.
              </p>
            </div>

            {/* Card: Explainable Risk Analysis */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '28px 24px',
                borderTop: '4px solid #003580',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  background: '#eff6ff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Activity size={24} color="#003580" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#003580', marginBottom: '10px' }}>
                Explainable Risk Analysis
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6 }}>
                Understand exactly why a project has been flagged — transparent AI explanations for
                every risk score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: '#eef2f9', padding: '56px 40px', borderBottom: '1px solid #d1dff5' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#003580',
              textAlign: 'center',
              marginBottom: '8px',
            }}
          >
            How It Works
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '40px', fontSize: '0.9rem' }}>
            A four-stage pipeline from raw data to actionable government insights.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              {
                step: '01',
                icon: <FileText size={22} color="#003580" />,
                title: 'MPLADS Data',
                desc: 'Project reports, fund releases, and expenditure records ingested from official sources.',
              },
              {
                step: '02',
                icon: <Brain size={22} color="#FF6B00" />,
                title: 'AI Processing',
                desc: 'Machine learning models analyze patterns, costs, and timelines across thousands of projects.',
              },
              {
                step: '03',
                icon: <AlertTriangle size={22} color="#dc2626" />,
                title: 'Anomaly Detection',
                desc: 'Outliers, duplicates, and high-risk projects are flagged with risk scores and explanations.',
              },
              {
                step: '04',
                icon: <Eye size={22} color="#16a34a" />,
                title: 'Officer Review',
                desc: 'Government officers receive prioritized alerts and actionable audit recommendations.',
              },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  background: '#fff',
                  border: '1px solid #d1dff5',
                  borderRadius: '8px',
                  padding: '24px 20px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: '#f0f4fa',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                  }}
                >
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#9ca3af',
                    letterSpacing: '0.08em',
                    marginBottom: '6px',
                  }}
                >
                  STEP {item.step}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#003580', marginBottom: '8px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#4b5563', lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Flow indicator */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '20px',
            }}
          >
            {['MPLADS Data', 'AI Processing', 'Anomaly Detection', 'Officer Review'].map(
              (label, i, arr) => (
                <React.Fragment key={label}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      background: '#fff',
                      border: '1px solid #d1dff5',
                      borderRadius: '4px',
                      padding: '3px 10px',
                    }}
                  >
                    {label}
                  </span>
                  {i < arr.length - 1 && (
                    <span style={{ color: '#9ca3af', fontSize: '1rem' }}>→</span>
                  )}
                </React.Fragment>
              )
            )}
          </div>
        </div>
      </section>

      {/* System Overview */}
      <section style={{ background: '#fff', padding: '56px 40px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#003580',
              marginBottom: '8px',
            }}
          >
            Built for Government Officials
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '40px', fontSize: '0.9rem' }}>
            Designed to meet the needs of nodal officers, district administrators, and ministry-level
            reviewers.
          </p>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}
          >
            {/* Feature list */}
            <div>
              {[
                'Real-time project monitoring across all 790 constituencies',
                'Automated anomaly scoring with ML confidence metrics',
                'State-wise and district-wise fund utilization dashboards',
                'PDF report generation for audit and compliance',
                'Role-based access for MPs, nodal officers, and ministry staff',
                'Integration-ready with NIC and PFMS data pipelines',
              ].map((feature) => (
                <div
                  key={feature}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <CheckCircle
                    size={18}
                    color="#16a34a"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.55 }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats grid */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Total States', value: '30', icon: <Users size={20} color="#003580" /> },
                  { label: 'MPs Covered', value: '790', icon: <Users size={20} color="#FF6B00" /> },
                  {
                    label: 'Projects Monitored',
                    value: '42,318',
                    icon: <FileText size={20} color="#16a34a" />,
                  },
                  {
                    label: 'Models Deployed',
                    value: '4',
                    icon: <Brain size={20} color="#dc2626" />,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '20px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {stat.icon}
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#003580' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e3a5f', color: '#a8c4e0', padding: '36px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
              flexWrap: 'wrap',
            }}
          >
            <ShieldAlert size={20} color="#a8c4e0" />
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>MPLADS AI Insight</span>
            <span style={{ color: '#4b6a8a' }}>|</span>
            <span style={{ fontSize: '0.82rem' }}>SIH 2026</span>
            <span style={{ color: '#4b6a8a' }}>|</span>
            <span style={{ fontSize: '0.82rem' }}>Problem Statement 26102</span>
          </div>
          <p style={{ fontSize: '0.82rem', marginBottom: '6px', color: '#8aa4c0' }}>
            Developed as a prototype for demonstrating AI-powered MPLAD scheme monitoring.
          </p>
          <p style={{ fontSize: '0.78rem', color: '#5a7a9a' }}>
            Data shown is synthetic and for demonstration purposes only. Not affiliated with the
            official MPLADS portal.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
