import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Project, Anomaly, InspectionPriorityItem } from '../types';

/**
 * Generates an official Inspection Docket PDF using jsPDF
 */
export function generateInspectionDocketPDF(item: InspectionPriorityItem, projectDetails?: Project): void {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(0, 53, 128); // #003580 MoSPI Blue
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF INDIA • MoSPI', 14, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('MPLADS VIGILANCE WING — ON-SITE PHYSICAL INSPECTION DOCKET', 14, 20);

  // Docket Metadata Box
  doc.setFillColor(245, 247, 250);
  doc.rect(14, 34, 182, 32, 'F');
  doc.setDrawColor(209, 213, 219);
  doc.rect(14, 34, 182, 32, 'S');

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`DOCKET NO: DCKT-${item.projectId}-${Date.now().toString().slice(-4)}`, 18, 42);
  doc.text(`PRIORITY RANK: #${item.rank} (${item.riskLevel} RISK)`, 18, 48);
  doc.text(`GENERATED ON: ${new Date().toLocaleDateString('en-IN')}`, 18, 54);
  doc.text(`ASSIGNED OFFICER: ${item.assignedInspector || 'District Vigilance Officer'}`, 18, 60);

  doc.text(`PROJECT ID: ${item.projectId}`, 110, 42);
  doc.text(`COMPOSITE SCORE: ${item.compositeScore}/100`, 110, 48);
  doc.text(`AT-RISK FUND: Rs. ${item.estimatedFinancialRiskLakhs} Lakhs`, 110, 54);
  doc.text(`STATE / MP: ${item.state} (${item.mpName})`, 110, 60);

  // Project Information Table
  autoTable(doc, {
    startY: 72,
    head: [['Field', 'Sanctioned / Recorded Data']],
    body: [
      ['Work Name', item.workName],
      ['Constituency', item.constituency],
      ['Primary Flag Domain', `${item.primaryFlagModule.toUpperCase()} ANOMALY`],
      ['Days Under Monitoring', `${item.daysFlagged} Days`],
      ['Sanctioned Cost', projectDetails ? `Rs. ${projectDetails.sanctioned_cost} Lakhs` : `Rs. ${item.estimatedFinancialRiskLakhs} Lakhs`],
      ['Reported Physical Progress', projectDetails ? `${projectDetails.physical_progress}%` : 'Pending Verification'],
      ['Implementing Agency', projectDetails ? projectDetails.implementing_agency : 'District Rural Development Agency (DRDA)'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 53, 128], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [31, 41, 55] },
  });

  // Checklist for Field Officer
  const finalY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 53, 128);
  doc.text('MANDATORY PHYSICAL AUDIT CHECKLIST (TO BE COMPLETED ON-SITE):', 14, finalY);

  autoTable(doc, {
    startY: finalY + 4,
    head: [['#', 'Verification Step', 'Officer Observation', 'Status (Pass/Fail)']],
    body: [
      ['1', 'GPS Geotag Boundary Verification (Verify within 50m of coordinates)', '', '[  ] PASS  [  ] FAIL'],
      ['2', 'Visual Stage-Gate Progress vs. Claimed Progress in e-Sakshi', '', '[  ] PASS  [  ] FAIL'],
      ['3', 'Check for Multiple Scheme Signboards (PMGSY / Jal Jeevan / Smart Cities)', '', '[  ] PASS  [  ] FAIL'],
      ['4', 'Verification of Quality Test Certificates on Material Batch', '', '[  ] PASS  [  ] FAIL'],
      ['5', 'Capture 4 Timestamped Geo-tagged Photos (North, South, East, West)', '', '[  ] PASS  [  ] FAIL'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255], fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [31, 41, 55] },
  });

  // Signature Block
  const sigY = (doc as any).lastAutoTable.finalY + 16;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Inspecting Officer Signature: _______________________', 14, sigY);
  doc.text('District Collector Seal: _______________________', 120, sigY);
  doc.text('Date of On-Site Inspection: _______________________', 14, sigY + 8);
  doc.text('Verification Status: [  ] VERIFIED  [  ] RECOVERY RECOMMENDED', 120, sigY + 8);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(156, 163, 175);
  doc.text('MPLADS AI Insight Sentinel • Smart India Hackathon 2026 Prototype • Confidential Official Record', 14, 285);

  doc.save(`MPLADS_Inspection_Docket_${item.projectId}.pdf`);
}

/**
 * Exports Anomalies List as PDF Report
 */
export function generateAnomaliesPDF(anomalies: Anomaly[]): void {
  const doc = new jsPDF('landscape');

  // Header
  doc.setFillColor(0, 53, 128);
  doc.rect(0, 0, 297, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('MPLADS AI INSIGHT — NATIONWIDE ANOMALY AUDIT REPORT', 14, 11);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} • Total Records: ${anomalies.length}`, 14, 18);

  autoTable(doc, {
    startY: 30,
    head: [['Anomaly ID', 'Project ID', 'Work Name', 'Type', 'Severity', 'Detected vs Expected', 'Confidence', 'State']],
    body: anomalies.slice(0, 50).map(a => [
      a.anomaly_id,
      a.project_id,
      a.work_name.slice(0, 32) + '...',
      a.anomaly_type,
      a.severity,
      `${a.detected_value} (Exp: ${a.expected_value})`,
      `${a.ai_confidence}%`,
      a.state,
    ]),
    theme: 'striped',
    headStyles: { fillColor: [0, 53, 128], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [31, 41, 55] },
  });

  doc.save(`MPLADS_Anomaly_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Helper to export any array of objects as a downloadable CSV
 */
export function exportToCSV(data: Record<string, any>[], filename: string): void {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  // Header row
  csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

  // Data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
