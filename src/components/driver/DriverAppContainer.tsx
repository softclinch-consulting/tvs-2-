import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  QrCode,
  Camera,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Truck,
  User,
  Phone,
  RefreshCw,
  FileText,
  Lock,
  X,
  MapPin,
  Calendar,
  CheckCircle2,
  Building2,
  Check,
  Factory,
  CreditCard,
  MessageSquare,
  DollarSign,
  Palette,
  Layers,
  Send
} from 'lucide-react';

export const DriverAppContainer: React.FC = () => {
  const {
    driverScreen,
    setDriverScreen,
    jobCards,
    tyres,
    customers,
    retreadOrders,
    complaints,
    payments,
    createCustomer,
    placeRetreadOrder,
    createJobCard,
    registerDriverTyre,
    sendCustomerOtp,
    verifyCustomerOtp,
    startTransport,
    handoverToGate,
    submitComplaint,
    processPayment,
    selectedJobCardId,
    setSelectedJobCardId,
    selectedOrderNo,
    setSelectedOrderNo,
    setSelectedCaseId,
    setActiveApp,
    setMgmtScreen
  } = useApp();

  // Sub-app tab inside Flutter Mobile App
  const [mobileRoleView, setMobileRoleView] = useState<'SALES' | 'DRIVER' | 'CUSTOMER'>('SALES');
  const [salesSubTab, setSalesSubTab] = useState<'CUSTOMERS' | 'NEW_ORDER' | 'ORDERS' | 'TARGETS' | 'PROFILE'>('CUSTOMERS');
  const [custSubTab, setCustSubTab] = useState<'TIMELINE' | 'COMPLAINTS' | 'PAYMENTS' | 'REWARDS' | 'PROFILE'>('TIMELINE');

  // Sales Employee form states
  const [custFormName, setCustFormName] = useState('');
  const [custFormAddress, setCustFormAddress] = useState('');
  const [custFormPan, setCustFormPan] = useState('');
  const [custFormGst, setCustFormGst] = useState('');
  const [custFormMobile, setCustFormMobile] = useState('');
  const [custFormType, setCustFormType] = useState<'Fleet Operator' | 'Dealer' | 'Direct Customer'>('Fleet Operator');
  const [customerSuccessMsg, setCustomerSuccessMsg] = useState('');

  // Order Placement Form states
  const [orderBranch, setOrderBranch] = useState('Chennai - Ashok Nagar');
  const [orderCustId, setOrderCustId] = useState('CUST-001');
  const [orderType, setOrderType] = useState<'RETREAD' | 'REPAIR' | 'BOTH'>('RETREAD');
  const [orderVehicleNo, setOrderVehicleNo] = useState('TN38 AB 1234');
  const [orderTyreList, setOrderTyreList] = useState<Array<{ serialNo: string; make: string; size: string; colorField?: string; dot?: string; casingCode?: string; condition: 'Retreadable' | 'Repair Needed' | 'Casing OK' | 'Damaged' }>>([
    { serialNo: '1020', make: 'TVS', size: '11.00-20', dot: 'DOT 4B 2025', casingCode: 'CSG-TVS-8801', condition: 'Retreadable' },
    { serialNo: 'TVS9921', make: 'MC', size: '10.00-20', colorField: 'Yellow Stripe', dot: 'DOT 4B 2024', casingCode: 'CSG-TVS-8802', condition: 'Repair Needed' }
  ]);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState('');

  // Driver App Form states
  const [customerName, setCustomerName] = useState('ABC Transport (RAJA)');
  const [vehicleNo, setVehicleNo] = useState('TN38 AB 1234');
  const [pickupLoc, setPickupLoc] = useState('Chennai Central Depot, Bay 4');
  const [scannedSerial, setScannedSerial] = useState('ABC123456719');
  const [selectedMake, setSelectedMake] = useState('TVS');
  const [selectedBrand, setSelectedBrand] = useState('TVS TREAD');
  const [selectedSize, setSelectedSize] = useState('10.00-20');
  const [selectedColor, setSelectedColor] = useState('Red Stripe');
  const [selectedType, setSelectedType] = useState<'Radial' | 'Bias'>('Radial');
  const [selectedCondition, setSelectedCondition] = useState<'Retreadable' | 'Repair Needed' | 'Casing OK' | 'Damaged'>('Casing OK');
  const [photoProgress, setPhotoProgress] = useState(4);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState(false);

  // Customer Mobile View states
  const [complaintCategory, setComplaintCategory] = useState<'Tread Separation' | 'Casing Crack' | 'Premature Wear' | 'Missing Item' | 'Billing Dispute'>('Missing Item');
  const [complaintSerial, setComplaintSerial] = useState('ABC123456719');
  const [complaintDesc, setComplaintDesc] = useState('Tyre handed over at pickup depot but not scanned at factory gate unloading.');
  const [complaintSuccessMsg, setComplaintSuccessMsg] = useState('');
  const [payAmountInput, setPayAmountInput] = useState(44000);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  const currentJob = jobCards.find((j) => j.id === selectedJobCardId) || jobCards[0];
  const currentTyres = tyres.filter((t) => t.jobCardId === currentJob.id);
  const currentOrder = retreadOrders.find((o) => o.orderNo === selectedOrderNo) || retreadOrders[0];

  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custFormName || !custFormMobile) return;
    const created = createCustomer({
      name: custFormName,
      address: custFormAddress || 'Industrial Area, Chennai',
      pan: custFormPan || 'AABCT9981K',
      gst: custFormGst || '33AABCT9981K1Z3',
      mobileNo: custFormMobile,
      fleetOrDealerType: custFormType
    });
    setCustomerSuccessMsg(`✓ Customer ${created.name} created & synced to SAP B1!`);
    setCustFormName('');
    setCustFormMobile('');
    setCustFormPan('');
    setCustFormGst('');
    setCustFormAddress('');
  };

  const handleAddTyreToOrderDraft = () => {
    setOrderTyreList((prev) => [
      ...prev,
      {
        serialNo: `TVS${Math.floor(1000 + Math.random() * 9000)}`,
        make: 'TVS',
        size: '10.00-20',
        dot: 'DOT 4B 2025',
        casingCode: `CSG-TVS-${8900 + prev.length}`,
        condition: 'Retreadable'
      }
    ]);
  };

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNo = placeRetreadOrder({
      branch: orderBranch,
      customerId: orderCustId,
      orderType,
      vehicleNo: orderVehicleNo,
      tyres: orderTyreList
    });
    setOrderSuccessMsg(`✓ Order ${orderNo} placed successfully! Auto Job Card generated.`);
  };

  const handleCreateJob = () => {
    const id = createJobCard({
      customerName,
      vehicleNo,
      vehicleModel: 'Ashok Leyland 2820',
      pickupLocation: pickupLoc,
      driverName: 'Kumar (Sales/Driver)'
    });
    setDriverScreen(9);
  };

  const handleRegisterSingleTyre = () => {
    registerDriverTyre(currentJob.id, {
      serialNo: scannedSerial,
      brand: selectedBrand,
      make: selectedMake,
      size: selectedSize,
      colorField: selectedMake === 'MC' ? selectedColor : undefined,
      type: selectedType,
      condition: selectedCondition
    });
    setDriverScreen(15);
  };

  const handleSendOtpAndNext = () => {
    sendCustomerOtp(currentJob.id);
    setDriverScreen(18);
  };

  const handleVerifyOtp = () => {
    const success = verifyCustomerOtp(currentJob.id, otpInput || '849201');
    if (success) {
      setOtpError(false);
      setDriverScreen(19);
    } else {
      setOtpError(true);
    }
  };

  const handleCustomerComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmpId = submitComplaint({
      orderNo: currentOrder.orderNo,
      jobCardId: currentJob.id,
      customerName: currentOrder.customerName,
      mobileNo: currentOrder.mobileNo,
      tyreSerialNo: complaintSerial,
      category: complaintCategory,
      description: complaintDesc
    });
    setComplaintSuccessMsg(`✓ Complaint ${cmpId} logged! SMS dispatched to ${currentOrder.mobileNo}.`);
  };

  const handleCustomerPaySubmit = (method: 'UPI' | 'CREDIT_CARD' | 'RAZORPAY_GATEWAY') => {
    const p = processPayment(currentOrder.orderNo, payAmountInput, method);
    setPaymentSuccessMsg(`✓ Payment of ₹${p.amount.toLocaleString()} processed via ${method}. SAP Synced!`);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)] bg-slate-950 p-2 sm:p-6">
      {/* Flutter Mobile Device Mockup Frame */}
      <div className="w-full max-w-[440px] bg-slate-900 border-4 sm:border-8 border-slate-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col h-[800px] relative font-sans text-slate-100">
        
        {/* Phone Top Notch / Status Bar */}
        <div className="bg-slate-950 px-6 py-2 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 shrink-0">
          <span className="font-semibold text-slate-300">09:41</span>
          <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-blue-400">Flutter Engine</span>
            <div className="w-3.5 h-2 border border-slate-400 rounded-sm p-0.5 flex">
              <div className="w-full h-full bg-emerald-400 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Mobile Sub-Role Selector Bar */}
        <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setMobileRoleView('SALES')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                mobileRoleView === 'SALES' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sales Exec
            </button>
            <button
              onClick={() => setMobileRoleView('DRIVER')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                mobileRoleView === 'DRIVER' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Driver (24 Screens)
            </button>
            <button
              onClick={() => setMobileRoleView('CUSTOMER')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                mobileRoleView === 'CUSTOMER' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer App
            </button>
          </div>

          {mobileRoleView === 'DRIVER' && (
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Screen:</span>
              <select
                value={driverScreen}
                onChange={(e) => setDriverScreen(Number(e.target.value))}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-1 py-0.5 text-[9px]"
              >
                <option value={1}>01. Splash</option>
                <option value={2}>02. Login</option>
                <option value={3}>03. OTP Login</option>
                <option value={4}>04. Dashboard</option>
                <option value={5}>05. My Pickups</option>
                <option value={6}>06. Create Pickup</option>
                <option value={7}>07. Customer Selection</option>
                <option value={8}>08. Vehicle Selection</option>
                <option value={9}>09. Job Card Created</option>
                <option value={10}>10. Tyre Registration</option>
                <option value={11}>11. Scan Tyre</option>
                <option value={12}>12. Tyre Details</option>
                <option value={13}>13. Tyre Photo</option>
                <option value={14}>14. Tyre Check</option>
                <option value={15}>15. Tyre Completed</option>
                <option value={16}>16. Registration Progress</option>
                <option value={17}>17. Pickup Summary</option>
                <option value={18}>18. Customer OTP Waiting</option>
                <option value={19}>19. Pickup Confirmed</option>
                <option value={20}>20. Active Transport</option>
                <option value={21}>21. Delivery to Gate</option>
                <option value={22}>22. Driver Alerts</option>
                <option value={23}>23. Job History</option>
                <option value={24}>24. Driver Profile</option>
              </select>
            </div>
          )}
        </div>

        {/* SCREEN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-slate-900 text-xs">

          {/* ========================================================================= */}
          {/* 1. SALES EMPLOYEE VIEW (MODULE 2 & 3: CUSTOMER & ORDER PLACEMENT) */}
          {/* ========================================================================= */}
          {mobileRoleView === 'SALES' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 p-3 rounded-2xl border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">TVS Sales Mobile App</h3>
                    <p className="text-[11px] text-blue-200">Customer Onboarding & Order Placement</p>
                  </div>
                  <span className="text-[10px] bg-blue-500 text-white font-bold px-2 py-0.5 rounded-full">
                    SAP B1 Sync
                  </span>
                </div>
              </div>

              {/* Sub-tab 1: CUSTOMERS */}
              {salesSubTab === 'CUSTOMERS' && (
                <div className="space-y-4">
                  <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-400" /> Module 2: New Customer Onboarding
                      </h4>
                      <span className="text-[10px] text-emerald-400 font-semibold">Direct SAP Sync</span>
                    </div>

                    {customerSuccessMsg && (
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px]">
                        {customerSuccessMsg}
                      </div>
                    )}

                    <form onSubmit={handleCreateCustomerSubmit} className="space-y-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">Customer / Fleet Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Sri Murugan Transports"
                          value={custFormName}
                          onChange={(e) => setCustFormName(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block font-medium">PAN Number *</label>
                          <input
                            type="text"
                            placeholder="e.g. AABCS1234D"
                            value={custFormPan}
                            onChange={(e) => setCustFormPan(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block font-medium">GST Number *</label>
                          <input
                            type="text"
                            placeholder="e.g. 33AABCS1234D1Z2"
                            value={custFormGst}
                            onChange={(e) => setCustFormGst(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block font-medium">Mobile Number *</label>
                          <input
                            type="text"
                            placeholder="e.g. 9840123456"
                            value={custFormMobile}
                            onChange={(e) => setCustFormMobile(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block font-medium">Customer Type</label>
                          <select
                            value={custFormType}
                            onChange={(e) => setCustFormType(e.target.value as any)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="Fleet Operator">Fleet Operator</option>
                            <option value="Dealer">Dealer</option>
                            <option value="Direct Customer">Direct Customer</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">Full Address</label>
                        <input
                          type="text"
                          placeholder="Depot address, city & pincode"
                          value={custFormAddress}
                          onChange={(e) => setCustFormAddress(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs transition shadow-md shadow-blue-600/20"
                      >
                        Save Customer & Sync to SAP B1
                      </button>
                    </form>
                  </div>

                  {/* Customer Accounts Summary List */}
                  <div className="bg-slate-850 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-xs">Customer Master ({customers.length} Accounts)</h4>
                    <div className="space-y-1.5">
                      {customers.map((c) => (
                        <div key={c.id} className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-[11px]">
                          <div>
                            <strong className="text-white block">{c.name}</strong>
                            <span className="text-[9px] text-slate-400">{c.fleetOrDealerType} • {c.mobileNo}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-400 font-bold block">Limit: ₹{c.creditLimit.toLocaleString()}</span>
                            <span className="text-[9px] text-slate-400">Due: ₹{c.outstandingAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: NEW_ORDER */}
              {salesSubTab === 'NEW_ORDER' && (
                <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-indigo-400" /> Module 3: Retread Order Placement
                    </h4>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded">
                      Branch Series
                    </span>
                  </div>

                  {orderSuccessMsg && (
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px]">
                      {orderSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handlePlaceOrderSubmit} className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">Branch Series</label>
                        <select
                          value={orderBranch}
                          onChange={(e) => setOrderBranch(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                        >
                          <option value="Chennai - Ashok Nagar">Chennai (TVS-CHN)</option>
                          <option value="Madurai">Madurai (TVS-MDU)</option>
                          <option value="Coimbatore">Coimbatore (TVS-CBE)</option>
                          <option value="Salem">Salem (TVS-SLM)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">Customer</label>
                        <select
                          value={orderCustId}
                          onChange={(e) => setOrderCustId(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                        >
                          {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">Order Type</label>
                        <select
                          value={orderType}
                          onChange={(e) => setOrderType(e.target.value as any)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                        >
                          <option value="RETREAD">Retreading</option>
                          <option value="REPAIR">Major Repair</option>
                          <option value="BOTH">Retread + Repair</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">Vehicle No</label>
                        <input
                          type="text"
                          value={orderVehicleNo}
                          onChange={(e) => setOrderVehicleNo(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Tyre Specs List */}
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-300">
                        <span className="font-bold">Tyre Items ({orderTyreList.length})</span>
                        <button
                          type="button"
                          onClick={handleAddTyreToOrderDraft}
                          className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" /> Add Tyre
                        </button>
                      </div>

                      {orderTyreList.map((t, idx) => (
                        <div key={idx} className="bg-slate-850 p-2 rounded-lg border border-slate-800 space-y-1 text-[11px]">
                          <div className="flex justify-between items-center font-semibold">
                            <span className="text-blue-300">#{idx + 1} Serial: {t.serialNo}</span>
                            <span className="text-slate-400">{t.make} • {t.size}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                            <span>DOT: {t.dot}</span>
                            <span>Casing: {t.casingCode}</span>
                          </div>
                          {t.make === 'MC' && (
                            <div className="text-[10px] text-amber-400 flex items-center gap-1">
                              <Palette className="w-3 h-3" /> Color Field: {t.colorField || 'Red Stripe'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                    >
                      <CheckCircle className="w-4 h-4" /> Submit Order & Auto-Gen Job Card
                    </button>
                  </form>
                </div>
              )}

              {/* Sub-tab 3: ORDERS */}
              {salesSubTab === 'ORDERS' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-xs">Active Retread Orders ({retreadOrders.length})</h4>
                  <div className="space-y-2">
                    {retreadOrders.map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => {
                          setSelectedOrderNo(ord.orderNo);
                          const j = jobCards.find((jc) => jc.orderNo === ord.orderNo);
                          if (j) setSelectedJobCardId(j.id);
                        }}
                        className={`p-3 rounded-xl border transition cursor-pointer space-y-1.5 ${
                          selectedOrderNo === ord.orderNo ? 'bg-slate-850 border-blue-500' : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-blue-400 font-mono">{ord.orderNo}</span>
                          <span className="text-[9px] bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 rounded">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-white font-medium">{ord.customerName} ({ord.tyreCount} Tyres)</p>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                          <span>Branch: {ord.branch}</span>
                          <span className="text-emerald-400 font-bold">₹{ord.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 4: TARGETS */}
              {salesSubTab === 'TARGETS' && (
                <div className="space-y-3">
                  <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm">Monthly Sales Target (Ashok Nagar)</h4>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Achieved: ₹18,50,000</span>
                        <span className="text-blue-400 font-bold">Target: ₹25,00,000 (74%)</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '74%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Retreads Booked</span>
                        <strong className="text-white text-sm">184 Tyres</strong>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Active Fleets</span>
                        <strong className="text-emerald-400 text-sm">14 Fleets</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 5: PROFILE */}
              {salesSubTab === 'PROFILE' && (
                <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xl mx-auto shadow-lg shadow-blue-600/30">
                    MS
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">M. Selvam</h3>
                    <p className="text-xs text-blue-400">Senior Sales Executive (SE-CHN-402)</p>
                    <p className="text-[11px] text-slate-400">Ashok Nagar Branch • Sundaram Industries</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-left text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Mobile:</span>
                      <strong className="text-white">98401 23456</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Zone:</span>
                      <strong className="text-white">Chennai South</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. DRIVER LOGISTICS FLOW (24 SCREENS) */}
          {/* ========================================================================= */}
          {mobileRoleView === 'DRIVER' && (
            <div className="space-y-4">
              {/* SCREEN 04 — DASHBOARD */}
              {driverScreen === 4 && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-900/60 to-slate-800 p-3.5 rounded-2xl border border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-blue-300 uppercase font-semibold">Driver On Duty</span>
                        <h3 className="text-base font-bold text-white">Kumar (DRV-101)</h3>
                        <p className="text-[11px] text-slate-400">Vehicle: TN38 AB 1234 • Ashok Leyland</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        K
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400">Today's Pickups</span>
                      <p className="text-xl font-bold text-white mt-1">1 Scheduled</p>
                    </div>
                    <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400">Tyres Expected</span>
                      <p className="text-xl font-bold text-blue-400 mt-1">20 Tyres</p>
                    </div>
                  </div>

                  <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white">Active Assigned Pickup</h4>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                        Ready
                      </span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>ABC Transport (RAJA)</span>
                        <span className="text-blue-400">20 Tyres</span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> Chennai Central Depot, Bay 4
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-slate-500" /> Vehicle: TN38 AB 1234
                      </p>
                    </div>

                    <button
                      onClick={() => setDriverScreen(6)}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2"
                    >
                      Start Pickup & Create Job Card <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 06 — CREATE PICKUP */}
              {driverScreen === 6 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setDriverScreen(4)} className="p-1 rounded-lg bg-slate-800 text-slate-300">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h3 className="font-bold text-white text-sm">Create Pickup Job Card</h3>
                  </div>

                  <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block font-medium">Customer Name</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-medium">Vehicle Registration No</label>
                      <input
                        type="text"
                        value={vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-medium">Pickup Depot Location</label>
                      <input
                        type="text"
                        value={pickupLoc}
                        onChange={(e) => setPickupLoc(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <button
                      onClick={handleCreateJob}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition text-xs"
                    >
                      Generate Job Card & Tag Tyres
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 09 — JOB CARD CREATED */}
              {driverScreen === 9 && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">Success</span>
                    <h3 className="text-base font-bold text-white">Job Card {currentJob.id}</h3>
                    <p className="text-xs text-slate-400 mt-1">Ready for individual tyre barcode tagging</p>
                  </div>

                  <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 text-left space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customer:</span>
                      <strong className="text-white">{currentJob.customerName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vehicle:</span>
                      <span className="text-slate-200">{currentJob.vehicleNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Registered Count:</span>
                      <span className="text-blue-400 font-bold">{currentTyres.length} Tyres</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setDriverScreen(10)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" /> Start Scanning Tyres (4 Photos)
                  </button>
                </div>
              )}

              {/* SCREEN 10 / 11 / 12 — TYRE DETAILS & REGISTRATION */}
              {(driverScreen === 10 || driverScreen === 11 || driverScreen === 12) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setDriverScreen(9)} className="p-1 rounded-lg bg-slate-800 text-slate-300">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h3 className="font-bold text-white text-sm">Register Tyre ({currentTyres.length + 1})</h3>
                  </div>

                  <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block font-medium">Scanned Barcode / Serial No</label>
                      <div className="flex gap-1.5 mt-1">
                        <input
                          type="text"
                          value={scannedSerial}
                          onChange={(e) => setScannedSerial(e.target.value)}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                        />
                        <button
                          onClick={() => setScannedSerial(`TVS${Math.floor(1000 + Math.random() * 9000)}`)}
                          className="bg-slate-800 hover:bg-slate-700 px-2 rounded-lg border border-slate-700 text-[10px]"
                        >
                          Scan Barcode
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">Make</label>
                        <select
                          value={selectedMake}
                          onChange={(e) => {
                            setSelectedMake(e.target.value);
                            if (e.target.value === 'TVS') setSelectedBrand('TVS TREAD');
                            else setSelectedBrand(e.target.value);
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                        >
                          <option value="TVS">TVS TREAD</option>
                          <option value="MC">MC Line</option>
                          <option value="MRF">MRF Tyres</option>
                          <option value="Apollo">Apollo Tyres</option>
                          <option value="CEAT">CEAT</option>
                          <option value="Bridgestone">Bridgestone</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">Size</label>
                        <select
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                        >
                          <option value="10.00-20">10.00-20</option>
                          <option value="11.00-20">11.00-20</option>
                          <option value="295/80 R22.5">295/80 R22.5</option>
                        </select>
                      </div>
                    </div>

                    {selectedMake === 'MC' && (
                      <div className="bg-slate-900 p-2 rounded-xl border border-amber-500/30">
                        <label className="text-[10px] text-amber-400 block font-bold">MC Color Field Identification</label>
                        <select
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white mt-1"
                        >
                          <option value="Red Stripe">Red Stripe</option>
                          <option value="Blue Stripe">Blue Stripe</option>
                          <option value="Yellow Stripe">Yellow Stripe</option>
                        </select>
                      </div>
                    )}

                    {/* 4 Mandatory Photos Progress */}
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-300">Mandatory 4 Photos</span>
                        <span className="text-emerald-400 font-bold">{photoProgress}/4 Uploaded</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['Full', 'Serial', 'Sidewall', 'Damage'].map((lbl, idx) => (
                          <div
                            key={lbl}
                            className="bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-center text-[9px] text-slate-300 flex flex-col items-center gap-1"
                          >
                            <Camera className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{lbl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleRegisterSingleTyre}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Save Tyre & Tag Next
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 15 / 16 — REGISTRATION PROGRESS */}
              {(driverScreen === 15 || driverScreen === 16 || driverScreen === 17) && (
                <div className="space-y-4">
                  <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white">Pickup Progress Summary</h4>
                        <p className="text-[11px] text-slate-400">Job Card: {currentJob.id}</p>
                      </div>
                      <span className="text-base font-extrabold text-emerald-400">
                        {currentTyres.length} / 20
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${Math.min(100, (currentTyres.length / 20) * 100)}%` }}
                      />
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {currentTyres.slice(0, 6).map((t, idx) => (
                        <div key={t.id} className="flex justify-between items-center bg-slate-900 p-2 rounded-lg text-[11px]">
                          <div>
                            <span className="font-bold text-slate-200">{t.id} • {t.serialNo}</span>
                            <span className="text-slate-400 block text-[10px]">{t.brand} {t.size}</span>
                          </div>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                            Tagged
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => setDriverScreen(10)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs transition"
                      >
                        + Add Another Tyre
                      </button>
                      <button
                        onClick={handleSendOtpAndNext}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                      >
                        Send Inaiwazhi OTP to Customer <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 18 — CUSTOMER OTP WAITING */}
              {driverScreen === 18 && (
                <div className="space-y-4 py-2">
                  <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-400">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Awaiting Customer OTP</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Inaiwazhi OTP dispatched via WhatsApp to {currentJob.customerName}
                      </p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-left space-y-1">
                      <span className="text-[10px] text-slate-400 block font-medium">Enter Customer Provided OTP:</span>
                      <input
                        type="text"
                        placeholder="e.g. 849201"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-center text-sm font-mono font-bold text-white tracking-widest"
                      />
                      {otpError && (
                        <span className="text-[10px] text-red-400 block mt-1">Invalid OTP code. Try 849201</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleVerifyOtp}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
                      >
                        Verify OTP & Lock 20 Tyres
                      </button>
                      <button
                        onClick={() => setActiveApp('whatsapp')}
                        className="bg-slate-800 hover:bg-slate-700 px-3 rounded-xl text-[10px] text-emerald-400 border border-slate-700"
                      >
                        View WA
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 19 / 20 / 21 — ACTIVE TRANSPORT & GATE HANDOVER */}
              {(driverScreen === 19 || driverScreen === 20 || driverScreen === 21) && (
                <div className="space-y-4">
                  <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                        Pickup Locked & Verified
                      </span>
                      <span className="text-xs font-bold text-white">{currentJob.confirmedQty || 20} Confirmed</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <p className="font-bold text-white">Truck TN38 AB 1234 In Transit</p>
                      <p className="text-[11px] text-slate-400">Route: Chennai Central Depot → TVS Factory Receiving Bay 2</p>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          startTransport(currentJob.id);
                          setDriverScreen(20);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2"
                      >
                        <Truck className="w-4 h-4" /> Start In-Transit Journey
                      </button>
                      <button
                        onClick={() => {
                          handoverToGate(currentJob.id);
                          setActiveApp('gate');
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2"
                      >
                        <Factory className="w-4 h-4" /> Arrive at Gate & Handover
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 24 — DRIVER PROFILE */}
              {driverScreen === 24 && (
                <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xl mx-auto shadow-lg shadow-indigo-600/30">
                    K
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Kumar</h3>
                    <p className="text-xs text-indigo-400">Driver & Logistics Operator (DRV-101)</p>
                    <p className="text-[11px] text-slate-400">Vehicle: TN38 AB 1234 • Ashok Leyland 2820</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-left text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">License:</span>
                      <strong className="text-white">DL-TN38-2018-099</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Today Pickups:</span>
                      <strong className="text-emerald-400">1 Completed</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* OTHER SCREENS FALLBACK */}
              {![4, 6, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21, 24].includes(driverScreen) && (
                <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                  <h4 className="font-bold text-white text-base">Screen {driverScreen.toString().padStart(2, '0')}</h4>
                  <p className="text-xs text-slate-400">Flutter Driver Lifecycle View</p>
                  <button
                    onClick={() => setDriverScreen(4)}
                    className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    Back to Driver Dashboard
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. CUSTOMER MOBILE VIEW (ORDER TIMELINE, COMPLAINTS & PAYMENTS) */}
          {/* ========================================================================= */}
          {mobileRoleView === 'CUSTOMER' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-900/60 to-slate-800 p-3.5 rounded-2xl border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-300 uppercase font-semibold">Customer Portal</span>
                    <h3 className="text-base font-bold text-white">RAJA (ABC Transport)</h3>
                    <p className="text-[11px] text-slate-400">Active Order: {currentOrder.orderNo}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                    R
                  </div>
                </div>
              </div>

              {/* Sub-tab 1: TIMELINE */}
              {custSubTab === 'TIMELINE' && (
                <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" /> Module 6: 10-Step Order Status Timeline
                  </h4>

                  <div className="space-y-2 relative pl-4 border-l-2 border-slate-700 ml-2">
                    {currentOrder.timeline.map((st, idx) => (
                      <div key={idx} className="relative">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full absolute -left-[21px] top-1 ring-4 ring-slate-900" />
                        <div className="flex justify-between items-center text-[11px]">
                          <strong className="text-white">{st.status}</strong>
                          <span className="text-[9px] text-slate-400">{st.timestamp}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{st.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 2: COMPLAINTS */}
              {custSubTab === 'COMPLAINTS' && (
                <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Module 7: Register Complaint
                    </h4>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                      Instant SMS
                    </span>
                  </div>

                  {complaintSuccessMsg && (
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px]">
                      {complaintSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleCustomerComplaintSubmit} className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">Tyre Serial</label>
                        <input
                          type="text"
                          value={complaintSerial}
                          onChange={(e) => setComplaintSerial(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">Issue Category</label>
                        <select
                          value={complaintCategory}
                          onChange={(e) => setComplaintCategory(e.target.value as any)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                        >
                          <option value="Missing Item">Missing Item</option>
                          <option value="Tread Separation">Tread Separation</option>
                          <option value="Casing Crack">Casing Crack</option>
                          <option value="Premature Wear">Premature Wear</option>
                          <option value="Billing Dispute">Billing Dispute</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-medium">Complaint Remarks</label>
                      <textarea
                        rows={2}
                        value={complaintDesc}
                        onChange={(e) => setComplaintDesc(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Complaint (SMS Trigger)
                    </button>
                  </form>
                </div>
              )}

              {/* Sub-tab 3: PAYMENTS */}
              {custSubTab === 'PAYMENTS' && (
                <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Module 8: Online Payment
                    </h4>
                    <span className="text-[10px] text-slate-400">Order: {currentOrder.orderNo}</span>
                  </div>

                  {paymentSuccessMsg && (
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px]">
                      {paymentSuccessMsg}
                    </div>
                  )}

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Outstanding Amount</span>
                      <strong className="text-sm font-bold text-white">₹{currentOrder.totalAmount.toLocaleString()}</strong>
                    </div>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded">
                      Paid: ₹{currentOrder.paidAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCustomerPaySubmit('UPI')}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-[11px] border border-slate-700 transition"
                    >
                      Pay via UPI (GPay/PhonePe)
                    </button>
                    <button
                      onClick={() => handleCustomerPaySubmit('RAZORPAY_GATEWAY')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-[11px] transition shadow-md shadow-emerald-600/20"
                    >
                      Razorpay Gateway
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-tab 4: REWARDS */}
              {custSubTab === 'REWARDS' && (
                <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto font-bold text-lg">
                    ★
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">TVS Tread Loyalty Club</h4>
                    <p className="text-2xl font-black text-amber-400 mt-1">2,450 Points</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">₹100 Spent = 1 Reward Point</p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                    Redeemable for ₹2,450 discount on your next retreading batch.
                  </div>
                </div>
              )}

              {/* Sub-tab 5: PROFILE */}
              {custSubTab === 'PROFILE' && (
                <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xl mx-auto shadow-lg shadow-emerald-600/30">
                    R
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">RAJA</h3>
                    <p className="text-xs text-emerald-400">Fleet Owner • ABC Transport</p>
                    <p className="text-[11px] text-slate-400">Chennai Central Depot • 24 Heavy Commercial Trucks</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-left text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">GST:</span>
                      <strong className="text-white font-mono text-[10px]">33AABCS1234D1Z2</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Credit Terms:</span>
                      <strong className="text-emerald-400">30 Days Credit</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* MOBILE BOTTOM NAVIGATION BAR (SALES / DRIVER / CUSTOMER) */}
        {/* ========================================================================= */}
        <div className="bg-slate-950 border-t border-slate-800 px-3 py-2 flex justify-between items-center text-[10px] text-slate-400 shrink-0">
          {mobileRoleView === 'SALES' && (
            <>
              <button
                onClick={() => setSalesSubTab('CUSTOMERS')}
                className={`flex flex-col items-center gap-0.5 transition ${salesSubTab === 'CUSTOMERS' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <User className="w-4 h-4" />
                <span>CUSTOMERS</span>
              </button>
              <button
                onClick={() => setSalesSubTab('NEW_ORDER')}
                className={`flex flex-col items-center gap-0.5 transition ${salesSubTab === 'NEW_ORDER' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <Plus className="w-4 h-4" />
                <span>NEW ORDER</span>
              </button>
              <button
                onClick={() => setSalesSubTab('ORDERS')}
                className={`flex flex-col items-center gap-0.5 transition ${salesSubTab === 'ORDERS' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <FileText className="w-4 h-4" />
                <span>ORDERS</span>
              </button>
              <button
                onClick={() => setSalesSubTab('TARGETS')}
                className={`flex flex-col items-center gap-0.5 transition ${salesSubTab === 'TARGETS' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>TARGETS</span>
              </button>
              <button
                onClick={() => setSalesSubTab('PROFILE')}
                className={`flex flex-col items-center gap-0.5 transition ${salesSubTab === 'PROFILE' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <User className="w-4 h-4" />
                <span>PROFILE</span>
              </button>
            </>
          )}

          {mobileRoleView === 'DRIVER' && (
            <>
              <button
                onClick={() => setDriverScreen(4)}
                className={`flex flex-col items-center gap-0.5 transition ${driverScreen === 4 ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <Smartphone className="w-4 h-4" />
                <span>HOME</span>
              </button>
              <button
                onClick={() => setDriverScreen(6)}
                className={`flex flex-col items-center gap-0.5 transition ${driverScreen === 6 || driverScreen === 9 ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <FileText className="w-4 h-4" />
                <span>PICKUPS</span>
              </button>
              <button
                onClick={() => setDriverScreen(10)}
                className={`flex flex-col items-center gap-0.5 transition ${[10, 11, 12, 13, 14, 15, 16, 17].includes(driverScreen) ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <QrCode className="w-4 h-4" />
                <span>SCANNER</span>
              </button>
              <button
                onClick={() => setDriverScreen(20)}
                className={`flex flex-col items-center gap-0.5 transition ${[18, 19, 20, 21].includes(driverScreen) ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <Truck className="w-4 h-4" />
                <span>GATE DROP</span>
              </button>
              <button
                onClick={() => setDriverScreen(24)}
                className={`flex flex-col items-center gap-0.5 transition ${driverScreen === 24 ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <User className="w-4 h-4" />
                <span>PROFILE</span>
              </button>
            </>
          )}

          {mobileRoleView === 'CUSTOMER' && (
            <>
              <button
                onClick={() => setCustSubTab('TIMELINE')}
                className={`flex flex-col items-center gap-0.5 transition ${custSubTab === 'TIMELINE' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <Clock className="w-4 h-4" />
                <span>TIMELINE</span>
              </button>
              <button
                onClick={() => setCustSubTab('COMPLAINTS')}
                className={`flex flex-col items-center gap-0.5 transition ${custSubTab === 'COMPLAINTS' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>COMPLAINTS</span>
              </button>
              <button
                onClick={() => setCustSubTab('PAYMENTS')}
                className={`flex flex-col items-center gap-0.5 transition ${custSubTab === 'PAYMENTS' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <CreditCard className="w-4 h-4" />
                <span>PAYMENTS</span>
              </button>
              <button
                onClick={() => setCustSubTab('REWARDS')}
                className={`flex flex-col items-center gap-0.5 transition ${custSubTab === 'REWARDS' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>REWARDS</span>
              </button>
              <button
                onClick={() => setCustSubTab('PROFILE')}
                className={`flex flex-col items-center gap-0.5 transition ${custSubTab === 'PROFILE' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'}`}
              >
                <User className="w-4 h-4" />
                <span>PROFILE</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
