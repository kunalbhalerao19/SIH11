import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { PROJECTS, STATE_STATS, STATES } from '../data/demoData';
import { CROSS_SCHEME_DUPLICATIONS } from '../lib/aiModulesEngine';
import { PageHeader, SectionCard } from '../components/ui';
import { RiskBadge } from '../components/RiskBadge';
import { getRiskColor, getRiskBgColor, getScoreColor } from '../lib/riskEngine';
import type { Project, RiskLevel } from '../types';
import {
  MapPin,
  Layers,
  AlertTriangle,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  Building2,
  ExternalLink,
  Info,
} from 'lucide-react';

// Deterministic State Center Coordinates
const STATE_COORDINATES: Record<string, [number, number]> = {
  'Maharashtra': [19.7515, 75.7139],
  'Uttar Pradesh': [26.8467, 80.9462],
  'Bihar': [25.0961, 85.3131],
  'West Bengal': [22.9868, 87.8550],
  'Tamil Nadu': [11.1271, 78.6569],
  'Madhya Pradesh': [22.9734, 78.6569],
  'Karnataka': [15.3173, 75.7139],
  'Gujarat': [22.2587, 71.1924],
  'Rajasthan': [27.0238, 74.2179],
  'Andhra Pradesh': [15.9129, 79.7400],
  'Odisha': [20.9517, 85.0985],
  'Kerala': [10.8505, 76.2711],
  'Telangana': [18.1124, 79.0193],
  'Assam': [26.2006, 92.9376],
  'Jharkhand': [23.6102, 85.2799],
  'Punjab': [31.1471, 75.3412],
  'Haryana': [29.0588, 76.0856],
  'Chhattisgarh': [21.2787, 81.8661],
  'Jammu and Kashmir': [33.7782, 76.5762],
  'Uttarakhand': [30.0668, 79.0193],
  'Himachal Pradesh': [31.1048, 77.1734],
  'Tripura': [23.9408, 91.9882],
  'Meghalaya': [25.4670, 91.3662],
  'Manipur': [24.6637, 93.9063],
  'Nagaland': [26.1584, 94.5624],
  'Goa': [15.2993, 74.1240],
  'Arunachal Pradesh': [28.2180, 94.7278],
  'Mizoram': [23.1645, 92.9376],
  'Sikkim': [27.5330, 88.5122],
  'Delhi': [28.7041, 77.1025],
  'Puducherry': [11.9416, 79.8083],
  'Chandigarh': [30.7333, 76.7794],
  'Andaman and Nicobar Islands': [11.7401, 92.6586],
  'Dadra and Nagar Haveli and Daman and Diu': [20.1809, 73.0169],
  'Ladakh': [34.1526, 77.5771],
  'Lakshadweep': [10.5667, 72.6417],
};

// Known exact coordinates for key demo projects
const PROJECT_EXACT_COORDINATES: Record<string, [number, number]> = {
  'MPL-2026-00451': [18.5089, 73.9260], // Hadapsar Community Hall
  'MPL-2026-00102': [25.5678, 85.0743], // Phulwari Road
  'MPL-2026-04131': [25.4182, 86.1272], // Begusarai Water Supply
  'MPL-2026-02984': [17.6780, 75.3245], // Pandharpur Road
  'MPL-2026-00317': [13.0827, 80.2707], // Chennai
  'MPL-2026-01271': [19.7167, 77.1500], // Hingoli
  'MPL-2026-01044': [27.6094, 75.1398], // Sikar
  'MPL-2026-00892': [28.6139, 77.2090], // Delhi Central
  'MPL-2026-02119': [26.8467, 80.9462], // Lucknow
  'MPL-2026-03421': [22.5726, 88.3639], // Kolkata
  'MPL-2026-01550': [23.2156, 72.6369], // Gandhinagar
  'MPL-2026-01880': [25.3176, 82.9739], // Varanasi
  'MPL-2026-04901': [11.6854, 76.1320], // Wayanad
  'MPL-2026-05120': [34.2000, 74.3436], // Baramulla
};

// Create custom colored Leaflet HTML pin icon
function createCustomPin(color: string, score: number, isCritical = false) {
  const pulseHtml = isCritical
    ? `<span style="position:absolute; width:28px; height:28px; border-radius:50%; background:${color}; opacity:0.3; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite; top:-4px; left:-4px;"></span>`
    : '';

  const html = `
    <div style="position:relative; width:20px; height:20px; display:flex; align-items:center; justify-content:center;">
      ${pulseHtml}
      <div style="width:20px; height:20px; border-radius:50%; background:${color}; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-size:9px; font-weight:800; z-index:2;">
        ${score >= 81 ? '!' : score}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
}

export interface MappedProject extends Project {
  coords: [number, number];
  hasDuplicateOverlap: boolean;
  overlapDetails?: typeof CROSS_SCHEME_DUPLICATIONS[0];
}

export default function MapView() {
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState<'all' | 'high_risk' | 'duplicates'>('all');
  const [selectedState, setSelectedState] = useState<string>('');
  const [activeProject, setActiveProject] = useState<MappedProject | null>(null);

  // Map project coordinates
  const mappedProjects = useMemo(() => {
    return PROJECTS.map((p, idx) => {
      let coords = PROJECT_EXACT_COORDINATES[p.project_id];
      if (!coords) {
        const stateCenter = STATE_COORDINATES[p.state] || [22.5937, 78.9629];
        // Jitter offset around state center for visualization
        const seed = (idx * 9301 + 49297) % 233280;
        const latOffset = ((seed % 100) - 50) * 0.035;
        const lngOffset = (((seed / 100) | 0) % 100 - 50) * 0.035;
        coords = [stateCenter[0] + latOffset, stateCenter[1] + lngOffset];
      }

      const dup = CROSS_SCHEME_DUPLICATIONS.find(d => d.mpladsProjectId === p.project_id);

      return {
        ...p,
        coords,
        hasDuplicateOverlap: !!dup,
        overlapDetails: dup,
      };
    });
  }, []);

  // Filter projects for the map
  const visibleProjects = useMemo(() => {
    return mappedProjects.filter(p => {
      if (selectedState && p.state !== selectedState) return false;
      if (filterMode === 'high_risk') return p.risk_level === 'HIGH' || p.risk_level === 'CRITICAL';
      if (filterMode === 'duplicates') return p.hasDuplicateOverlap;
      return true;
    });
  }, [mappedProjects, selectedState, filterMode]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Geospatial Map View — Leaflet GIS Sentinel"
        subtitle="Real-time interactive geospatial mapping, risk clustering & cross-scheme duplicate asset proximity"
      />

      {/* Map Control Toolbar */}
      <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#003580]" />
            Filter Layer:
          </span>

          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              filterMode === 'all'
                ? 'bg-[#003580] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Projects ({mappedProjects.length})
          </button>

          <button
            onClick={() => setFilterMode('high_risk')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterMode === 'high_risk'
                ? 'bg-[#dc2626] text-white shadow-sm'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>High & Critical Risk Only</span>
          </button>

          <button
            onClick={() => setFilterMode('duplicates')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterMode === 'duplicates'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Duplicate Proximity Overlaps (&lt;100m)</span>
          </button>
        </div>

        {/* State Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">State:</span>
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-[#003580] font-medium"
          >
            <option value="">All States ({STATES.length})</option>
            {STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Leaflet Map & Info Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Leaflet Map Container */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative min-h-[560px]">
          <MapContainer
            center={[21.7679, 78.8718]}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: '560px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Duplicate Asset Overlap Circles */}
            {visibleProjects.map(project => {
              if (!project.hasDuplicateOverlap) return null;
              return (
                <Circle
                  key={`circle-${project.project_id}`}
                  center={project.coords}
                  radius={120}
                  pathOptions={{
                    color: '#dc2626',
                    fillColor: '#ef4444',
                    fillOpacity: 0.25,
                    dashArray: '4, 4',
                  }}
                />
              );
            })}

            {/* Render Project Markers */}
            {visibleProjects.map(project => {
              const color = getRiskColor(project.risk_level);
              const isCritical = project.risk_level === 'CRITICAL';
              const icon = createCustomPin(color, project.risk_score, isCritical);

              return (
                <Marker
                  key={project.project_id}
                  position={project.coords}
                  icon={icon}
                  eventHandlers={{
                    click: () => setActiveProject(project),
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans text-xs">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-[#003580]">{project.project_id}</span>
                        <RiskBadge level={project.risk_level} size="sm" />
                      </div>
                      <div className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {project.work_name}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        {project.constituency}, {project.state}
                      </div>

                      {project.hasDuplicateOverlap && (
                        <div className="mt-2 p-1.5 bg-red-50 border border-red-200 rounded text-[10px] text-red-800 font-medium">
                          ⚠️ Overlap: {project.overlapDetails?.overlappingScheme} Project ({project.overlapDetails?.distanceMeters}m apart)
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-gray-800">₹{project.sanctioned_cost}L</span>
                        <button
                          onClick={() => navigate(`/projects/${project.project_id}`)}
                          className="px-2 py-1 bg-[#003580] hover:bg-[#002860] text-white text-[11px] font-bold rounded flex items-center gap-1 cursor-pointer"
                        >
                          <span>Investigate</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map Floating Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-md text-xs">
            <div className="font-bold text-gray-800 mb-2">Risk Legend:</div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#dc2626]"></span>
                <span>Critical Risk (81–100)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ea580c]"></span>
                <span>High Risk (61–80)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#d97706]"></span>
                <span>Medium Risk (31–60)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#16a34a]"></span>
                <span>Low Risk (0–30)</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                <span className="w-3.5 h-3.5 rounded border border-red-500 bg-red-100"></span>
                <span>Duplicate Proximity Buffer (&lt;100m)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Selected Project Telemetry & Overlap Details */}
        <div className="space-y-4">
          <SectionCard
            title={activeProject ? `Project: ${activeProject.project_id}` : 'Map Inspector'}
            subtitle={activeProject ? activeProject.constituency : 'Click any marker on the map to inspect'}
          >
            {activeProject ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="font-bold text-sm text-gray-900">{activeProject.work_name}</div>
                  <div className="text-gray-500 text-[11px] mt-0.5">
                    {activeProject.state} • Sector: {activeProject.sector}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-gray-200">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">AI Risk Score</div>
                    <div className="text-2xl font-extrabold text-[#dc2626] leading-none mt-1">
                      {activeProject.risk_score}<span className="text-xs text-gray-400 font-normal">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <RiskBadge level={activeProject.risk_level} size="md" />
                    <div className="text-[10px] text-gray-500 mt-1">Confidence: {activeProject.anomaly_confidence || 92}%</div>
                  </div>
                </div>

                {/* Overlap Alert Card */}
                {activeProject.hasDuplicateOverlap && activeProject.overlapDetails && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-900 space-y-1.5">
                    <div className="font-bold text-xs flex items-center gap-1.5 text-red-700">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Cross-Scheme Proximity Overlap!</span>
                    </div>
                    <div className="text-[11px] leading-snug">
                      Detected duplicate infrastructure asset under <strong>{activeProject.overlapDetails.overlappingScheme}</strong> ({activeProject.overlapDetails.schemeProjectId}) located only <strong>{activeProject.overlapDetails.distanceMeters}m</strong> away.
                    </div>
                    <div className="text-[11px] font-bold text-red-700 pt-1">
                      Estimated Double-Funding: ₹{activeProject.overlapDetails.estimatedDoubleFundingLakhs} Lakhs
                    </div>
                  </div>
                )}

                {/* Financial Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-gray-600 text-[11px]">
                    <span>Sanctioned Cost:</span>
                    <span className="font-bold text-gray-900">₹{activeProject.sanctioned_cost} Lakhs</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-[11px]">
                    <span>Expenditure:</span>
                    <span className="font-bold text-emerald-700">₹{activeProject.expenditure} Lakhs</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-[11px]">
                    <span>Physical Progress:</span>
                    <span className="font-bold text-blue-800">{activeProject.physical_progress}%</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/projects/${activeProject.project_id}`)}
                    className="w-full py-2 bg-[#003580] hover:bg-[#002860] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow transition-all"
                  >
                    <span>View Complete Forensic Dossier</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400 space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-gray-300 animate-bounce" />
                <div className="text-xs text-gray-500 font-medium">Select any project marker on the map to view forensic GIS telemetry</div>
              </div>
            )}
          </SectionCard>

          {/* Quick Stats Box */}
          <div className="bg-blue-50/70 p-3.5 rounded-lg border border-blue-200 text-xs text-blue-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-[#003580]">
              <Info className="w-3.5 h-3.5" />
              <span>GIS Sentinel Overview</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed m-0">
              Interactive OpenStreetMap GIS layer analyzes coordinate geofencing and duplicate asset proximity (&lt;100m buffer) across all parliamentary works in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
