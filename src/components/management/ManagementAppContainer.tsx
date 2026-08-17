import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FitnessClassification,
  ProcessingStage,
  MaterialUsage,
  QCApprovalRecord
} from '../../types';
import {
  LayoutDashboard,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  FileText,
  Building2,
  Users,
  Settings,
  MessageSquare,
  Send,
  Plus,
  Download,
  Eye,
  Check,
  X,
  Lock,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Phone,
  QrCode,
  ShieldCheck,
  ExternalLink,
  Layers,
  ArrowRight,
  Factory,
  CreditCard,
  Database,
  RefreshCw,
  Cpu,
  Package,
  Wrench,
  Flame,
  Gauge,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const ManagementAppContainer: React.FC = () => {
  const {
    mgmtScreen,
    setMgmtScreen,
    jobCards,
    tyres,
    mismatchCases,
    auditLogs,
    internalMessages,
    whatsAppMessages,
    tyreCompanies,
    users,
    customers,
    retreadOrders,
    complaints,
    payments,
    sapExchangePayload,
    selectedJobCardId,
    setSelectedJobCardId,
    selectedTyreId,
    setSelectedTyreId,
    selectedCaseId,
    setSelectedCaseId,
    selectedOrderNo,
    setSelectedOrderNo,
    createCustomer,
    placeRetreadOrder,
    updateTyreFitnessClassification,
    advanceProductionStage,
    submitQcApproval,
    updateComplaintInspection,
    processPayment,
    triggerSapB1Sync,
    sendInternalMessage,
    addTyreCompany,
    advanceJobLifecycle,
    setActiveApp
  } = useApp();

  // Local form & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatRole, setChatRole] = useState<'Supervisor' | 'Gate' | 'Driver' | 'Inspector' | 'Management'>('Supervisor');
  
  // Production stage form states
  const [selectedProdStage, setSelectedProdStage] = useState<ProcessingStage>('BUFFING');
  const [patchSize, setPatchSize] = useState('Size 42 Radial');
  const [patchQty, setPatchQty] = useState(2);
  const [cushionGumKg, setCushionGumKg] = useState(1.4);
  const [treadRubberKg, setTreadRubberKg] = useState(12.5);
  const [shiftIncharge, setShiftIncharge] = useState('M. Selvam (Shift A)');
  const [prodNotes, setProdNotes] = useState('Buffing depth 3.2mm calibrated. Casing rasping uniform.');

  // QC Form states
  const [pciPressure, setPciPressure] = useState(120);
  const [treadWidthMm, setTreadWidthMm] = useState(220);
  const [qcNotes, setQcNotes] = useState('PDI Passed. Curing adhesion test 100% verified.');

  // Complaint resolution states
  const [selectedComplaintId, setSelectedComplaintId] = useState('CMP-2026-0045');
  const [complaintResult, setComplaintResult] = useState<'ACCEPTED' | 'REJECTED'>('ACCEPTED');
  const [complaintNotes, setComplaintNotes] = useState('Inspection verified missing item during in-transit mismatch MIS-0045. Credit note recommended.');
  const [creditAmount, setCreditAmount] = useState(4800);

  // New Customer Form inside Management
  const [newCustName, setNewCustName] = useState('');
  const [newCustPan, setNewCustPan] = useState('');
  const [newCustGst, setNewCustGst] = useState('');
  const [newCustMobile, setNewCustMobile] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustType, setNewCustType] = useState<'Fleet Operator' | 'Dealer' | 'Direct Customer'>('Fleet Operator');

  const currentJob = jobCards.find((j) => j.id === selectedJobCardId) || jobCards[0];
  const currentTyre = tyres.find((t) => t.id === selectedTyreId) || tyres.find((t) => t.id === 'TYR-019') || tyres[0];
  const currentCase = mismatchCases.find((c) => c.id === selectedCaseId) || mismatchCases[0];
  const currentOrder = retreadOrders.find((o) => o.orderNo === selectedOrderNo) || retreadOrders[0];
  const currentComplaint = complaints.find((c) => c.id === selectedComplaintId) || complaints[0];

  const caseMessages = internalMessages.filter((m) => m.caseId === currentCase.id);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendInternalMessage(currentCase.id, chatInput, chatRole);
    setChatInput('');
  };

  const handleAdvanceProduction = () => {
    const mat: MaterialUsage = {
      patchSize,
      patchQuantity: patchQty,
      cushionGumKg,
      treadRubberKg,
      cementLiters: 0.8,
      shiftInCharge: shiftIncharge,
      operatorName: 'M. Selvam',
      recordedAt: new Date().toISOString()
    };
    advanceProductionStage(currentJob.id, selectedProdStage, mat);
  };

  const handleQcSubmit = () => {
    const qc: QCApprovalRecord = {
      approved: true,
      inspectorName: 'Suresh (QC Senior)',
      pciPressurePsi: pciPressure,
      pdiNotes: qcNotes,
      approvedAt: new Date().toISOString()
    };
    submitQcApproval(currentJob.id, qc);
  };

  const handleResolveComplaint = () => {
    updateComplaintInspection(
      currentComplaint.id,
      complaintResult,
      complaintNotes,
      complaintResult === 'ACCEPTED' ? 'APPROVED_REPLACEMENT' : 'REJECTED',
      creditAmount
    );
  };

  const handleCreateCustomerFromMgmt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustMobile) return;
    createCustomer({
      name: newCustName,
      address: newCustAddress || 'Chennai Central Yard',
      pan: newCustPan || 'AABCT1234F',
      gst: newCustGst || '33AABCT1234F1Z9',
      mobileNo: newCustMobile,
      fleetOrDealerType: newCustType
    });
    setNewCustName('');
    setNewCustMobile('');
    setNewCustPan('');
    setNewCustGst('');
    setNewCustAddress('');
  };

  const navMenuItems = [
    { screen: 2, label: 'Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { screen: 3, label: 'Customer Management (M2)', icon: <Users className="w-4 h-4 text-blue-400" /> },
    { screen: 4, label: 'Retread Orders & Job Cards (M3)', icon: <FileText className="w-4 h-4 text-indigo-400" /> },
    { screen: 6, label: 'Inspection & Fitness (M4)', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { screen: 18, label: '7-Stage Production (M5)', icon: <TrendingUp className="w-4 h-4 text-amber-400" /> },
    { screen: 19, label: 'QC & PDI Clearance', icon: <CheckCircle className="w-4 h-4 text-emerald-400" /> },
    { screen: 20, label: 'Order Status Timeline (M6)', icon: <Clock className="w-4 h-4 text-cyan-400" /> },
    { screen: 21, label: 'Complaint Management (M7)', icon: <MessageSquare className="w-4 h-4 text-red-400" />, badge: 'SMS Alert' },
    { screen: 22, label: 'Payments & Accounts (M8)', icon: <CreditCard className="w-4 h-4 text-emerald-400" /> },
    { screen: 23, label: 'Reports & Outstanding (M9)', icon: <BarChart2 className="w-4 h-4 text-purple-400" /> },
    { screen: 24, label: 'SAP B1 Middleware (M10)', icon: <Database className="w-4 h-4 text-orange-400" />, badge: 'Live JSON' },
    { screen: 9, label: 'Mismatch Center', icon: <AlertTriangle className="w-4 h-4 text-red-400" />, badge: 'MIS-0045' },
    { screen: 11, label: 'Internal Team Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { screen: 25, label: 'Audit Trail System', icon: <Clock className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* MANAGEMENT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-3 space-y-4 shrink-0 overflow-y-auto max-h-screen">
        <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            <Factory className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-xs">TVS TREAD Portal</h4>
            <p className="text-[10px] text-blue-400">Sundaram Industries</p>
          </div>
        </div>

        {/* Navigation Link List */}
        <nav className="space-y-1">
          {navMenuItems.map((item) => {
            const isActive = mgmtScreen === item.screen;
            return (
              <button
                key={item.screen}
                onClick={() => setMgmtScreen(item.screen)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-amber-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN MANAGEMENT CONTENT VIEW */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">

        {/* ========================================================================= */}
        {/* SCREEN 02 — EXECUTIVE DASHBOARD */}
        {/* ========================================================================= */}
        {mgmtScreen === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-indigo-950/60 p-5 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider">
                  Enterprise Command Center
                </span>
                <h2 className="text-xl font-extrabold text-white">TVS TREAD Overview</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sundaram Industries Pvt Ltd • Real-time Traceability & Operations
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerSapB1Sync(selectedOrderNo)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> SAP B1 Sync
                </button>
              </div>
            </div>

            {/* KPI Top Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center text-slate-400 text-xs">
                  <span>Active Retread Orders</span>
                  <Package className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-2xl font-black text-white mt-2">{retreadOrders.length}</p>
                <span className="text-[10px] text-emerald-400 font-semibold">100% Traceable</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center text-slate-400 text-xs">
                  <span>Registered Tyres</span>
                  <Layers className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-2xl font-black text-white mt-2">{tyres.length}</p>
                <span className="text-[10px] text-blue-400 font-semibold">TVS Eurogrip & MC</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center text-slate-400 text-xs">
                  <span>Chain of Custody Discrepancy</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-amber-400 mt-2">1 Active</p>
                <span className="text-[10px] text-red-400 font-semibold">MIS-0045 (2 Missing)</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center text-slate-400 text-xs">
                  <span>Logged Complaints</span>
                  <MessageSquare className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-2xl font-black text-white mt-2">{complaints.length}</p>
                <span className="text-[10px] text-emerald-400 font-semibold">SMS Automated</span>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setMgmtScreen(6)}
                className="bg-slate-900 hover:bg-slate-850 p-4 rounded-2xl border border-slate-800 cursor-pointer transition space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Module 4: Inspection & Fitness
                  </h4>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-xs text-slate-400">
                  Classify tyres as Fit – OK, EPR (Entire Party Risk), Partial Risk, or Unfit.
                </p>
              </div>

              <div
                onClick={() => setMgmtScreen(18)}
                className="bg-slate-900 hover:bg-slate-850 p-4 rounded-2xl border border-slate-800 cursor-pointer transition space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" /> Module 5: 7-Stage Production
                  </h4>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-xs text-slate-400">
                  Track Buffing, Rasping, Repair, Coating, Curing, PCI & PDI with material usage logs.
                </p>
              </div>

              <div
                onClick={() => setMgmtScreen(24)}
                className="bg-slate-900 hover:bg-slate-850 p-4 rounded-2xl border border-slate-800 cursor-pointer transition space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-orange-400" /> Module 10: SAP B1 Payload
                  </h4>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-xs text-slate-400">
                  Inspect live JSON schema payloads exchanged between TVS App and SAP Business One.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 03 — CUSTOMER MANAGEMENT (MODULE 2) */}
        {/* ========================================================================= */}
        {mgmtScreen === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">Module 2: Customer Management Master</h2>
                <p className="text-xs text-slate-400">Fleet Operators, Dealers & Direct Accounts with SAP Sync</p>
              </div>
            </div>

            {/* Quick Customer Onboarding Form */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" /> Onboard New Customer
              </h3>
              <form onSubmit={handleCreateCustomerFromMgmt} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block font-medium">Customer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Logistics"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block font-medium">Mobile Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 9841234567"
                    value={newCustMobile}
                    onChange={(e) => setNewCustMobile(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block font-medium">PAN & GST</label>
                  <input
                    type="text"
                    placeholder="PAN: AABCS1234K"
                    value={newCustPan}
                    onChange={(e) => setNewCustPan(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs transition"
                  >
                    Save & Sync SAP
                  </button>
                </div>
              </form>
            </div>

            {/* Customers Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Mobile No</th>
                    <th className="p-3">PAN / GST</th>
                    <th className="p-3">Credit Limit</th>
                    <th className="p-3">Outstanding</th>
                    <th className="p-3">SAP Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-850/60 transition">
                      <td className="p-3">
                        <strong className="text-white block">{c.name}</strong>
                        <span className="text-[10px] text-slate-400">{c.id}</span>
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300">
                          {c.fleetOrDealerType}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{c.mobileNo}</td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">
                        {c.pan} / {c.gst}
                      </td>
                      <td className="p-3 text-slate-300">₹{c.creditLimit.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={c.outstandingAmount > 0 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                          ₹{c.outstandingAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          ✓ Synced
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 04 — RETREAD ORDERS & JOB CARDS (MODULE 3) */}
        {/* ========================================================================= */}
        {mgmtScreen === 4 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">Module 3: Retread Orders & Job Cards</h2>
                <p className="text-xs text-slate-400">Branch-wise series numbering, vehicle mapping & auto Job Cards</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {retreadOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => {
                    setSelectedOrderNo(ord.orderNo);
                    const matchedJob = jobCards.find((j) => j.orderNo === ord.orderNo);
                    if (matchedJob) setSelectedJobCardId(matchedJob.id);
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-3 ${
                    selectedOrderNo === ord.orderNo
                      ? 'bg-slate-850 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-850/60'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-400 font-mono">{ord.orderNo}</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded">
                      {ord.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-white font-semibold">Customer: {ord.customerName}</p>
                    <p className="text-slate-400">Branch: {ord.branch} • Vehicle: {ord.vehicleNo}</p>
                    <p className="text-slate-400">Tyres: <strong className="text-slate-200">{ord.tyreCount} Items</strong></p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Total: ₹{ord.totalAmount.toLocaleString()}</span>
                    <span className={ord.paymentStatus === 'PAID' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      Payment: {ord.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 06 — INSPECTION & FITNESS CLASSIFICATION (MODULE 4) */}
        {/* ========================================================================= */}
        {mgmtScreen === 6 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">Module 4: Tyre Inspection & Fitness Classification</h2>
                <p className="text-xs text-slate-400">
                  Classify tyres: Fit – OK, EPR (Entire Party Risk), Partial Risk, or Unfit – Reject Return
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Tyre Serial & Make</th>
                    <th className="p-3">Size / Casing</th>
                    <th className="p-3">Current Location</th>
                    <th className="p-3">Fitness Classification</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tyres.slice(0, 10).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-850/60 transition">
                      <td className="p-3">
                        <strong className="text-white block">{t.id} • {t.serialNo}</strong>
                        <span className="text-[10px] text-slate-400">{t.brand} {t.colorField ? `(${t.colorField})` : ''}</span>
                      </td>
                      <td className="p-3 text-slate-300">
                        {t.size}
                        <span className="block text-[10px] text-slate-500">{t.casingCode}</span>
                      </td>
                      <td className="p-3 text-slate-400">{t.currentLocation}</td>
                      <td className="p-3">
                        <select
                          value={t.fitnessStatus}
                          onChange={(e) =>
                            updateTyreFitnessClassification(
                              t.id,
                              e.target.value as FitnessClassification,
                              'Classified via Web Inspection Module',
                              true
                            )
                          }
                          className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-[11px] font-semibold"
                        >
                          <option value="FIT_OK">Fit – OK</option>
                          <option value="EPR_ENTIRE_PARTY_RISK">EPR – Entire Party Risk</option>
                          <option value="PARTIAL_RISK">Partial Risk</option>
                          <option value="UNFIT_REJECT_RETURN">Unfit – Reject Return</option>
                          <option value="PENDING">Pending Queue</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.fitnessStatus === 'FIT_OK'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : t.fitnessStatus === 'UNFIT_REJECT_RETURN'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {t.fitnessStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedTyreId(t.id);
                            updateTyreFitnessClassification(t.id, 'FIT_OK', 'Physical check passed', true);
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-blue-400 px-2 py-1 rounded text-[10px] font-bold border border-slate-700"
                        >
                          Pass OK
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 18 — 7-STAGE PRODUCTION (MODULE 5) */}
        {/* ========================================================================= */}
        {mgmtScreen === 18 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">Module 5: 7-Stage Retread Production</h2>
                <p className="text-xs text-slate-400">Buffing • Rasping • Repair • Coating • Curing • PCI • PDI</p>
              </div>
            </div>

            {/* Production Advance Card */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" /> Advance Production Stage for Job {currentJob.id}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['BUFFING', 'RASPING', 'REPAIR', 'COATING', 'CURING', 'PCI', 'PDI'] as ProcessingStage[]).map((stg) => (
                  <button
                    key={stg}
                    onClick={() => setSelectedProdStage(stg)}
                    className={`p-2.5 rounded-xl font-bold text-xs transition border ${
                      selectedProdStage === stg
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {stg}
                  </button>
                ))}
              </div>

              {/* Material Usage Entry */}
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-xs">Material Usage Log (Auto Default System Date)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Radial Patch Size</label>
                    <input
                      type="text"
                      value={patchSize}
                      onChange={(e) => setPatchSize(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Patch Quantity</label>
                    <input
                      type="number"
                      value={patchQty}
                      onChange={(e) => setPatchQty(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Cushion Gum (Kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={cushionGumKg}
                      onChange={(e) => setCushionGumKg(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Tread Rubber (Kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={treadRubberKg}
                      onChange={(e) => setTreadRubberKg(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    Shift Incharge: <strong className="text-white">{shiftIncharge}</strong>
                  </span>
                  <button
                    onClick={handleAdvanceProduction}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <Check className="w-3.5 h-3.5" /> Save Materials & Advance to {selectedProdStage}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 19 — QUALITY CONTROL (QC & PDI CLEARANCE) */}
        {/* ========================================================================= */}
        {mgmtScreen === 19 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">Quality Control (QC & PCI Sign-off)</h2>
                <p className="text-xs text-slate-400">Post Cure Inflation (PCI) Pressure & PDI Clearance</p>
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Final Inspection Checklist for Job {currentJob.id}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                  <label className="text-[10px] text-slate-400 block font-medium">PCI Pressure (PSI)</label>
                  <input
                    type="number"
                    value={pciPressure}
                    onChange={(e) => setPciPressure(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white mt-1"
                  />
                </div>
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                  <label className="text-[10px] text-slate-400 block font-medium">Tread Width (mm)</label>
                  <input
                    type="number"
                    value={treadWidthMm}
                    onChange={(e) => setTreadWidthMm(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white mt-1"
                  />
                </div>
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                  <label className="text-[10px] text-slate-400 block font-medium">Inspector</label>
                  <input
                    type="text"
                    defaultValue="Suresh (QC Senior)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white mt-1"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block font-medium">QC Notes & Remarks</label>
                <textarea
                  rows={2}
                  value={qcNotes}
                  onChange={(e) => setQcNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white mt-1"
                />
              </div>

              <button
                onClick={handleQcSubmit}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle className="w-4 h-4" /> Approve QC & Clear for Finished Goods Dispatch
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 20 — ORDER STATUS TIMELINE (MODULE 6) */}
        {/* ========================================================================= */}
        {mgmtScreen === 20 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">Module 6: Order Status 10-Step Timeline</h2>
                <p className="text-xs text-slate-400">Real-time status updates from Order Received to Customer Delivery</p>
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">Order: {currentOrder.orderNo}</span>
                <span className="text-xs bg-blue-500/20 text-blue-300 font-bold px-2.5 py-0.5 rounded">
                  {currentOrder.status}
                </span>
              </div>

              <div className="space-y-3 relative pl-5 border-l-2 border-slate-700 ml-3">
                {currentOrder.timeline.map((st, idx) => (
                  <div key={idx} className="relative">
                    <div className="w-3 h-3 bg-blue-500 rounded-full absolute -left-[27px] top-1 ring-4 ring-slate-900" />
                    <div className="flex justify-between items-center text-xs">
                      <strong className="text-white">{st.status}</strong>
                      <span className="text-[10px] text-slate-400">{st.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{st.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 21 — COMPLAINT MANAGEMENT (MODULE 7) */}
        {/* ========================================================================= */}
        {mgmtScreen === 21 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">Module 7: Customer Complaint Management</h2>
                <p className="text-xs text-slate-400">SMS Confirmation, Technical Inspection, Acceptance/Rejection</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Complaints List */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-white text-sm">Active Complaints</h3>
                <div className="space-y-2">
                  {complaints.map((cmp) => (
                    <div
                      key={cmp.id}
                      onClick={() => setSelectedComplaintId(cmp.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition space-y-1 text-xs ${
                        selectedComplaintId === cmp.id
                          ? 'bg-slate-850 border-red-500'
                          : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span className="text-red-400">{cmp.id}</span>
                        <span className="text-slate-300">{cmp.category}</span>
                      </div>
                      <p className="text-slate-300">Customer: {cmp.customerName} (Tyre: {cmp.tyreSerialNo})</p>
                      <p className="text-[11px] text-slate-400">{cmp.description}</p>
                      <div className="flex justify-between items-center pt-1 text-[10px]">
                        <span className="text-emerald-400">SMS: Sent</span>
                        <span className="font-bold text-amber-400">Status: {cmp.resolutionStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Inspection & Resolution Card */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-white text-sm">Inspect & Resolve ({currentComplaint.id})</h3>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Technical Inspection Result</label>
                    <select
                      value={complaintResult}
                      onChange={(e) => setComplaintResult(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="ACCEPTED">ACCEPTED (Fault Verified)</option>
                      <option value="REJECTED">REJECTED (Operational Misuse)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Inspection Notes</label>
                    <textarea
                      rows={2}
                      value={complaintNotes}
                      onChange={(e) => setComplaintNotes(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Credit / Refund Amount (₹)</label>
                    <input
                      type="number"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <button
                    onClick={handleResolveComplaint}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-xl text-xs transition"
                  >
                    Submit Resolution & Issue Credit Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 22 — PAYMENTS & ACCOUNTS (MODULE 8) */}
        {/* ========================================================================= */}
        {mgmtScreen === 22 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">Module 8: Payments & Accounts Management</h2>
                <p className="text-xs text-slate-400">UPI, Cards, Razorpay Gateway & SAP B1 Financial Updates</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Payment Ref</th>
                    <th className="p-3">Order No</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Amount (₹)</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">SAP Status</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-850/60 transition">
                      <td className="p-3 font-mono font-bold text-blue-400">{p.id}</td>
                      <td className="p-3 text-slate-200">{p.orderNo}</td>
                      <td className="p-3 text-white font-semibold">{p.customerName}</td>
                      <td className="p-3 text-emerald-400 font-bold">₹{p.amount.toLocaleString()}</td>
                      <td className="p-3 text-slate-300">{p.paymentMethod}</td>
                      <td className="p-3">
                        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          ✓ Synced to SAP
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{new Date(p.timestamp).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 23 — REPORTS & OUTSTANDING (MODULE 9) */}
        {/* ========================================================================= */}
        {mgmtScreen === 23 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">Module 9: Reports & Outstanding Balances</h2>
                <p className="text-xs text-slate-400">Customer balances, credit limits, 2-Year business trend & Loyalty points</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customers.map((c) => (
                <div key={c.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <strong className="text-white text-sm">{c.name}</strong>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded">
                      {c.fleetOrDealerType}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Credit Limit:</span>
                      <span className="text-slate-200">₹{c.creditLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Outstanding Balance:</span>
                      <span className="text-red-400 font-bold">₹{c.outstandingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Loyalty Reward Points:</span>
                      <span className="text-amber-400 font-bold">{c.loyaltyPoints} Points</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 24 — SAP B1 MIDDLEWARE & JSON API PAYLOAD (MODULE 10) */}
        {/* ========================================================================= */}
        {mgmtScreen === 24 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">Module 10: SAP Business One Middleware Schema</h2>
                <p className="text-xs text-slate-400">
                  Live JSON exchange payloads matching SoftClinch technical specification
                </p>
              </div>
              <button
                onClick={() => triggerSapB1Sync(selectedOrderNo)}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-trigger Payload Dispatch
              </button>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
                <span>POST /api/v1/sap-b1/exchange-payload</span>
                <span className="text-emerald-400 font-bold">Status: 200 OK • Synced</span>
              </div>
              <pre className="text-emerald-300 bg-slate-950 p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                {JSON.stringify(sapExchangePayload, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 09 — MISMATCH CENTER & CASE MIS-0045 */}
        {/* ========================================================================= */}
        {mgmtScreen === 9 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">Mismatch Investigation Center</h2>
                <p className="text-xs text-slate-400">Chain of custody discrepancy: 20 Confirmed vs 18 Received</p>
              </div>
              <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 rounded-full font-bold">
                Case {currentCase.id}
              </span>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Customer Confirmed</span>
                  <strong className="text-xl font-bold text-white">{currentCase.expectedQty} Tyres</strong>
                </div>
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Gate Physical Scanned</span>
                  <strong className="text-xl font-bold text-emerald-400">{currentCase.receivedQty} Tyres</strong>
                </div>
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Missing In Transit</span>
                  <strong className="text-xl font-bold text-red-400">{currentCase.missingQty} Tyres ({currentCase.missingTyreIds.join(', ')})</strong>
                </div>
              </div>

              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-white">Gate Operator Evidence Remarks</h4>
                <p className="text-slate-300">{currentCase.remarks}</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 11 — INTERNAL TEAM CHAT */}
        {/* ========================================================================= */}
        {mgmtScreen === 11 && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-lg font-extrabold text-white">Internal Team Collaboration Chat</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3 h-96 overflow-y-auto">
              {caseMessages.map((m) => (
                <div key={m.id} className="bg-slate-850 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-blue-400">{m.senderName} ({m.senderRole})</span>
                    <span className="text-[10px] text-slate-500">{new Date(m.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-200">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                placeholder="Type internal message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 25 — AUDIT TRAIL SYSTEM */}
        {/* ========================================================================= */}
        {mgmtScreen === 25 && (
          <div className="space-y-6">
            <h2 className="text-lg font-extrabold text-white">Immutable Audit Trail System</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Actor / Role</th>
                    <th className="p-3">Job Card</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {auditLogs.slice(0, 15).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-850/60 transition">
                      <td className="p-3 text-slate-400 font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-3 font-semibold text-blue-400">{log.action}</td>
                      <td className="p-3 text-slate-300">
                        {log.userName} ({log.userRole})
                      </td>
                      <td className="p-3 text-slate-400">{log.jobCardId}</td>
                      <td className="p-3 text-slate-300">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
