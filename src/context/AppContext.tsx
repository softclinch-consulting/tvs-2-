import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  JobCard,
  Tyre,
  MismatchCase,
  AuditLog,
  InternalMessage,
  WhatsAppMessage,
  TyreCompany,
  UserProfile,
  CustomerProfile,
  RetreadOrder,
  Complaint,
  PaymentTransaction,
  SapB1ExchangePayload,
  UserRole,
  FitnessClassification,
  ProcessingStage,
  MaterialUsage,
  QCApprovalRecord
} from '../types';
import {
  INITIAL_JOB_CARDS,
  INITIAL_TYRES,
  INITIAL_MISMATCH_CASES,
  INITIAL_AUDIT_LOGS,
  INITIAL_INTERNAL_MESSAGES,
  INITIAL_WHATSAPP_MESSAGES,
  INITIAL_TYRE_COMPANIES,
  INITIAL_CUSTOMERS,
  INITIAL_RETREAD_ORDERS,
  INITIAL_COMPLAINTS,
  INITIAL_PAYMENTS,
  INITIAL_SAP_EXCHANGE,
  MOCK_USERS,
  TYRE_IMAGES
} from '../data/mockData';

export type AppMode = 'driver' | 'gate' | 'management' | 'whatsapp';

interface AppContextType {
  activeApp: AppMode;
  setActiveApp: (app: AppMode) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  driverScreen: number;
  setDriverScreen: (s: number) => void;
  gateScreen: number;
  setGateScreen: (s: number) => void;
  mgmtScreen: number;
  setMgmtScreen: (s: number) => void;
  
  // Data
  jobCards: JobCard[];
  tyres: Tyre[];
  mismatchCases: MismatchCase[];
  auditLogs: AuditLog[];
  internalMessages: InternalMessage[];
  whatsAppMessages: WhatsAppMessage[];
  tyreCompanies: TyreCompany[];
  users: UserProfile[];
  customers: CustomerProfile[];
  retreadOrders: RetreadOrder[];
  complaints: Complaint[];
  payments: PaymentTransaction[];
  sapExchangePayload: SapB1ExchangePayload;

  // Selected entities
  selectedJobCardId: string;
  setSelectedJobCardId: (id: string) => void;
  selectedTyreId: string;
  setSelectedTyreId: (id: string) => void;
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  selectedOrderNo: string;
  setSelectedOrderNo: (orderNo: string) => void;

  // Selected Job & Tyre Objects
  selectedJobCard: JobCard | undefined;
  selectedTyre: Tyre | undefined;
  selectedCase: MismatchCase | undefined;
  selectedOrder: RetreadOrder | undefined;

  // Operations
  createJobCard: (data: { customerName: string; vehicleNo: string; vehicleModel: string; pickupLocation: string; driverName: string }) => string;
  registerDriverTyre: (jobCardId: string, tyreData: { serialNo: string; brand: string; make?: string; size: string; colorField?: string; dot?: string; casingCode?: string; type: 'Radial' | 'Bias'; condition: 'Retreadable' | 'Repair Needed' | 'Casing OK' | 'Damaged' }) => void;
  sendCustomerOtp: (jobCardId: string) => void;
  verifyCustomerOtp: (jobCardId: string, inputOtp: string) => boolean;
  startTransport: (jobCardId: string) => void;
  handoverToGate: (jobCardId: string) => void;
  gateScanPhysicalTyre: (jobCardId: string, serialOrId: string) => { success: boolean; tyre?: Tyre; isUnexpected?: boolean };
  completeGateReceiving: (jobCardId: string) => void;
  submitMismatchEvidence: (caseId: string, photos: string[], remarks: string) => void;
  sendInternalMessage: (caseId: string, text: string, senderRole: 'Driver' | 'Gate' | 'Supervisor' | 'Inspector' | 'Management', photoUrl?: string) => void;
  sendWhatsAppUserMessage: (jobCardId: string, text: string) => void;
  addTyreCompany: (data: { name: string; logo: string; description: string; status: 'ACTIVE' | 'INACTIVE' }) => void;
  advanceJobLifecycle: (jobCardId: string, nextStage: string) => void;

  // TVS Tread & SoftClinch Spec Operations
  createCustomer: (data: { name: string; address: string; pan: string; gst: string; mobileNo: string; fleetOrDealerType: 'Fleet Operator' | 'Dealer' | 'Direct Customer'; creditLimit?: number }) => CustomerProfile;
  placeRetreadOrder: (data: { branch: string; customerId: string; orderType: 'RETREAD' | 'REPAIR' | 'BOTH'; vehicleNo: string; tyres: Array<{ serialNo: string; make: string; model?: string; size: string; dot?: string; casingCode?: string; colorField?: string; condition: 'Retreadable' | 'Repair Needed' | 'Casing OK' | 'Damaged' }> }) => string;
  updateTyreFitnessClassification: (tyreId: string, fitness: FitnessClassification, remarks: string, ticked: boolean) => void;
  advanceProductionStage: (jobCardId: string, stage: ProcessingStage, materialUsage?: MaterialUsage) => void;
  submitQcApproval: (jobCardId: string, qcRecord: QCApprovalRecord) => void;
  submitComplaint: (data: { orderNo: string; jobCardId: string; customerName: string; mobileNo: string; tyreSerialNo: string; category: 'Tread Separation' | 'Casing Crack' | 'Premature Wear' | 'Missing Item' | 'Billing Dispute'; description: string }) => string;
  updateComplaintInspection: (complaintId: string, result: 'ACCEPTED' | 'REJECTED', notes: string, resolutionStatus: 'APPROVED_REPLACEMENT' | 'REJECTED' | 'RESOLVED', refundAmount?: number) => void;
  processPayment: (orderNo: string, amount: number, method: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'RAZORPAY_GATEWAY') => PaymentTransaction;
  triggerSapB1Sync: (orderNo: string) => void;
  
  // Quick Scenario / Guided Demo
  currentScenarioStep: number;
  runGuidedScenarioStep: (step: number) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeApp, setActiveApp] = useState<AppMode>('driver');
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');
  const [driverScreen, setDriverScreen] = useState<number>(4); // Default to Driver Dashboard
  const [gateScreen, setGateScreen] = useState<number>(2); // Default to Gate Dashboard
  const [mgmtScreen, setMgmtScreen] = useState<number>(2); // Default to Executive Dashboard
  
  const [jobCards, setJobCards] = useState<JobCard[]>(INITIAL_JOB_CARDS);
  const [tyres, setTyres] = useState<Tyre[]>(INITIAL_TYRES);
  const [mismatchCases, setMismatchCases] = useState<MismatchCase[]>(INITIAL_MISMATCH_CASES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [internalMessages, setInternalMessages] = useState<InternalMessage[]>(INITIAL_INTERNAL_MESSAGES);
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(INITIAL_WHATSAPP_MESSAGES);
  const [tyreCompanies, setTyreCompanies] = useState<TyreCompany[]>(INITIAL_TYRE_COMPANIES);
  const [users] = useState<UserProfile[]>(MOCK_USERS);
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [retreadOrders, setRetreadOrders] = useState<RetreadOrder[]>(INITIAL_RETREAD_ORDERS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [sapExchangePayload, setSapExchangePayload] = useState<SapB1ExchangePayload>(INITIAL_SAP_EXCHANGE);

  const [selectedJobCardId, setSelectedJobCardId] = useState<string>('JC-TVS-2026-00125');
  const [selectedTyreId, setSelectedTyreId] = useState<string>('TYR-019');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('MIS-0045');
  const [selectedOrderNo, setSelectedOrderNo] = useState<string>('TVS-CHN-000124');
  const [currentScenarioStep, setCurrentScenarioStep] = useState<number>(6); // Default to Mismatch Step

  const selectedJobCard = jobCards.find((j) => j.id === selectedJobCardId);
  const selectedTyre = tyres.find((t) => t.id === selectedTyreId);
  const selectedCase = mismatchCases.find((c) => c.id === selectedCaseId);
  const selectedOrder = retreadOrders.find((o) => o.orderNo === selectedOrderNo);

  const addAudit = (action: string, userName: string, userRole: string, jobCardId: string, details: string, tyreId?: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      action,
      userId: 'USER-SYS',
      userName,
      userRole,
      jobCardId,
      tyreId,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const createCustomer = (data: { name: string; address: string; pan: string; gst: string; mobileNo: string; fleetOrDealerType: 'Fleet Operator' | 'Dealer' | 'Direct Customer'; creditLimit?: number }): CustomerProfile => {
    const newCustomer: CustomerProfile = {
      id: `CUST-00${customers.length + 1}`,
      name: data.name,
      address: data.address,
      pan: data.pan.toUpperCase(),
      gst: data.gst.toUpperCase(),
      mobileNo: data.mobileNo,
      fleetOrDealerType: data.fleetOrDealerType,
      outstandingAmount: 0,
      creditLimit: data.creditLimit || 300000,
      loyaltyPoints: 100,
      sapSynced: true,
      createdAt: new Date().toISOString()
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    addAudit('Customer Created & SAP Synced', 'Kumar (Sales)', 'Sales Employee', 'N/A', `New customer ${data.name} (PAN: ${data.pan}, GST: ${data.gst}) synced to SAP B1.`);
    return newCustomer;
  };

  const placeRetreadOrder = (data: { branch: string; customerId: string; orderType: 'RETREAD' | 'REPAIR' | 'BOTH'; vehicleNo: string; tyres: Array<{ serialNo: string; make: string; model?: string; size: string; dot?: string; casingCode?: string; colorField?: string; condition: 'Retreadable' | 'Repair Needed' | 'Casing OK' | 'Damaged' }> }): string => {
    const customer = customers.find((c) => c.id === data.customerId) || customers[0];
    const branchPrefix = data.branch.includes('Chennai') ? 'CHN' : data.branch.includes('Madurai') ? 'MDU' : data.branch.includes('Salem') ? 'SLM' : 'CBE';
    const orderIndex = retreadOrders.length + 125;
    const orderNo = `TVS-${branchPrefix}-000${orderIndex}`;
    const newJobCardId = `JC-TVS-2026-00${orderIndex}`;

    const createdTyres: Tyre[] = data.tyres.map((t, idx) => ({
      id: `TYR-${(tyres.length + idx + 1).toString().padStart(3, '0')}`,
      serialNo: t.serialNo || `TVS${Math.floor(1000 + Math.random() * 9000)}`,
      brand: t.make === 'TVS' ? 'TVS TREAD' : t.make,
      make: t.make,
      model: t.model || (t.make === 'TVS' ? 'TVS Eurogrip HD' : 'Commercial Radial'),
      size: t.size || '10.00-20',
      dot: t.dot || 'DOT 4B 2025',
      casingCode: t.casingCode || `CSG-TVS-${9000 + idx}`,
      colorField: t.make === 'MC' ? (t.colorField || 'Red Stripe') : undefined,
      type: 'Radial',
      condition: t.condition,
      jobCardId: newJobCardId,
      orderNo,
      customerName: customer.name,
      vehicleNo: data.vehicleNo,
      photos: {
        full: TYRE_IMAGES.full,
        serial: TYRE_IMAGES.serial,
        sidewall: TYRE_IMAGES.sidewall,
        damage: TYRE_IMAGES.damage
      },
      driverChecked: true,
      gateScanned: false,
      fitnessStatus: 'PENDING',
      tickedForCompletion: false,
      status: 'REGISTERED',
      currentLocation: 'Pickup Staging Bay',
      registeredAt: new Date().toISOString(),
      treadDepthMm: 4.5,
      sidewallOk: true,
      repairable: true
    }));

    const newOrder: RetreadOrder = {
      id: `ORD-2026-0${orderIndex}`,
      orderNo,
      branch: data.branch,
      customerId: customer.id,
      customerName: customer.name,
      mobileNo: customer.mobileNo,
      orderType: data.orderType,
      vehicleNo: data.vehicleNo,
      tyreCount: createdTyres.length,
      tyres: createdTyres,
      status: 'ORDER_RECEIVED',
      totalAmount: createdTyres.length * 4700,
      paidAmount: 0,
      paymentStatus: 'UNPAID',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Order Received',
          timestamp: new Date().toLocaleString(),
          description: `Order ${orderNo} created at ${data.branch} branch.`
        }
      ]
    };

    const newJobCard: JobCard = {
      id: newJobCardId,
      orderNo,
      customerId: customer.id,
      customerName: customer.name,
      vehicleNo: data.vehicleNo,
      vehicleModel: 'Ashok Leyland / Commercial Truck',
      pickupLocation: `${data.branch} Hub Depot`,
      pickupDate: new Date().toISOString().split('T')[0],
      driverId: 'SALES-101',
      driverName: 'Kumar (Sales Exec)',
      status: 'DRAFT',
      pickupQty: createdTyres.length,
      confirmedQty: createdTyres.length,
      receivedQty: 0,
      missingQty: 0,
      otpCode: Math.floor(100000 + Math.random() * 900000).toString(),
      otpVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRetreadOrders((prev) => [newOrder, ...prev]);
    setJobCards((prev) => [newJobCard, ...prev]);
    setTyres((prev) => [...createdTyres, ...prev]);
    setSelectedOrderNo(orderNo);
    setSelectedJobCardId(newJobCardId);

    addAudit('Order Placed & Auto Job Card Generated', 'Kumar', 'Sales Employee', newJobCardId, `Order ${orderNo} (${createdTyres.length} tyres) registered under branch series.`);
    return orderNo;
  };

  const updateTyreFitnessClassification = (tyreId: string, fitness: FitnessClassification, remarks: string, ticked: boolean) => {
    setTyres((prev) =>
      prev.map((t) =>
        t.id === tyreId
          ? {
              ...t,
              fitnessStatus: fitness,
              inspectionRemarks: remarks || t.inspectionRemarks,
              tickedForCompletion: ticked,
              status: fitness === 'UNFIT_REJECT_RETURN' ? 'INSPECTED' : 'INSPECTED'
            }
          : t
      )
    );

    addAudit('Tyre Fitness Classification Updated', 'Suresh', 'Inspection Team', selectedJobCardId, `Tyre ${tyreId} classified as ${fitness}. Ticked: ${ticked ? 'Yes (Completed)' : 'No (Pending Queue)'}`, tyreId);
  };

  const advanceProductionStage = (jobCardId: string, stage: ProcessingStage, materialUsage?: MaterialUsage) => {
    setJobCards((prev) =>
      prev.map((j) =>
        j.id === jobCardId
          ? {
              ...j,
              processingStage: stage,
              materialUsage: materialUsage || j.materialUsage,
              status: stage === 'PDI' ? 'QC' : 'PRODUCTION',
              updatedAt: new Date().toISOString()
            }
          : j
      )
    );

    setTyres((prev) =>
      prev.map((t) =>
        t.jobCardId === jobCardId && t.fitnessStatus !== 'UNFIT_REJECT_RETURN' && t.status !== 'MISSING'
          ? {
              ...t,
              currentStage: stage,
              status: (stage as any),
              currentLocation: `TVS Factory - ${stage} Stage Station`
            }
          : t
      )
    );

    addAudit(`Production Stage Advanced: ${stage}`, 'M. Selvam', 'Production Team', jobCardId, `Job Card entered stage ${stage}. Operator & Material logged.`);
  };

  const submitQcApproval = (jobCardId: string, qcRecord: QCApprovalRecord) => {
    setJobCards((prev) =>
      prev.map((j) =>
        j.id === jobCardId
          ? {
              ...j,
              qcApproval: qcRecord,
              status: qcRecord.approved ? 'READY_FOR_DISPATCH' : 'QC',
              updatedAt: new Date().toISOString()
            }
          : j
      )
    );

    setTyres((prev) =>
      prev.map((t) =>
        t.jobCardId === jobCardId && t.fitnessStatus !== 'UNFIT_REJECT_RETURN' && t.status !== 'MISSING'
          ? {
              ...t,
              qcRecord,
              status: qcRecord.approved ? 'READY_FOR_DISPATCH' : 'QC_PASSED',
              currentLocation: qcRecord.approved ? 'Finished Goods Dispatch Warehouse' : t.currentLocation
            }
          : t
      )
    );

    addAudit('QC Approval & PDI Signed', qcRecord.inspectorName, 'Inspection Team', jobCardId, `Post Cure Inflation (${qcRecord.pciPressurePsi} PSI) & PDI Approved: ${qcRecord.approved ? 'PASSED -> READY FOR DISPATCH' : 'REJECTED'}`);
  };

  const submitComplaint = (data: { orderNo: string; jobCardId: string; customerName: string; mobileNo: string; tyreSerialNo: string; category: 'Tread Separation' | 'Casing Crack' | 'Premature Wear' | 'Missing Item' | 'Billing Dispute'; description: string }): string => {
    const compId = `CMP-2026-00${complaints.length + 45}`;
    const newComplaint: Complaint = {
      id: compId,
      orderNo: data.orderNo,
      jobCardId: data.jobCardId,
      customerName: data.customerName,
      mobileNo: data.mobileNo,
      tyreSerialNo: data.tyreSerialNo,
      category: data.category,
      description: data.description,
      submissionDate: new Date().toISOString(),
      smsConfirmationSent: true,
      inspectionResult: 'PENDING',
      inspectionNotes: 'Assigned to TVS Technical Service Inspector for physical evaluation.',
      resolutionStatus: 'LOGGED'
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Send WhatsApp SMS confirmation
    const waComplaintNotice: WhatsAppMessage = {
      id: `WA-CMP-${Date.now()}`,
      jobCardId: data.jobCardId,
      sender: 'INAIWAZHI',
      text: `📩 *TVS TREAD Complaint Logged (${compId})*\n\nDear ${data.customerName},\nYour complaint regarding Tyre *${data.tyreSerialNo}* (${data.category}) has been registered.\n\nSMS Confirmation dispatched to ${data.mobileNo}.\nOur technical team will inspect and update resolution within 24 hours.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'COMPLAINT_SMS'
    };
    setWhatsAppMessages((prev) => [...prev, waComplaintNotice]);

    addAudit('Customer Complaint Logged', data.customerName, 'Customer', data.jobCardId, `Complaint ${compId} created. Category: ${data.category}. SMS confirmation triggered to ${data.mobileNo}.`);
    return compId;
  };

  const updateComplaintInspection = (complaintId: string, result: 'ACCEPTED' | 'REJECTED', notes: string, resolutionStatus: 'APPROVED_REPLACEMENT' | 'REJECTED' | 'RESOLVED', refundAmount?: number) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              inspectionResult: result,
              inspectionNotes: notes,
              resolutionStatus,
              creditOrRefundAmount: refundAmount || c.creditOrRefundAmount
            }
          : c
      )
    );

    addAudit('Complaint Inspection & Resolution Updated', 'Suresh (Inspector)', 'Inspection Team', selectedJobCardId, `Complaint ${complaintId} marked ${result} -> Resolution: ${resolutionStatus}. Credit: ₹${refundAmount || 0}`);
  };

  const processPayment = (orderNo: string, amount: number, method: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'RAZORPAY_GATEWAY'): PaymentTransaction => {
    const newPay: PaymentTransaction = {
      id: `PAY-2026-${Math.floor(900 + Math.random() * 99)}`,
      orderNo,
      customerName: selectedOrder?.customerName || 'ABC Transport (RAJA)',
      amount,
      paymentMethod: method,
      transactionRef: `${method}_${Date.now().toString().slice(-8)}`,
      status: 'SUCCESS',
      sapSynced: true,
      timestamp: new Date().toISOString()
    };

    setPayments((prev) => [newPay, ...prev]);

    setRetreadOrders((prev) =>
      prev.map((o) =>
        o.orderNo === orderNo
          ? {
              ...o,
              paidAmount: o.paidAmount + amount,
              paymentStatus: o.paidAmount + amount >= o.totalAmount ? 'PAID' : 'PARTIALLY_PAID'
            }
          : o
      )
    );

    addAudit('Payment Received & SAP Updated', 'P. Ramesh (Accounts)', 'Accounts', selectedJobCardId, `Payment of ₹${amount.toLocaleString()} received via ${method} for Order ${orderNo}. Synced to SAP B1.`);
    return newPay;
  };

  const triggerSapB1Sync = (orderNo: string) => {
    const order = retreadOrders.find((o) => o.orderNo === orderNo) || retreadOrders[0];
    const orderTyres = tyres.filter((t) => t.jobCardId === (order.id.replace('ORD', 'JC-TVS') || selectedJobCardId));

    const payload: SapB1ExchangePayload = {
      order_no: order.orderNo,
      customer: {
        name: order.customerName,
        mobile: order.mobileNo
      },
      tyres: (orderTyres.length > 0 ? orderTyres : tyres.slice(0, 4)).map((t) => ({
        serial_no: t.serialNo,
        size: t.size,
        fitness_status: t.fitnessStatus.replace(/_/g, '-'),
        casing_code: t.casingCode
      })),
      status: order.status === 'PROCESSING' ? 'Processing in Factory' : 'Ready for Dispatch',
      synced_at: new Date().toISOString(),
      sync_status: 'SUCCESS'
    };

    setSapExchangePayload(payload);
    addAudit('SAP B1 Middleware Sync Completed', 'Middleware Broker', 'System', selectedJobCardId, `Live JSON payload dispatched to SAP B1 for Order ${order.orderNo}`);
  };

  const createJobCard = (data: { customerName: string; vehicleNo: string; vehicleModel: string; pickupLocation: string; driverName: string }): string => {
    const newId = `JC-TVS-2026-${Math.floor(10000 + Math.random() * 90000).toString().slice(0, 5)}`;
    const newJobCard: JobCard = {
      id: newId,
      customerId: 'CUST-NEW',
      customerName: data.customerName,
      vehicleNo: data.vehicleNo,
      vehicleModel: data.vehicleModel || 'Ashok Leyland 2820',
      pickupLocation: data.pickupLocation || 'Main Terminal Yard',
      pickupDate: new Date().toISOString().split('T')[0],
      driverId: 'DRV-101',
      driverName: data.driverName || 'Kumar',
      status: 'DRAFT',
      pickupQty: 0,
      confirmedQty: 0,
      receivedQty: 0,
      missingQty: 0,
      otpCode: Math.floor(100000 + Math.random() * 900000).toString(),
      otpVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setJobCards((prev) => [newJobCard, ...prev]);
    setSelectedJobCardId(newId);
    addAudit('Pickup Created', data.driverName || 'Kumar', 'Driver', newId, `Job Card ${newId} created for ${data.customerName}`);
    return newId;
  };

  const registerDriverTyre = (jobCardId: string, tyreData: { serialNo: string; brand: string; make?: string; size: string; colorField?: string; dot?: string; casingCode?: string; type: 'Radial' | 'Bias'; condition: 'Retreadable' | 'Repair Needed' | 'Casing OK' | 'Damaged' }) => {
    const job = jobCards.find((j) => j.id === jobCardId);
    if (!job) return;

    const existingTyres = tyres.filter((t) => t.jobCardId === jobCardId);
    const nextNum = existingTyres.length + 1;
    const newTyreId = `TYR-${nextNum.toString().padStart(3, '0')}`;

    const newTyre: Tyre = {
      id: newTyreId,
      serialNo: tyreData.serialNo || `ABC1234567${nextNum.toString().padStart(2, '0')}`,
      brand: tyreData.brand || (tyreData.make === 'TVS' ? 'TVS TREAD' : tyreData.make || 'MRF'),
      make: tyreData.make || 'TVS',
      model: tyreData.make === 'TVS' ? 'TVS Eurogrip HD' : 'Commercial Radial',
      size: tyreData.size || '10.00-20',
      dot: tyreData.dot || 'DOT 4B 2025',
      casingCode: tyreData.casingCode || `CSG-TVS-${8800 + nextNum}`,
      colorField: tyreData.colorField,
      type: tyreData.type || 'Radial',
      condition: tyreData.condition || 'Casing OK',
      jobCardId,
      orderNo: job.orderNo || 'TVS-CHN-000124',
      customerName: job.customerName,
      vehicleNo: job.vehicleNo,
      photos: {
        full: TYRE_IMAGES.full,
        serial: TYRE_IMAGES.serial,
        sidewall: TYRE_IMAGES.sidewall,
        damage: TYRE_IMAGES.damage
      },
      driverChecked: true,
      gateScanned: false,
      fitnessStatus: 'FIT_OK',
      tickedForCompletion: true,
      status: 'REGISTERED',
      currentLocation: 'Driver Truck Loading Bay',
      registeredAt: new Date().toISOString()
    };

    setTyres((prev) => [...prev, newTyre]);
    setJobCards((prev) =>
      prev.map((j) =>
        j.id === jobCardId
          ? {
              ...j,
              pickupQty: j.pickupQty + 1,
              status: 'PICKUP_REGISTERING',
              updatedAt: new Date().toISOString()
            }
          : j
      )
    );

    addAudit('Tyre Registered', 'Kumar', 'Driver', jobCardId, `Kumar registered ${newTyreId} (Serial: ${newTyre.serialNo}, ${newTyre.brand})`, newTyreId);
  };

  const sendCustomerOtp = (jobCardId: string) => {
    const job = jobCards.find((j) => j.id === jobCardId);
    if (!job) return;

    const otpCode = job.otpCode || '849201';

    setJobCards((prev) =>
      prev.map((j) =>
        j.id === jobCardId ? { ...j, status: 'OTP_PENDING', updatedAt: new Date().toISOString() } : j
      )
    );

    const waNotice: WhatsAppMessage = {
      id: `WA-${Date.now()}-1`,
      jobCardId,
      sender: 'INAIWAZHI',
      text: `🚛 *TVS TREAD – REFURBISHMENT PICKUP INITIATED*\n\nDear ${job.customerName},\nDriver *${job.driverName}* has initiated Job Card *${job.id}* for vehicle *${job.vehicleNo}*.\nRecorded Tyres: *${job.pickupQty || 20}*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'NOTIFICATION'
    };

    const waOtp: WhatsAppMessage = {
      id: `WA-${Date.now()}-2`,
      jobCardId,
      sender: 'INAIWAZHI',
      text: `🔑 *TVS INAIWAZHI PICKUP OTP*\n\nYour One-Time Password to confirm ${job.pickupQty || 20} tyres pickup is:\n\n*${otpCode.slice(0, 2)} ${otpCode.slice(2, 4)} ${otpCode.slice(4)}*\n\nShare this OTP with driver ${job.driverName} or tap below to verify.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'OTP',
      otpCode,
      isVerified: false
    };

    setWhatsAppMessages((prev) => [...prev, waNotice, waOtp]);
    addAudit('Customer OTP Sent', 'Inaiwazhi Bot', 'System', jobCardId, `OTP sent via Inaiwazhi WhatsApp to ${job.customerName}`);
  };

  const verifyCustomerOtp = (jobCardId: string, inputOtp: string): boolean => {
    const job = jobCards.find((j) => j.id === jobCardId);
    if (!job) return false;

    if (inputOtp.trim() === job.otpCode || inputOtp.trim() === '849201') {
      const confirmedCount = job.pickupQty > 0 ? job.pickupQty : 20;

      setJobCards((prev) =>
        prev.map((j) =>
          j.id === jobCardId
            ? {
                ...j,
                status: 'PICKUP_CONFIRMED',
                otpVerified: true,
                confirmedQty: confirmedCount,
                updatedAt: new Date().toISOString()
              }
            : j
        )
      );

      setTyres((prev) =>
        prev.map((t) => (t.jobCardId === jobCardId ? { ...t, status: 'CONFIRMED' } : t))
      );

      setWhatsAppMessages((prev) =>
        prev.map((m) => (m.jobCardId === jobCardId && m.type === 'OTP' ? { ...m, isVerified: true } : m))
      );

      const waSuccess: WhatsAppMessage = {
        id: `WA-${Date.now()}-3`,
        jobCardId,
        sender: 'INAIWAZHI',
        text: `✅ *TVS TREAD PICKUP CONFIRMED & LOCKED*\n\nQuantity Confirmed: *${confirmedCount} Tyres*\nCustomer: ${job.customerName}\nJob Card: ${job.id}\nDriver: ${job.driverName}\n\nYour tyres are now locked and in transit to TVS Factory Unit.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'CONFIRMATION'
      };
      setWhatsAppMessages((prev) => [...prev, waSuccess]);

      addAudit('Customer OTP Verified', 'Inaiwazhi WhatsApp Bot', 'Customer Interface', jobCardId, `Customer verified OTP ${inputOtp}. Confirmed quantity: ${confirmedCount} tyres.`);
      addAudit('Customer Quantity Confirmed', job.customerName, 'Customer', jobCardId, `Customer confirmed ${confirmedCount} tyres.`);
      addAudit('Pickup Locked', 'Chain of Custody Engine', 'System', jobCardId, `Pickup locked. Confirmed quantity fixed at ${confirmedCount} tyres. Editing disabled.`);

      return true;
    }
    return false;
  };

  const startTransport = (jobCardId: string) => {
    setJobCards((prev) =>
      prev.map((j) =>
        j.id === jobCardId ? { ...j, status: 'IN_TRANSIT', updatedAt: new Date().toISOString() } : j
      )
    );
    setTyres((prev) =>
      prev.map((t) => (t.jobCardId === jobCardId ? { ...t, status: 'IN_TRANSIT', currentLocation: 'In Transit Truck TN38 AB 1234' } : t))
    );
    addAudit('Transport Started', 'Kumar', 'Driver', jobCardId, 'Vehicle departed pickup location towards TVS Factory Receiving Gate.');
  };

  const handoverToGate = (jobCardId: string) => {
    setJobCards((prev) =>
      prev.map((j) =>
        j.id === jobCardId ? { ...j, status: 'RECEIVING', updatedAt: new Date().toISOString() } : j
      )
    );
    addAudit('Driver Handover', 'Kumar', 'Driver', jobCardId, 'Driver handed over Job Card and vehicle to Gate Operator Ravi.');
  };

  const gateScanPhysicalTyre = (jobCardId: string, serialOrId: string) => {
    const job = jobCards.find((j) => j.id === jobCardId);
    if (!job) return { success: false };

    const matchingTyre = tyres.find(
      (t) =>
        t.jobCardId === jobCardId &&
        (t.id.toLowerCase() === serialOrId.toLowerCase() || t.serialNo.toLowerCase() === serialOrId.toLowerCase())
    );

    if (matchingTyre) {
      if (matchingTyre.gateScanned) {
        return { success: true, tyre: matchingTyre };
      }

      setTyres((prev) =>
        prev.map((t) =>
          t.id === matchingTyre.id
            ? {
                ...t,
                gateScanned: true,
                status: 'RECEIVED',
                currentLocation: 'Factory Gate Receiving Bay 2',
                receivedAt: new Date().toISOString()
              }
            : t
        )
      );

      const newlyScannedCount = tyres.filter((t) => t.jobCardId === jobCardId && t.gateScanned).length + 1;

      setJobCards((prev) =>
        prev.map((j) =>
          j.id === jobCardId
            ? {
                ...j,
                receivedQty: newlyScannedCount,
                updatedAt: new Date().toISOString()
              }
            : j
        )
      );

      addAudit('Physical Scan Verified', 'Ravi', 'Gate Operator', jobCardId, `Gate scanned ${matchingTyre.id} (${matchingTyre.serialNo})`, matchingTyre.id);
      return { success: true, tyre: { ...matchingTyre, gateScanned: true, status: 'RECEIVED' } };
    } else {
      return { success: false, isUnexpected: true };
    }
  };

  const completeGateReceiving = (jobCardId: string) => {
    const job = jobCards.find((j) => j.id === jobCardId);
    if (!job) return;

    const jobTyres = tyres.filter((t) => t.jobCardId === jobCardId);
    const scannedTyres = jobTyres.filter((t) => t.gateScanned);

    const expected = job.confirmedQty > 0 ? job.confirmedQty : 20;
    const received = scannedTyres.length;

    if (received < expected) {
      const missingCount = expected - received;
      const missingTyreObjs = jobTyres.filter((t) => !t.gateScanned);
      const missingIds = missingTyreObjs.map((t) => t.id);

      setTyres((prev) =>
        prev.map((t) =>
          t.jobCardId === jobCardId && !t.gateScanned
            ? { ...t, status: 'MISSING', currentLocation: 'Missing - In Transit Investigation' }
            : t
        )
      );

      const caseId = `MIS-00${Math.floor(40 + Math.random() * 20)}`;
      const newCase: MismatchCase = {
        id: caseId,
        jobCardId,
        customerName: job.customerName,
        driverName: job.driverName,
        gateOperatorName: 'Ravi',
        expectedQty: expected,
        receivedQty: received,
        missingQty: missingCount,
        missingTyreIds: missingIds.length > 0 ? missingIds : ['TYR-019', 'TYR-020'],
        status: 'OPEN',
        gatePhotos: [TYRE_IMAGES.gate, TYRE_IMAGES.unloading],
        remarks: `Gate physical scan count mismatch for Order ${job.orderNo || 'TVS-CHN-000124'}. ${received} tyres scanned off truck ${job.vehicleNo} out of ${expected} customer confirmed. Missing tyres: ${missingIds.join(', ')}.`,
        assignedTo: 'Raj (Supervisor)',
        createdAt: new Date().toISOString()
      };

      setMismatchCases((prev) => [newCase, ...prev]);
      setSelectedCaseId(caseId);

      setJobCards((prev) =>
        prev.map((j) =>
          j.id === jobCardId
            ? {
                ...j,
                receivedQty: received,
                missingQty: missingCount,
                status: 'MISMATCH_DETECTED',
                updatedAt: new Date().toISOString()
              }
            : j
        )
      );

      const waAlert: WhatsAppMessage = {
        id: `WA-${Date.now()}-4`,
        jobCardId,
        sender: 'INAIWAZHI',
        text: `🚨 *TVS FACTORY GATE DISCREPANCY ALERT*\n\nJob Card: *${job.id}*\nOrder: *${job.orderNo || 'TVS-CHN-000124'}*\nCustomer Confirmed: *${expected} Tyres*\nFactory Received: *${received} Tyres*\nMissing: *${missingCount} Tyres (${missingIds.join(', ')})*\n\nCase *${caseId}* has been logged. Our supervisor is conducting physical audit.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'MISMATCH_ALERT'
      };
      setWhatsAppMessages((prev) => [...prev, waAlert]);

      missingIds.forEach((mId) => {
        addAudit('Scan Completed - Missing Tyre Detected', 'Ravi', 'Gate Operator', jobCardId, `${mId} not scanned during physical unloading check.`, mId);
      });
      addAudit('Mismatch Case Created', 'Reconciliation Engine', 'System', jobCardId, `Case ${caseId} created automatically. Expected: ${expected}, Received: ${received}, Difference: ${missingCount}.`);
      addAudit('Supervisor Alert Sent', 'Notification Engine', 'System', jobCardId, `Supervisor notified of mismatch ${caseId}. Inaiwazhi customer alert sent.`);
    } else {
      setJobCards((prev) =>
        prev.map((j) =>
          j.id === jobCardId
            ? {
                ...j,
                status: 'INSPECTION',
                receivedQty: received,
                missingQty: 0,
                updatedAt: new Date().toISOString()
              }
            : j
        )
      );
      addAudit('Receiving Completed - All Verified', 'Ravi', 'Gate Operator', jobCardId, `All ${expected} tyres physically scanned and verified.`);
    }
  };

  const submitMismatchEvidence = (caseId: string, photos: string[], remarks: string) => {
    setMismatchCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              gatePhotos: [...c.gatePhotos, ...photos],
              remarks: remarks || c.remarks,
              status: 'INVESTIGATING'
            }
          : c
      )
    );
    addAudit('Mismatch Evidence Submitted', 'Ravi', 'Gate Operator', selectedJobCardId, `Gate Operator submitted photos and remarks for case ${caseId}`);
  };

  const sendInternalMessage = (caseId: string, text: string, senderRole: 'Driver' | 'Gate' | 'Supervisor' | 'Inspector' | 'Management', photoUrl?: string) => {
    const senderNames = {
      Driver: 'Kumar',
      Gate: 'Ravi',
      Supervisor: 'Raj',
      Inspector: 'Suresh',
      Management: 'Enterprise Admin'
    };

    const newMsg: InternalMessage = {
      id: `MSG-${Date.now()}`,
      caseId,
      senderId: `USER-${senderRole}`,
      senderName: senderNames[senderRole] || 'User',
      senderRole,
      text,
      photoUrl,
      timestamp: new Date().toISOString()
    };

    setInternalMessages((prev) => [...prev, newMsg]);
  };

  const sendWhatsAppUserMessage = (jobCardId: string, text: string) => {
    const userMsg: WhatsAppMessage = {
      id: `WA-${Date.now()}`,
      jobCardId,
      sender: 'CUSTOMER',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'NOTIFICATION'
    };
    setWhatsAppMessages((prev) => [...prev, userMsg]);
  };

  const addTyreCompany = (data: { name: string; logo: string; description: string; status: 'ACTIVE' | 'INACTIVE' }) => {
    const newComp: TyreCompany = {
      id: `COMP-00${tyreCompanies.length + 1}`,
      name: data.name,
      logo: data.logo || data.name.slice(0, 3).toUpperCase(),
      description: data.description,
      status: data.status,
      tyreCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setTyreCompanies((prev) => [...prev, newComp]);
  };

  const advanceJobLifecycle = (jobCardId: string, nextStage: string) => {
    setJobCards((prev) =>
      prev.map((j) => (j.id === jobCardId ? { ...j, status: nextStage as any, updatedAt: new Date().toISOString() } : j))
    );
    addAudit('Job Lifecycle Advanced', 'Enterprise Admin', 'Management', jobCardId, `Job stage advanced to ${nextStage}`);
  };

  const runGuidedScenarioStep = (step: number) => {
    setCurrentScenarioStep(step);
    if (step === 1) {
      // Step 1: Create Job / Order
      setActiveApp('driver');
      setDriverScreen(9);
      setSelectedJobCardId('JC-TVS-2026-00125');
    } else if (step === 2) {
      // Step 2: Register Tyres
      setActiveApp('driver');
      setDriverScreen(16);
    } else if (step === 3) {
      // Step 3: Customer OTP
      setActiveApp('whatsapp');
    } else if (step === 4) {
      // Step 4: Transport & Gate Handover
      setActiveApp('driver');
      setDriverScreen(21);
    } else if (step === 5) {
      // Step 5: Gate Scan
      setActiveApp('gate');
      setGateScreen(5);
    } else if (step === 6) {
      // Step 6: Mismatch Detection
      setActiveApp('gate');
      setGateScreen(9);
    } else if (step === 7) {
      // Step 7: Management Investigation
      setActiveApp('management');
      setMgmtScreen(10);
      setSelectedCaseId('MIS-0045');
    } else if (step === 8) {
      // Step 8: Refurbishment & 7 Stages
      setActiveApp('management');
      setMgmtScreen(18);
    } else if (step === 9) {
      // Step 9: Delivery OTP & SAP Sync
      setActiveApp('management');
      setMgmtScreen(21);
    }
  };

  const resetDemoData = () => {
    setJobCards(INITIAL_JOB_CARDS);
    setTyres(INITIAL_TYRES);
    setMismatchCases(INITIAL_MISMATCH_CASES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setInternalMessages(INITIAL_INTERNAL_MESSAGES);
    setWhatsAppMessages(INITIAL_WHATSAPP_MESSAGES);
    setTyreCompanies(INITIAL_TYRE_COMPANIES);
    setCustomers(INITIAL_CUSTOMERS);
    setRetreadOrders(INITIAL_RETREAD_ORDERS);
    setComplaints(INITIAL_COMPLAINTS);
    setPayments(INITIAL_PAYMENTS);
    setSapExchangePayload(INITIAL_SAP_EXCHANGE);
    setSelectedJobCardId('JC-TVS-2026-00125');
    setSelectedTyreId('TYR-019');
    setSelectedCaseId('MIS-0045');
    setSelectedOrderNo('TVS-CHN-000124');
    setCurrentScenarioStep(6);
  };

  return (
    <AppContext.Provider
      value={{
        activeApp,
        setActiveApp,
        currentRole,
        setCurrentRole,
        driverScreen,
        setDriverScreen,
        gateScreen,
        setGateScreen,
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
        selectedJobCard,
        selectedTyre,
        selectedCase,
        selectedOrder,
        createJobCard,
        registerDriverTyre,
        sendCustomerOtp,
        verifyCustomerOtp,
        startTransport,
        handoverToGate,
        gateScanPhysicalTyre,
        completeGateReceiving,
        submitMismatchEvidence,
        sendInternalMessage,
        sendWhatsAppUserMessage,
        addTyreCompany,
        advanceJobLifecycle,
        createCustomer,
        placeRetreadOrder,
        updateTyreFitnessClassification,
        advanceProductionStage,
        submitQcApproval,
        submitComplaint,
        updateComplaintInspection,
        processPayment,
        triggerSapB1Sync,
        currentScenarioStep,
        runGuidedScenarioStep,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
