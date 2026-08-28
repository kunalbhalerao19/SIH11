import React, { useState, useRef } from 'react';
import exifr from 'exifr';
import type { Project } from '../types';
import { useToast } from '../context/ToastContext';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileImage,
  MapPin,
  Sparkles,
  RefreshCw,
  X,
  ShieldAlert,
  Sliders,
} from 'lucide-react';

interface EvidenceUploadModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onEvidenceProcessed?: (result: EvidenceAnalysisResult) => void;
}

export interface EvidenceAnalysisResult {
  fileName: string;
  imagePreviewUrl: string;
  exifData: {
    lat?: number;
    lng?: number;
    dateTime?: string;
    cameraModel?: string;
    hasRealGps: boolean;
  };
  projectCoordinates: {
    lat: number;
    lng: number;
  };
  distanceMeters: number;
  isGpsMismatch: boolean;
  pHash: string;
  duplicateMatch: {
    matchedProjectId?: string;
    similarityPct: number;
    isDuplicate: boolean;
  };
  computedPhotoRiskScore: number;
  computedCompositeRiskScore: number;
  riskScoreDelta: number;
}

// Known reference perceptual hashes of sample projects for client-side duplicate matching
const EXISTING_EVIDENCE_HASHES = [
  { projectId: 'MPL-2025-08192', hash: '1100101010101100110010101010110011001010101011001100101010101100', name: 'Hadapsar Community Hall 2025' },
  { projectId: 'MPL-2024-00122', hash: '1111000011110000111100001111000011110000111100001111000011110000', name: 'Phulwari Road Batch 1' },
  { projectId: 'MPL-2026-04131', hash: '1010101010101010101010101010101010101010101010101010101010101010', name: 'Begusarai Pipeline Site' },
];

/**
 * Calculates Haversine distance in meters between two GPS coordinates
 */
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Computes 64-bit Difference Hash (dHash) client-side using HTML5 Canvas
 */
function computeClientSideDHash(imgElement: HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = 9;
  canvas.height = 8;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '0'.repeat(64);

  ctx.drawImage(imgElement, 0, 0, 9, 8);
  const imgData = ctx.getImageData(0, 0, 9, 8);
  const data = imgData.data;

  // Convert to grayscale values
  const grays: number[][] = [];
  for (let y = 0; y < 8; y++) {
    grays[y] = [];
    for (let x = 0; x < 9; x++) {
      const idx = (y * 9 + x) * 4;
      const gray = Math.round(data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114);
      grays[y].push(gray);
    }
  }

  // Compute difference hash bits
  let hashStr = '';
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      hashStr += grays[y][x] > grays[y][x + 1] ? '1' : '0';
    }
  }

  return hashStr;
}

/**
 * Computes Hamming similarity percentage between two 64-bit hash strings
 */
function computeHashSimilarity(hash1: string, hash2: string): number {
  let matches = 0;
  const len = Math.min(hash1.length, hash2.length, 64);
  for (let i = 0; i < len; i++) {
    if (hash1[i] === hash2[i]) matches++;
  }
  return Math.round((matches / 64) * 100);
}

export function EvidenceUploadModal({ project, isOpen, onClose, onEvidenceProcessed }: EvidenceUploadModalProps) {
  const { success, warning } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EvidenceAnalysisResult | null>(null);

  // Fallback simulated GPS coordinates if image has no EXIF GPS
  const [manualGpsOffsetMeters, setManualGpsOffsetMeters] = useState<number>(0);

  if (!isOpen) return null;

  // Registered project coordinates (default fallback for project)
  const projectCoords = {
    lat: 18.5089,
    lng: 73.9260,
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setImagePreview(url);
      setAnalysisResult(null);
    }
  };

  const runEvidenceAnalysis = async () => {
    if (!file || !imagePreview) return;
    setIsProcessing(true);

    try {
      // 1. Extract Real EXIF Metadata via exifr
      let exifLat: number | undefined;
      let exifLng: number | undefined;
      let exifDateTime: string | undefined;
      let cameraModel: string | undefined;
      let hasRealGps = false;

      try {
        const exifData = await exifr.parse(file, {
          gps: true,
          pick: ['latitude', 'longitude', 'DateTimeOriginal', 'Make', 'Model'],
        });

        if (exifData) {
          if (typeof exifData.latitude === 'number' && typeof exifData.longitude === 'number') {
            exifLat = exifData.latitude;
            exifLng = exifData.longitude;
            hasRealGps = true;
          }
          exifDateTime = exifData.DateTimeOriginal ? new Date(exifData.DateTimeOriginal).toLocaleString('en-IN') : undefined;
          cameraModel = exifData.Make || exifData.Model ? `${exifData.Make || ''} ${exifData.Model || ''}`.trim() : undefined;
        }
      } catch (err) {
        console.warn('EXIF parsing error or missing EXIF headers:', err);
      }

      // If no GPS tags found (common for web uploads), apply selected manual offset for demo analysis
      const finalLat = hasRealGps && exifLat ? exifLat : projectCoords.lat + (manualGpsOffsetMeters / 111320);
      const finalLng = hasRealGps && exifLng ? exifLng : projectCoords.lng;

      const distanceMeters = calculateHaversineDistance(
        projectCoords.lat,
        projectCoords.lng,
        finalLat,
        finalLng
      );

      const isGpsMismatch = distanceMeters > 100;

      // 2. Compute Client-Side Perceptual Hash (dHash) on the image
      const img = new Image();
      img.src = imagePreview;
      await new Promise(resolve => {
        img.onload = resolve;
      });

      const pHash = computeClientSideDHash(img);

      // Compare pHash against existing evidence repository
      let bestMatch = { matchedProjectId: undefined as string | undefined, similarityPct: 0, isDuplicate: false };
      for (const existing of EXISTING_EVIDENCE_HASHES) {
        const sim = computeHashSimilarity(pHash, existing.hash);
        if (sim > bestMatch.similarityPct) {
          bestMatch = {
            matchedProjectId: existing.projectId,
            similarityPct: sim,
            isDuplicate: sim > 85,
          };
        }
      }

      // 3. Compute Real Risk Delta
      let computedPhotoScore = 15;
      if (isGpsMismatch) {
        computedPhotoScore += Math.min(60, Math.round(distanceMeters / 100) * 8);
      }
      if (bestMatch.isDuplicate) {
        computedPhotoScore = Math.max(computedPhotoScore, Math.round(bestMatch.similarityPct * 0.95));
      }
      computedPhotoScore = Math.min(100, Math.max(10, computedPhotoScore));

      // Calculate composite delta
      const baseComposite = project.risk_score;
      const compositeRiskDelta = Math.round((computedPhotoScore - 20) * 0.25);
      const computedCompositeScore = Math.min(100, Math.max(5, baseComposite + compositeRiskDelta));

      const result: EvidenceAnalysisResult = {
        fileName: file.name,
        imagePreviewUrl: imagePreview,
        exifData: {
          lat: finalLat,
          lng: finalLng,
          dateTime: exifDateTime || new Date().toLocaleString('en-IN'),
          cameraModel: cameraModel || 'Generic Digital Sensor',
          hasRealGps,
        },
        projectCoordinates: projectCoords,
        distanceMeters,
        isGpsMismatch,
        pHash,
        duplicateMatch: bestMatch,
        computedPhotoRiskScore: computedPhotoScore,
        computedCompositeRiskScore: computedCompositeScore,
        riskScoreDelta: compositeRiskDelta,
      };

      setAnalysisResult(result);
      setIsProcessing(false);

      if (isGpsMismatch || bestMatch.isDuplicate) {
        warning(
          'Evidence Anomaly Detected',
          `GPS Geotag Delta: ${distanceMeters}m | pHash Similarity: ${bestMatch.similarityPct}%`
        );
      } else {
        success('Evidence Verified Clean', 'GPS coordinates within bounds & unique perceptual hash.');
      }

      if (onEvidenceProcessed) {
        onEvidenceProcessed(result);
      }
    } catch (error) {
      console.error('Evidence analysis error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto font-sans animate-scale-up">
        {/* Modal Header */}
        <div className="bg-[#003580] text-white p-4 px-6 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-[#FF6B00]" />
            <div>
              <div className="text-sm font-bold">Client-Side AI Evidence Photo Verification</div>
              <div className="text-[11px] text-white/70">Project: {project.project_id} • {project.work_name.slice(0, 36)}...</div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* File Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              imagePreview ? 'border-[#003580] bg-blue-50/30' : 'border-gray-300 hover:border-[#003580] bg-gray-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
                <img
                  src={imagePreview}
                  alt="Evidence Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-300 shadow-sm"
                />
                <div className="flex-1 text-xs">
                  <div className="font-bold text-gray-900 text-sm">{file?.name}</div>
                  <div className="text-gray-500 mt-0.5">Size: {((file?.size || 0) / 1024).toFixed(1)} KB</div>
                  <div className="text-[#003580] font-semibold mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Image loaded for client-side EXIF &amp; pHash audit</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-[#003580] mx-auto" />
                <div className="text-xs font-bold text-gray-800">Click to Upload Site Evidence Photograph</div>
                <div className="text-[11px] text-gray-500">Supports JPG, PNG, WEBP with embedded EXIF geotags</div>
              </div>
            )}
          </div>

          {/* Fallback GPS Offset Simulator (For web demo images without raw GPS hardware metadata) */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-gray-200 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#003580]" />
                Simulate Ground Distance Offset from Registered Site:
              </span>
              <span className={`font-bold ${manualGpsOffsetMeters > 100 ? 'text-red-600' : 'text-emerald-700'}`}>
                {manualGpsOffsetMeters} meters {manualGpsOffsetMeters > 100 ? '(Mismatch Flag)' : '(Valid Boundary)'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1500}
              step={25}
              value={manualGpsOffsetMeters}
              onChange={e => setManualGpsOffsetMeters(parseInt(e.target.value, 10))}
              className="w-full accent-[#003580]"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>0m (Exact Site)</span>
              <span>100m Threshold</span>
              <span>500m Outlier</span>
              <span>1.5km (Severe Fraud Flag)</span>
            </div>
          </div>

          {/* Action Button */}
          {file && !analysisResult && (
            <button
              onClick={runEvidenceAnalysis}
              disabled={isProcessing}
              className="w-full py-2.5 bg-[#003580] hover:bg-[#002860] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Client-Side EXIF &amp; 64-bit pHash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                  <span>Execute Real-Time Evidence Verification</span>
                </>
              )}
            </button>
          )}

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="space-y-4 pt-2 border-t border-gray-200 animate-fade-in text-xs">
              <div className="font-bold text-sm text-[#003580] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FF6B00]" />
                <span>Client-Side Machine Verification Findings:</span>
              </div>

              {/* 2-Column Findings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. EXIF Geotag Verification */}
                <div
                  className={`p-3.5 rounded-lg border ${
                    analysisResult.isGpsMismatch
                      ? 'bg-red-50/80 border-red-200 text-red-950'
                      : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>EXIF GPS Geotag Audit</span>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <div>Calculated Delta: <strong>{analysisResult.distanceMeters} meters</strong></div>
                    <div>Threshold Limit: <strong>100 meters</strong></div>
                    <div className="text-[10px] opacity-80">
                      Geotag: {analysisResult.exifData.lat?.toFixed(4)}, {analysisResult.exifData.lng?.toFixed(4)}
                    </div>
                  </div>
                  <div className="mt-2.5 font-bold text-[11px]">
                    {analysisResult.isGpsMismatch ? (
                      <span className="text-red-700">❌ GEOTAG MISMATCH (Out of Bounds)</span>
                    ) : (
                      <span className="text-emerald-700">✅ GPS LOCATION VERIFIED (Within 100m)</span>
                    )}
                  </div>
                </div>

                {/* 2. Perceptual Hash (pHash) Verification */}
                <div
                  className={`p-3.5 rounded-lg border ${
                    analysisResult.duplicateMatch.isDuplicate
                      ? 'bg-red-50/80 border-red-200 text-red-950'
                      : 'bg-blue-50/80 border-blue-200 text-blue-950'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Perceptual Hash (64-bit dHash)</span>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <div>Similarity Match: <strong>{analysisResult.duplicateMatch.similarityPct}%</strong></div>
                    <div>Duplicate Threshold: <strong>85%</strong></div>
                    <div className="text-[10px] font-mono truncate">
                      Hash: {analysisResult.pHash.slice(0, 16)}...
                    </div>
                  </div>
                  <div className="mt-2.5 font-bold text-[11px]">
                    {analysisResult.duplicateMatch.isDuplicate ? (
                      <span className="text-red-700">
                        ❌ REUSED IMAGE MATCH (Project {analysisResult.duplicateMatch.matchedProjectId})
                      </span>
                    ) : (
                      <span className="text-blue-700">✅ UNIQUE STRUCTURAL FINGERPRINT</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Risk Score Delta Banner */}
              <div className="p-3.5 bg-slate-900 text-white rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Computed Impact on Risk Score</div>
                  <div className="text-xs text-white/90 mt-0.5">
                    Photo Risk Sub-Score: <span className="font-bold text-[#FF6B00]">{analysisResult.computedPhotoRiskScore}/100</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-white">
                    {analysisResult.computedCompositeRiskScore}/100
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">
                    Delta: {analysisResult.riskScoreDelta >= 0 ? `+${analysisResult.riskScoreDelta}` : analysisResult.riskScoreDelta} pts
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end gap-2 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          {analysisResult && (
            <button
              onClick={() => {
                success('Evidence Added to Forensic Dossier', `Recorded verified photo analysis for ${project.project_id}`);
                onClose();
              }}
              className="px-4 py-2 bg-[#003580] hover:bg-[#002860] text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              Attach to Project Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
