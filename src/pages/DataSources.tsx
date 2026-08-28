import React, { useState } from 'react';
import { PageHeader, SectionCard, StatusBadge, ActionButton } from '../components/ui';
import { Database, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, FileText, Info, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DataSourceDef {
  sourceId: string;
  name: string;
  category: 'OFFICIAL MPLADS DATA' | 'EXTERNAL GOVERNMENT DATA' | 'DEMO DATA' | 'AI-GENERATED OUTPUT';
  description: string;
  updateFrequency: string;
  connectorModule: string;
  status: 'Active' | 'Gated (Disabled by Default)' | 'Operational Reference';
  recordsTracked: string;
  notesAndCaveats: string;
}

const DATA_SOURCES: DataSourceDef[] = [
  {
    sourceId: 'SRC-ESAKSHI-OFFICIAL',
    name: 'eSAKSHI National MPLADS Portal',
    category: 'OFFICIAL MPLADS DATA',
    description: 'Ministry of Statistics & PI operational portal for work recommendations, sanction orders, and district monitoring.',
    updateFrequency: 'Real-time (Gated)',
    connectorModule: 'etl/connectors/esakshi.py',
    status: 'Gated (Disabled by Default)',
    recordsTracked: '0 (Requires MoSPI Auth)',
    notesAndCaveats: 'No public bulk API/CSV exists. Login-gated portal; pre-2023 historical records are not available in eSAKSHI. Modular connector is disabled by default until official credentials are provided.'
  },
  {
    sourceId: 'SRC-DATAGOVIN-MPLADS',
    name: 'Data.gov.in Open Government Data Platform',
    category: 'EXTERNAL GOVERNMENT DATA',
    description: 'National Data Sharing & Accessibility Policy (NDSAP) catalog providing state-level aggregate releases.',
    updateFrequency: 'Monthly Aggregates',
    connectorModule: 'etl/connectors/datagovin.py',
    status: 'Gated (Disabled by Default)',
    recordsTracked: '36 States / UTs',
    notesAndCaveats: 'Provides macro financial releases, not row-level asset coordinates, contractor invoices, or physical photographs.'
  },
  {
    sourceId: 'SRC-LGD-ECI-CODES',
    name: 'Local Government Directory (LGD) & ECI Master Codes',
    category: 'EXTERNAL GOVERNMENT DATA',
    description: 'Standard public master codes for States, Districts, Local Bodies, and Parliamentary Constituencies.',
    updateFrequency: 'Annual Official Release',
    connectorModule: 'database/seed_reference.sql',
    status: 'Operational Reference',
    recordsTracked: '543 Constituencies / 780+ Districts',
    notesAndCaveats: 'Safe to hardcode public administrative master data; used for spatial geofencing and administrative jurisdiction mapping.'
  },
  {
    sourceId: 'SRC-SYNTHETIC-DEMO',
    name: 'SIH Sentinel Synthetic Data Generator',
    category: 'DEMO DATA',
    description: 'Deterministic algorithmic seed generator producing schema-compliant synthetic works, fund releases, and anomaly test cases.',
    updateFrequency: 'Deterministic Seed',
    connectorModule: 'etl/connectors/demo_generator.py',
    status: 'Active',
    recordsTracked: '42,318 Works Monitored (Demo)',
    notesAndCaveats: 'All row-level works, fund releases, expenditures, and progress reports in this prototype carry the explicit tag: source_report = "DEMO DATA - NOT OFFICIAL MPLADS DATA".'
  },
  {
    sourceId: 'SRC-AI-RISK-MODELS',
    name: 'Sentinel ML Risk & Anomaly Engines',
    category: 'AI-GENERATED OUTPUT',
    description: 'Multi-modal ML engines: Isolation Forest, Random Forest Delay Estimator, and SHAP XAI inference.',
    updateFrequency: 'Dynamic In-Memory',
    connectorModule: 'backend/ai_service.py',
    status: 'Active',
    recordsTracked: 'Real-time scoring',
    notesAndCaveats: 'Prototype scores indicating review priorities, never definitive legal determinations. Always phrased as "potential anomaly requiring official verification".'
  }
];

export default function DataSources() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredSources = selectedCategory === 'ALL'
    ? DATA_SOURCES
    : DATA_SOURCES.filter(s => s.category === selectedCategory);

  const getCategoryBadge = (cat: DataSourceDef['category']) => {
    switch (cat) {
      case 'OFFICIAL MPLADS DATA':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'EXTERNAL GOVERNMENT DATA':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'DEMO DATA':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'AI-GENERATED OUTPUT':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Data Sources & Provenance Registry"
        subtitle="Transparent audit trail separating Official, External Government, Demo, and AI-Generated Data"
        badge={
          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            CRITICAL GOVERNANCE REGISTRY
          </span>
        }
      />

      {/* Prominent Data Notice Banner */}
      <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-950 space-y-2 shadow-sm">
        <div className="font-bold text-sm flex items-center gap-2 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Official Data Availability Notice &amp; Compliance Rule</span>
        </div>
        <p className="text-xs leading-relaxed m-0 text-amber-900">
          There is currently <strong>no confirmed public bulk CSV or unauthenticated API</strong> for row-level MPLADS works. The public site (<code>mplads.mospi.gov.in / eSAKSHI</code>) is a login-gated operational dashboard with no pre-2023 data. Therefore, all row-level works, fund releases, and expenditures in this platform are generated using the certified <strong>SIH Sentinel Demo Generator</strong> and carry the mandatory tag: <code>source_report = "DEMO DATA - NOT OFFICIAL MPLADS DATA"</code>.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {['ALL', 'OFFICIAL MPLADS DATA', 'EXTERNAL GOVERNMENT DATA', 'DEMO DATA', 'AI-GENERATED OUTPUT'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#003580] text-white border-[#003580] shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSources.map(src => (
          <div key={src.sourceId} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#003580] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {src.sourceId}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 m-0">{src.name}</h3>
                </div>
                <div className="text-xs text-gray-500 mt-1">{src.description}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getCategoryBadge(src.category)}`}>
                  {src.category}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  src.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  src.status === 'Operational Reference' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-gray-100 text-gray-600 border border-gray-300'
                }`}>
                  {src.status}
                </span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-gray-200">
              <div>
                <div className="text-[10px] text-gray-500 uppercase font-bold">Connector Module</div>
                <div className="font-mono text-[11px] text-gray-800 mt-0.5">{src.connectorModule}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase font-bold">Update Frequency</div>
                <div className="font-semibold text-gray-800 mt-0.5">{src.updateFrequency}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase font-bold">Records Monitored</div>
                <div className="font-semibold text-[#003580] mt-0.5">{src.recordsTracked}</div>
              </div>
            </div>

            {/* Notes and Caveats */}
            <div className="text-xs text-gray-700 bg-amber-50/50 p-3 rounded-lg border border-amber-200">
              <strong className="text-amber-900">Governance Notes &amp; Verification Requirement:</strong>
              <p className="text-[11px] text-gray-700 mt-1 mb-0 leading-relaxed">{src.notesAndCaveats}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
