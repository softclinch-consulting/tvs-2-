import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ScanLine,
  QrCode,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Camera,
  FileText,
  User,
  Truck,
  RotateCcw,
  Check,
  Building2,
  XCircle,
  HelpCircle,
  Upload,
  Lock
} from 'lucide-react';

export const GateAppContainer: React.FC = () => {
  const {
    gateScreen,
    setGateScreen,
    jobCards,
    tyres,
    mismatchCases,
    gateScanPhysicalTyre,
    completeGateReceiving,
    submitMismatchEvidence,
    selectedJobCardId,
    setSelectedJobCardId,
    setSelectedCaseId,
    setActiveApp,
    setMgmtScreen
  } = useApp();

  const [scanSerialInput, setScanSerialInput] = useState('TYR-001');
  const [scannedFeedback, setScannedFeedback] = useState<string | null>(null);
  const [evidenceRemarks, setEvidenceRemarks] = useState(
    'Gate physical scan count mismatch. 18 tyres scanned off truck TN38 AB 1234 out of 20 customer confirmed. TYR-019 and TYR-020 missing on physical arrival.'
  );

  const currentJob = jobCards.find((j) => j.id === selectedJobCardId) || jobCards[0];
  const currentTyres = tyres.filter((t) => t.jobCardId === currentJob.id);
  const scannedTyres = currentTyres.filter((t) => t.gateScanned);
  const unscannedTyres = currentTyres.filter((t) => !t.gateScanned);

  const handleSimulateSingleScan = (tyreIdToScan?: string) => {
    const target = tyreIdToScan || scanSerialInput;
    const res = gateScanPhysicalTyre(currentJob.id, target);
    if (res.success) {
      setScannedFeedback(`✓ Scanned ${res.tyre?.id} (${res.tyre?.serialNo})`);
      setGateScreen(6); // Tyre Check Screen
    } else if (res.isUnexpected) {
      setGateScreen(7); // Unknown Tyre Warning Screen
    }
  };

  const handleSimulateScan18 = () => {
    // Scan 18 tyres automatically for fast demonstration
    for (let i = 1; i <= 18; i++) {
      const tId = `TYR-${i.toString().padStart(3, '0')}`;
      gateScanPhysicalTyre(currentJob.id, tId);
    }
    setGateScreen(8); // Receiving Progress Screen (18/20)
  };

  const handleCompleteReceivingClick = () => {
    completeGateReceiving(currentJob.id);
    if (scannedTyres.length < currentJob.confirmedQty) {
      setGateScreen(9); // Mismatch Screen
    } else {
      setGateScreen(11); // Receiving Complete
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)] bg-slate-950 p-2 sm:p-6">
      {/* Rugged Factory Scanner / Tablet Device Frame */}
      <div className="w-full max-w-[480px] bg-slate-900 border-4 sm:border-8 border-slate-800 rounded-[28px] shadow-2xl overflow-hidden flex flex-col h-[800px] relative font-sans text-slate-100">
        
        {/* Device Header */}
        <div className="bg-slate-950 px-4 py-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-200">GATE TERMINAL BAY 2</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Operator: Ravi (EMP-GAT-201)</span>
        </div>

        {/* Screen Switch Bar */}
        <div className="bg-slate-850 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
          <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <ScanLine className="w-3.5 h-3.5" /> Gate Receiving App
          </span>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Screen:</span>
            <select
              value={gateScreen}
              onChange={(e) => setGateScreen(Number(e.target.value))}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-1.5 py-0.5 text-[10px]"
            >
              <option value={1}>01. Login</option>
              <option value={2}>02. Dashboard</option>
              <option value={3}>03. Incoming Jobs</option>
              <option value={4}>04. Select Job</option>
              <option value={5}>05. Receiving Scanner</option>
              <option value={6}>06. Tyre Check</option>
              <option value={7}>07. Unknown Tyre Warning</option>
              <option value={8}>08. Receiving Progress</option>
              <option value={9}>09. Quantity Mismatch Alert</option>
              <option value={10}>10. Mismatch Evidence</option>
              <option value={11}>11. Receiving Complete</option>
              <option value={12}>12. Gate History</option>
              <option value={13}>13. Gate Alerts</option>
              <option value={14}>14. Gate Profile</option>
            </select>
          </div>
        </div>

        {/* GATE SCREEN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">

          {/* SCREEN 01 — GATE LOGIN */}
          {gateScreen === 1 && (
            <div className="space-y-6 pt-6 text-center">
              <div className="w-16 h-16 bg-amber-600/30 border border-amber-500/50 rounded-2xl flex items-center justify-center mx-auto">
                <ScanLine className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Gate Receiving Terminal</h2>
                <p className="text-xs text-slate-400">Factory Gate Physical Tyre Reconciliation</p>
              </div>
              <div className="space-y-3 text-left">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Employee ID</label>
                  <input
                    type="text"
                    defaultValue="EMP-GAT-201"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs mt-1 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs mt-1 text-white"
                  />
                </div>
                <button
                  onClick={() => setGateScreen(2)}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl text-xs mt-2"
                >
                  LOGIN TO GATE TERMINAL
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 02 — GATE DASHBOARD */}
          {gateScreen === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white">Gate Dashboard</h3>
                  <p className="text-[11px] text-slate-400">Today's Physical Receiving Queue</p>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                  Bay 2 Active
                </span>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Incoming Trucks</span>
                  <strong className="text-xl text-white block mt-0.5">12 Jobs</strong>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Expected Tyres</span>
                  <strong className="text-xl text-blue-400 block mt-0.5">124 Tyres</strong>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold">Received Today</span>
                  <strong className="text-xl text-emerald-400 block mt-0.5">87 Tyres</strong>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-red-400 uppercase font-semibold">Mismatch Cases</span>
                  <strong className="text-xl text-red-400 block mt-0.5">2 Cases</strong>
                </div>
              </div>

              <button
                onClick={() => setGateScreen(3)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <ScanLine className="w-5 h-5" /> START RECEIVING & SCANNING
              </button>

              {/* Incoming Cards */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Arriving Trucks</h4>
                <div className="space-y-2">
                  {jobCards.slice(0, 2).map((job) => (
                    <div
                      key={job.id}
                      onClick={() => {
                        setSelectedJobCardId(job.id);
                        setGateScreen(4);
                      }}
                      className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex justify-between items-center cursor-pointer hover:bg-slate-750"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-amber-400">{job.id}</span>
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-1.5 py-0.2 rounded">
                            {job.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white mt-0.5">{job.customerName}</p>
                        <p className="text-[10px] text-slate-400">
                          Vehicle: {job.vehicleNo} • Driver: {job.driverName}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-white block">20 Tyres</span>
                        <span className="text-[10px] text-amber-400 font-semibold">Tap to Scan</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 03 — INCOMING JOBS */}
          {gateScreen === 3 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button onClick={() => setGateScreen(2)} className="p-1 text-slate-400">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-sm font-bold text-white">Incoming Job Cards</h3>
              </div>
              <div className="space-y-2">
                {jobCards.map((j) => (
                  <div
                    key={j.id}
                    onClick={() => {
                      setSelectedJobCardId(j.id);
                      setGateScreen(4);
                    }}
                    className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-2 cursor-pointer hover:bg-slate-750"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-amber-400">{j.id}</span>
                      <span className="text-[10px] text-slate-400">{j.status}</span>
                    </div>
                    <p className="text-xs font-bold text-white">{j.customerName}</p>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Vehicle: {j.vehicleNo}</span>
                      <span className="text-blue-400 font-bold">Expected: {j.confirmedQty || 20}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 04 — SELECT JOB */}
          {gateScreen === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setGateScreen(3)} className="p-1 text-slate-400">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-sm font-bold text-white">Job Card Selected</h3>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Job Card ID:</span>
                  <span className="font-bold text-amber-400 text-sm">{currentJob.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-bold text-white">{currentJob.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle No:</span>
                  <span className="font-bold text-white">{currentJob.vehicleNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver:</span>
                  <span className="font-bold text-white">{currentJob.driverName}</span>
                </div>
                <div className="flex justify-between border-t border-slate-700 pt-2 text-sm">
                  <span className="text-slate-300">Customer Confirmed Qty:</span>
                  <span className="font-bold text-emerald-400">20 Tyres</span>
                </div>
              </div>

              <button
                onClick={() => setGateScreen(5)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-amber-500/20"
              >
                START SCANNING PHYSICAL TYRES
              </button>
            </div>
          )}

          {/* SCREEN 05 — RECEIVING SCANNER */}
          {gateScreen === 5 && (
            <div className="space-y-3 text-center">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-400">{currentJob.id}</span>
                <span className="text-slate-400">
                  Scanned:{' '}
                  <strong className="text-emerald-400">
                    {scannedTyres.length} / {currentJob.confirmedQty || 20}
                  </strong>
                </span>
              </div>

              {/* Large Camera Scanner Box */}
              <div className="relative bg-slate-950 border-2 border-dashed border-amber-500 rounded-2xl h-56 flex flex-col items-center justify-center p-4">
                <div className="w-52 h-32 border-2 border-amber-400 rounded-lg relative flex items-center justify-center overflow-hidden">
                  <div className="w-full h-1 bg-amber-400 animate-pulse" />
                  <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded absolute bottom-2">
                    SCAN EVERY PHYSICAL TYRE BARCODE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Position barcode scanner over tyre sidewall</p>
              </div>

              {/* Simulation Quick Bar */}
              <div className="space-y-2 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-semibold">Test Physical Scan Simulation</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scanSerialInput}
                    onChange={(e) => setScanSerialInput(e.target.value)}
                    placeholder="Enter Serial or TYR-001"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <button
                    onClick={() => handleSimulateSingleScan()}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    SCAN
                  </button>
                </div>
                <button
                  onClick={handleSimulateScan18}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg text-xs"
                >
                  ⚡ Fast-Scan 18 Physical Tyres (Simulate Truck Unloaded)
                </button>
              </div>

              {scannedTyres.length > 0 && (
                <button
                  onClick={() => setGateScreen(8)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs"
                >
                  VIEW RECEIVING PROGRESS ({scannedTyres.length} / 20)
                </button>
              )}
            </div>
          )}

          {/* SCREEN 06 — TYRE CHECK */}
          {gateScreen === 6 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Physical Tyre Scanned</h3>
                <span className="text-xs text-emerald-400 font-bold">MATCH CONFIRMED</span>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Scanned ID:</span>
                  <span className="font-bold text-amber-400">{scanSerialInput || 'TYR-001'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected under JC:</span>
                  <span className="font-bold text-emerald-400">YES ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Serial Number:</span>
                  <span className="font-mono text-white font-bold">ABC123456701</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Brand / Company:</span>
                  <span className="font-bold text-white">MRF Tyres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pickup Photos:</span>
                  <span className="font-bold text-emerald-400">Available ✓</span>
                </div>
                <div className="flex justify-between border-t border-slate-700 pt-2">
                  <span className="text-slate-300">Status:</span>
                  <span className="font-bold text-emerald-400 uppercase">RECEIVED AT GATE</span>
                </div>
              </div>

              <button
                onClick={() => setGateScreen(5)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs"
              >
                SCAN NEXT PHYSICAL TYRE
              </button>
            </div>
          )}

          {/* SCREEN 07 — UNKNOWN TYRE WARNING */}
          {gateScreen === 7 && (
            <div className="space-y-4 text-center pt-2">
              <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/40">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">⚠ UNEXPECTED TYRE SCANNED</span>
                <h3 className="text-base font-bold text-white mt-1">TYRE NOT REGISTERED</h3>
                <p className="text-xs text-slate-400 mt-0.5">Scanned Barcode: XYZ999999</p>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-left text-xs space-y-1 text-slate-300">
                <p>This physical tyre was NOT registered under Job Card <strong>{currentJob.id}</strong> during pickup.</p>
                <p className="text-[11px] text-amber-400 mt-1">
                  <strong>Policy:</strong> Unexpected tyres cannot be auto-added to customer receipt without supervisor approval.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setGateScreen(5)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-xs border border-slate-700"
                >
                  SKIP & SCAN NEXT
                </button>
                <button
                  onClick={() => {
                    setActiveApp('management');
                    setMgmtScreen(9);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  LOG INVESTIGATION
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 08 — RECEIVING PROGRESS */}
          {gateScreen === 8 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Receiving Progress</h3>
                <span className="text-xs text-amber-400 font-bold">
                  {scannedTyres.length} / {currentJob.confirmedQty || 20} Scanned
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    scannedTyres.length < 20 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${(scannedTyres.length / 20) * 100}%` }}
                />
              </div>

              <div className="space-y-1 max-h-[260px] overflow-y-auto text-xs">
                {currentTyres.map((t) => (
                  <div
                    key={t.id}
                    className={`p-2 rounded-lg border flex justify-between items-center ${
                      t.gateScanned
                        ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                        : 'bg-red-950/30 border-red-500/40 text-red-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold mr-2">{t.id}</span>
                      <span className="font-mono text-[11px] text-slate-400">{t.serialNo}</span>
                    </div>
                    {t.gateScanned ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                        <Check className="w-3 h-3" /> SCANNED
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold text-[10px]">🔴 NOT SCANNED</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleCompleteReceivingClick}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-amber-500/20"
              >
                COMPLETE RECEIVING & RECONCILE
              </button>
            </div>
          )}

          {/* SCREEN 09 — QUANTITY MISMATCH ALERT SCREEN (CRITICAL SCREEN) */}
          {gateScreen === 9 && (
            <div className="space-y-3 bg-slate-900 border-2 border-red-500/60 p-3.5 rounded-2xl">
              <div className="bg-red-950/80 border border-red-500/80 p-3 rounded-xl text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                  <span>🚨 QUANTITY MISMATCH DETECTED</span>
                </div>
                <p className="text-[11px] text-red-300">
                  Physical gate receiving count differs from customer-confirmed pickup.
                </p>
              </div>

              {/* Exact Numbers Comparison */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Customer Confirmed</span>
                  <strong className="text-lg text-white">20</strong>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-emerald-400 block">Factory Received</span>
                  <strong className="text-lg text-emerald-400">18</strong>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl border border-red-500/60 bg-red-950/30">
                  <span className="text-[10px] text-red-400 block font-bold">Missing</span>
                  <strong className="text-lg text-red-400 font-bold">2</strong>
                </div>
              </div>

              {/* Identified Missing Tyres List */}
              <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 space-y-2 text-xs">
                <span className="text-red-400 font-bold block text-[11px] uppercase tracking-wider">
                  Identified Missing Tyres:
                </span>
                <div className="space-y-1.5">
                  <div className="bg-red-950/40 border border-red-500/40 p-2 rounded-lg flex justify-between items-center text-red-300">
                    <div>
                      <span className="font-bold">TYR-019</span>
                      <span className="text-[10px] block text-slate-400">Serial: ABC123456719 • MRF 10.00 R20</span>
                    </div>
                    <span className="text-[10px] font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                      MISSING ON ARRIVAL
                    </span>
                  </div>
                  <div className="bg-red-950/40 border border-red-500/40 p-2 rounded-lg flex justify-between items-center text-red-300">
                    <div>
                      <span className="font-bold">TYR-020</span>
                      <span className="text-[10px] block text-slate-400">Serial: ABC123456720 • Apollo 11.00 R20</span>
                    </div>
                    <span className="text-[10px] font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                      MISSING ON ARRIVAL
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <p><strong>Job Card:</strong> {currentJob.id}</p>
                <p><strong>Customer:</strong> {currentJob.customerName}</p>
                <p><strong>Driver:</strong> {currentJob.driverName} (Vehicle: {currentJob.vehicleNo})</p>
                <p><strong>Gate Operator:</strong> Ravi</p>
              </div>

              <button
                onClick={() => setGateScreen(10)}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-red-600/20"
              >
                PROCEED TO LOG MISMATCH EVIDENCE
              </button>
            </div>
          )}

          {/* SCREEN 10 — MISMATCH EVIDENCE */}
          {gateScreen === 10 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button onClick={() => setGateScreen(9)} className="p-1 text-slate-400">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-sm font-bold text-white">Log Evidence Case MIS-0045</h3>
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-300 block">Gate & Unloading Evidence Photos</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-20 bg-slate-800 border border-slate-700 rounded-xl flex flex-col items-center justify-center text-amber-400">
                    <Camera className="w-5 h-5" />
                    <span className="text-[10px] text-slate-300 mt-1">Gate Entry Photo</span>
                    <span className="text-[9px] text-emerald-400 font-bold">✓ Uploaded</span>
                  </div>
                  <div className="h-20 bg-slate-800 border border-slate-700 rounded-xl flex flex-col items-center justify-center text-amber-400">
                    <Camera className="w-5 h-5" />
                    <span className="text-[10px] text-slate-300 mt-1">Unloaded Bed Photo</span>
                    <span className="text-[9px] text-emerald-400 font-bold">✓ Uploaded</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mt-2">Gate Operator Remarks</label>
                  <textarea
                    rows={3}
                    value={evidenceRemarks}
                    onChange={(e) => setEvidenceRemarks(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <button
                  onClick={() => {
                    submitMismatchEvidence('MIS-0045', [], evidenceRemarks);
                    setGateScreen(11);
                  }}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs shadow-md mt-2"
                >
                  SUBMIT CASE TO MANAGEMENT
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 11 — RECEIVING COMPLETE */}
          {gateScreen === 11 && (
            <div className="space-y-4 text-center pt-2">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/40">
                <CheckCircle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Receiving Completed</h3>
                <p className="text-xs text-slate-400">Reconciliation Logged under {currentJob.id}</p>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected:</span>
                  <span className="font-bold text-white">20 Tyres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Received & Scanned:</span>
                  <span className="font-bold text-emerald-400">18 Tyres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Missing:</span>
                  <span className="font-bold text-red-400">2 Tyres (TYR-019, TYR-020)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Case Created:</span>
                  <span className="font-bold text-amber-400">MIS-0045</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveApp('management');
                  setMgmtScreen(10);
                  setSelectedCaseId('MIS-0045');
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs"
              >
                OPEN CASE IN MANAGEMENT PORTAL
              </button>
            </div>
          )}

          {/* SCREEN 12 — GATE HISTORY */}
          {gateScreen === 12 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Receiving History</h3>
              <div className="space-y-2">
                {mismatchCases.map((c) => (
                  <div key={c.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-amber-400">{c.id}</span>
                      <span className="text-red-400">{c.status}</span>
                    </div>
                    <p className="text-slate-200">{c.customerName} ({c.jobCardId})</p>
                    <p className="text-[10px] text-slate-400">
                      Expected {c.expectedQty} • Received {c.receivedQty} • Missing {c.missingQty}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 13 — GATE ALERTS */}
          {gateScreen === 13 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Gate Terminal Alerts</h3>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-red-400 font-bold">
                  <ShieldAlert className="w-4 h-4" /> Mismatch Case MIS-0045 Open
                </div>
                <p className="text-[11px] text-slate-300">
                  Investigation pending by Supervisor Raj for JC-2026-00125.
                </p>
              </div>
            </div>
          )}

          {/* SCREEN 14 — GATE PROFILE */}
          {gateScreen === 14 && (
            <div className="space-y-4 text-center pt-2">
              <div className="w-16 h-16 bg-amber-600/30 border-2 border-amber-500/50 rounded-full flex items-center justify-center mx-auto text-amber-400 font-bold text-xl">
                RV
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Ravi</h3>
                <p className="text-xs text-slate-400">Gate Operator (EMP-GAT-201)</p>
                <p className="text-xs text-slate-400">Factory Gate Receiving Bay 2</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left text-xs bg-slate-800 p-3 rounded-xl border border-slate-700">
                <div>
                  <span className="text-slate-400 block">Today Scans:</span>
                  <strong className="text-white">87 Scanned</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Scan Accuracy:</span>
                  <strong className="text-emerald-400">99.2%</strong>
                </div>
              </div>

              <button
                onClick={() => setGateScreen(1)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-red-400 font-semibold py-2.5 rounded-xl text-xs border border-slate-700"
              >
                LOGOUT
              </button>
            </div>
          )}

        </div>

        {/* GATE BOTTOM NAVIGATION BAR */}
        <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex justify-between items-center text-[10px] text-slate-400 shrink-0">
          <button
            onClick={() => setGateScreen(2)}
            className={`flex flex-col items-center gap-0.5 ${gateScreen === 2 ? 'text-amber-400 font-bold' : ''}`}
          >
            <ScanLine className="w-4 h-4" /> HOME
          </button>
          <button
            onClick={() => setGateScreen(3)}
            className={`flex flex-col items-center gap-0.5 ${gateScreen === 3 ? 'text-amber-400 font-bold' : ''}`}
          >
            <Truck className="w-4 h-4" /> TRUCKS
          </button>
          <button
            onClick={() => setGateScreen(5)}
            className={`flex flex-col items-center gap-0.5 ${gateScreen === 5 ? 'text-amber-400 font-bold' : ''}`}
          >
            <QrCode className="w-4 h-4" /> SCANNER
          </button>
          <button
            onClick={() => setGateScreen(12)}
            className={`flex flex-col items-center gap-0.5 ${gateScreen === 12 ? 'text-amber-400 font-bold' : ''}`}
          >
            <FileText className="w-4 h-4" /> HISTORY
          </button>
          <button
            onClick={() => setGateScreen(14)}
            className={`flex flex-col items-center gap-0.5 ${gateScreen === 14 ? 'text-amber-400 font-bold' : ''}`}
          >
            <User className="w-4 h-4" /> PROFILE
          </button>
        </div>

      </div>
    </div>
  );
};
