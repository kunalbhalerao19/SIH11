import { useState, useEffect, useCallback } from 'react';
import { PageHeader, SectionCard, KpiCard } from '../components/ui';
import { ShieldCheck, CheckCircle2, RefreshCw, Activity, Server } from 'lucide-react';
import { useToast } from '../context/useToast';
import { checkBackendHealth, API_BASE_URL } from '../lib/api';
import { PROJECTS } from '../data/demoData';
import { formatNumber } from '../lib/utils';

interface ExtractionRun {
  runId: string;
  connectorName: string;
  status: 'COMPLETED' | 'PARTIAL' | 'FAILED';
  recordsExtracted: number;
  recordsValidated: number;
  recordsLoaded: number;
  errorsCount: number;
  startTime: string;
  durationSeconds: number;
}

interface DataQualityError {
  errorId: string;
  tableName: string;
  recordId: string;
  ruleViolated: string;
  errorDescription: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  timestamp: string;
}

const DEMO_EXTRACTION_RUNS: ExtractionRun[] = [
  {
    runId: 'RUN-20260828-0912',
    connectorName: 'DemoDataGenerator (Synthetic Seed)',
    status: 'COMPLETED',
    recordsExtracted: PROJECTS.length,
    recordsValidated: PROJECTS.length,
    recordsLoaded: PROJECTS.length,
    errorsCount: 0,
    startTime: '2026-08-28 09:12:04',
    durationSeconds: 3.42,
  },
  {
    runId: 'RUN-20260827-1845',
    connectorName: 'LGD Reference Ingestion',
    status: 'COMPLETED',
    recordsExtracted: 780,
    recordsValidated: 780,
    recordsLoaded: 780,
    errorsCount: 0,
    startTime: '2026-08-27 18:45:10',
    durationSeconds: 0.85,
  },
  {
    runId: 'RUN-20260826-1120',
    connectorName: 'eSAKSHI Connector (Test Probe)',
    status: 'PARTIAL',
    recordsExtracted: 0,
    recordsValidated: 0,
    recordsLoaded: 0,
    errorsCount: 1,
    startTime: '2026-08-26 11:20:00',
    durationSeconds: 0.12,
  },
];

const DEMO_QUALITY_ERRORS: DataQualityError[] = [
  {
    errorId: 'ERR-2026-0091',
    tableName: 'works',
    recordId: 'MPL-2026-00102',
    ruleViolated: 'RULE_PROGRESS_SPEND_DIVERGENCE',
    errorDescription: 'Cumulative expenditure (88%) significantly exceeds physical progress (20%).',
    severity: 'CRITICAL',
    timestamp: '2026-08-28 09:12:05',
  },
  {
    errorId: 'ERR-2026-0042',
    tableName: 'works',
    recordId: 'MPL-2026-01271',
    ruleViolated: 'RULE_MARCH_RUSH_ANOMALY',
    errorDescription: 'Sanction and 95% fund release occurred in the final 48 hours of FY.',
    severity: 'WARNING',
    timestamp: '2026-08-28 09:12:05',
  },
  {
    errorId: 'ERR-2026-0018',
    tableName: 'data_sources',
    recordId: 'SRC-ESAKSHI-OFFICIAL',
    ruleViolated: 'RULE_AUTH_GATE_LOCKED',
    errorDescription: 'Live eSAKSHI endpoint requires verified MoSPI client secret credentials.',
    severity: 'INFO',
    timestamp: '2026-08-26 11:20:01',
  },
];

export default function DataQuality() {
  const { success, info } = useToast();
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{ connected: boolean | null; latencyMs?: number; version?: string }>({ connected: null });
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filteredErrors = selectedSeverity === 'ALL'
    ? DEMO_QUALITY_ERRORS
    : DEMO_QUALITY_ERRORS.filter(e => e.severity === selectedSeverity);

  const runBackendHealthCheck = useCallback(async (silent = false) => {
    setIsCheckingBackend(true);
    try {
      const result = await checkBackendHealth();
      setBackendStatus({
        connected: result.connected,
        latencyMs: result.latencyMs,
        version: result.version,
      });

      if (!silent) {
        if (result.connected) {
          success('Backend Online', `FastAPI backend connected at ${API_BASE_URL} (${result.latencyMs}ms, v${result.version || '1.0.0'}).`);
        } else {
          info('Client Fallback Active', `FastAPI backend at ${API_BASE_URL} is offline. Seamlessly serving certified in-memory demo datasets.`);
        }
      }
    } finally {
      setIsCheckingBackend(false);
    }
  }, [success, info]);

  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((result) => {
      if (isMounted) {
        setBackendStatus({
          connected: result.connected,
          latencyMs: result.latencyMs,
          version: result.version,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTriggerETL = () => {
    setIsRunningPipeline(true);
    setTimeout(() => {
      setIsRunningPipeline(false);
      success('ETL Pipeline Completed', `Ingested, normalized, and validated ${formatNumber(PROJECTS.length)} synthetic demo records.`);
    }, 1800);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeader
          title="Data Quality & ETL Validation Monitor"
          subtitle="Automated ETL integrity verification, rule compliance auditing, and error logs"
          badge={
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              12 ACTIVE ETL RULES
            </span>
          }
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => runBackendHealthCheck(false)}
            disabled={isCheckingBackend}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Probe backend API endpoint at API_BASE_URL"
          >
            <Server className="w-3.5 h-3.5 text-blue-700" />
            <span>{isCheckingBackend ? 'Probing...' : 'Test Backend API'}</span>
          </button>
          <button
            onClick={handleTriggerETL}
            disabled={isRunningPipeline}
            className="px-4 py-2 bg-[#003580] hover:bg-[#002860] text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunningPipeline ? 'animate-spin' : ''}`} />
            <span>{isRunningPipeline ? 'Running ETL Pipeline...' : 'Trigger ETL Validation Run'}</span>
          </button>
        </div>
      </div>

      {/* Live Backend Connection Status Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#003580]" />
          <span className="font-bold text-slate-800">REST API Gateway:</span>
          <code className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-700">
            {API_BASE_URL}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              backendStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <span className="font-semibold text-slate-700">
            {backendStatus.connected
              ? `Connected (Latency: ${backendStatus.latencyMs}ms)`
              : 'Standby / Resilient In-Memory Demo Data Mode'}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="ETL Extraction Runs" value="24" subtitle="All runs logged" color="blue" />
        <KpiCard title="Validation Rules Enforced" value="12 Rules" subtitle="100% active" color="green" />
        <KpiCard title="Data Quality Score" value="99.4%" subtitle="0 critical DB rejections" color="green" />
        <KpiCard title="Active Quality Warnings" value="3 Flags" subtitle="Requires officer review" color="orange" />
      </div>

      {/* ETL Rule Matrix Card */}
      <SectionCard title="Active Business Validation Rules" subtitle="Automated integrity rules executed on every incoming batch">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Progress Range (0–100%)</span>
            </div>
            <p className="text-[11px] text-emerald-800 m-0">Rejects any record where physical completion is outside 0.00% to 100.00%.</p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Non-Negative Financials</span>
            </div>
            <p className="text-[11px] text-emerald-800 m-0">Guarantees sanctioned cost, fund release, and expenditure values are &gt;= 0.00.</p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Chronological Date Ordering</span>
            </div>
            <p className="text-[11px] text-emerald-800 m-0">Enforces: Recommendation Date &le; Sanction Date &le; Actual Completion Date.</p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Primary Key Deduplication</span>
            </div>
            <p className="text-[11px] text-emerald-800 m-0">Prevents duplicate work_id and voucher_id collisions across multi-state batches.</p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>NULLIF Zero-Division Protection</span>
            </div>
            <p className="text-[11px] text-emerald-800 m-0">All derived utilization, cost variance, and velocity formulas strictly guarded.</p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mandatory Source Attribution</span>
            </div>
            <p className="text-[11px] text-emerald-800 m-0">Requires source_report, source_url, source_file on all incoming records.</p>
          </div>
        </div>
      </SectionCard>

      {/* Extraction Runs History */}
      <SectionCard title="Recent ETL Extraction Runs" subtitle="Audit log of batch ingestion executions">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Connector Name</th>
                <th>Status</th>
                <th>Extracted</th>
                <th>Validated</th>
                <th>Loaded</th>
                <th>Execution Time</th>
                <th>Start Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_EXTRACTION_RUNS.map(run => (
                <tr key={run.runId}>
                  <td className="font-mono font-bold text-[#003580]">{run.runId}</td>
                  <td className="font-medium text-gray-900">{run.connectorName}</td>
                  <td>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      run.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {run.status}
                    </span>
                  </td>
                  <td>{run.recordsExtracted.toLocaleString()}</td>
                  <td>{run.recordsValidated.toLocaleString()}</td>
                  <td className="font-bold text-gray-900">{run.recordsLoaded.toLocaleString()}</td>
                  <td>{run.durationSeconds}s</td>
                  <td className="text-gray-500 text-[11px]">{run.startTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Data Quality Error Log */}
      <SectionCard title="Data Quality Violation Log" subtitle="Rule exceptions and anomalies captured in data_quality_errors table">
        <div className="space-y-3">
          <div className="flex gap-2">
            {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(sev => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded text-xs font-semibold border cursor-pointer ${
                  selectedSeverity === sev
                    ? 'bg-[#003580] text-white border-[#003580]'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Error ID</th>
                  <th>Target Table</th>
                  <th>Record ID</th>
                  <th>Rule Violated</th>
                  <th>Description</th>
                  <th>Severity</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredErrors.map(err => (
                  <tr key={err.errorId}>
                    <td className="font-mono font-bold text-gray-700">{err.errorId}</td>
                    <td className="font-mono text-xs">{err.tableName}</td>
                    <td className="font-mono font-bold text-[#003580]">{err.recordId}</td>
                    <td className="font-semibold text-gray-900">{err.ruleViolated}</td>
                    <td className="text-gray-700 text-xs">{err.errorDescription}</td>
                    <td>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        err.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        err.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {err.severity}
                      </span>
                    </td>
                    <td className="text-gray-500 text-[11px]">{err.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
