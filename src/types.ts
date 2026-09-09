export type UserRole =
  | 'ADMIN'
  | 'SALES_EMPLOYEE'
  | 'INSPECTION_TEAM'
  | 'PRODUCTION_TEAM'
  | 'ACCOUNTS'
  | 'CUSTOMER'
  | 'DRIVER'
  | 'GATE_OPERATOR';

export type JobCardStatus =
  | 'DRAFT'
  | 'PICKUP_REGISTERING'
  | 'OTP_PENDING'
  | 'PICKUP_CONFIRMED'
  | 'IN_TRANSIT'
  | 'RECEIVING'
  | 'MISMATCH_DETECTED'
  | 'INSPECTION'
  | 'PRODUCTION'
  | 'QC'
  | 'READY_FOR_DISPATCH'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CLOSED';

export type FitnessClassification =
  | 'FIT_OK'
  | 'EPR_ENTIRE_PARTY_RISK'
  | 'PARTIAL_RISK'
  | 'UNFIT_REJECT_RETURN'
  | 'PENDING';

export type ProcessingStage =
  | 'BUFFING'
  | 'RASPING'
  | 'REPAIR'
  | 'COATING'
  | 'CURING'
  | 'PCI' // Post Cure Inflation
  | 'PDI'; // Pre-Delivery Inspection

export type TyreStatus =
  | 'REGISTERED'
  | 'CONFIRMED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'MISSING'
  | 'INSPECTED'
  | 'BUFFING'
  | 'RASPING'
  | 'REPAIR'
  | 'COATING'
  | 'CURING'
  | 'PCI'
  | 'PDI'
  | 'QC_PASSED'
  | 'READY_FOR_DISPATCH'
  | 'DISPATCHED'
  | 'DELIVERED';

export interface TyrePhotoSet {
  full: string;
  serial: string;
  sidewall: string;
  damage: string;
}

export interface MaterialUsage {
  patchSize: string; // e.g. 'Radial Patch #20', 'Bias Plug 35mm'
  patchQuantity: number;
  cushionGumKg: number;
  treadRubberKg: number;
  cementLiters: number;
  shiftInCharge: string;
  operatorName: string;
  recordedAt: string; // System Date Default (Non-editable)
}

export interface QCApprovalRecord {
  approved: boolean;
  inspectorName: string;
  pciPressurePsi: number;
  pdiNotes: string;
  approvedAt: string;
}

export interface Tyre {
  id: string; // e.g. TYR-001
  serialNo: string; // e.g. ABC123456781 or 1020
  brand: string; // e.g. TVS, MRF, Apollo, CEAT, JK Tyre, Bridgestone, MC
  make?: string; // e.g. TVS, MC
  model?: string; // e.g. TVS Eurogrip, MRF Super Lug
  size: string; // e.g. 10.00 R20, 11.00 R20, 295/80 R22.5
  dot?: string; // e.g. DOT 4B 2024
  casingCode?: string; // e.g. CSG-9921
  colorField?: string; // If Make = MC (e.g. Red, Blue, Yellow stripe)
  type: 'Radial' | 'Bias';
  condition: 'Retreadable' | 'Repair Needed' | 'Casing OK' | 'Damaged';
  jobCardId: string;
  orderNo?: string; // e.g. TVS-CHN-000124
  customerName: string;
  vehicleNo: string;
  photos: TyrePhotoSet;
  driverChecked: boolean;
  gateScanned: boolean;
  fitnessStatus: FitnessClassification;
  inspectionRemarks?: string;
  tickedForCompletion: boolean;
  currentStage?: ProcessingStage;
  materialUsage?: MaterialUsage;
  qcRecord?: QCApprovalRecord;
  status: TyreStatus;
  currentLocation: string;
  registeredAt: string;
  receivedAt?: string;
  treadDepthMm?: number;
  sidewallOk?: boolean;
  repairable?: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  address: string;
  pan: string;
  gst: string;
  mobileNo: string;
  fleetOrDealerType: 'Fleet Operator' | 'Dealer' | 'Direct Customer';
  outstandingAmount: number;
  creditLimit: number;
  loyaltyPoints: number;
  sapSynced: boolean;
  createdAt: string;
}

export interface RetreadOrder {
  id: string; // e.g. ORD-2026-081
  orderNo: string; // Branch-wise series e.g. TVS-CHN-000124
  branch: string; // e.g. Chennai - Ashok Nagar, Madurai, Coimbatore, Salem
  customerId: string;
  customerName: string;
  mobileNo: string;
  orderType: 'RETREAD' | 'REPAIR' | 'BOTH';
  vehicleNo: string;
  tyreCount: number;
  tyres: Tyre[];
  status:
    | 'ORDER_RECEIVED'
    | 'ALLOCATED_TO_SALES_STAFF'
    | 'PICKUP_SCHEDULED'
    | 'TYRE_PICKED'
    | 'RECEIVED_AT_UNIT'
    | 'INSPECTION'
    | 'PROCESSING'
    | 'READY_FOR_DISPATCH'
    | 'DISPATCHED'
    | 'DELIVERED';
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  createdAt: string;
  timeline: {
    status: string;
    timestamp: string;
    description: string;
  }[];
}

export interface JobCard {
  id: string; // e.g. JC-TVS-2026-00125
  orderNo?: string; // e.g. TVS-CHN-000124
  customerId: string;
  customerName: string;
  vehicleNo: string;
  vehicleModel: string;
  pickupLocation: string;
  pickupDate: string;
  driverId: string;
  driverName: string;
  status: JobCardStatus;
  pickupQty: number; // e.g. 20
  confirmedQty: number; // e.g. 20
  receivedQty: number; // e.g. 18
  missingQty: number; // e.g. 2
  otpCode: string;
  otpVerified: boolean;
  processingStage?: ProcessingStage;
  materialUsage?: MaterialUsage;
  qcApproval?: QCApprovalRecord;
  createdAt: string;
  updatedAt: string;
  gateOperatorName?: string;
}

export type CaseStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ESCALATED';

export interface MismatchCase {
  id: string; // e.g. MIS-0045
  jobCardId: string;
  customerName: string;
  driverName: string;
  gateOperatorName: string;
  expectedQty: number; // 20
  receivedQty: number; // 18
  missingQty: number; // 2
  missingTyreIds: string[]; // ['TYR-019', 'TYR-020']
  status: CaseStatus;
  gatePhotos: string[];
  remarks: string;
  assignedTo: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Complaint {
  id: string; // e.g. CMP-2026-0042
  orderNo: string;
  jobCardId: string;
  customerName: string;
  mobileNo: string;
  tyreSerialNo: string;
  category: 'Tread Separation' | 'Casing Crack' | 'Premature Wear' | 'Missing Item' | 'Billing Dispute';
  description: string;
  submissionDate: string;
  smsConfirmationSent: boolean;
  inspectionResult: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  inspectionNotes: string;
  resolutionStatus: 'LOGGED' | 'IN_REVIEW' | 'INSPECTION_COMPLETED' | 'APPROVED_REPLACEMENT' | 'REJECTED' | 'RESOLVED';
  creditOrRefundAmount?: number;
}

export interface PaymentTransaction {
  id: string; // e.g. PAY-2026-904
  orderNo: string;
  customerName: string;
  amount: number;
  paymentMethod: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'RAZORPAY_GATEWAY';
  transactionRef: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  sapSynced: boolean;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userName: string;
  userRole: string;
  tyreId?: string;
  jobCardId: string;
  details: string;
}

export interface InternalMessage {
  id: string;
  caseId: string;
  senderId: string;
  senderName: string;
  senderRole: 'Driver' | 'Gate' | 'Supervisor' | 'Inspector' | 'Management';
  text: string;
  photoUrl?: string;
  timestamp: string;
}

export interface WhatsAppMessage {
  id: string;
  jobCardId: string;
  sender: 'SYSTEM' | 'CUSTOMER' | 'DRIVER' | 'INAIWAZHI';
  text: string;
  timestamp: string;
  type: 'NOTIFICATION' | 'OTP' | 'CONFIRMATION' | 'MISMATCH_ALERT' | 'DELIVERY_OTP' | 'COMPLAINT_SMS';
  otpCode?: string;
  isVerified?: boolean;
}

export interface TyreCompany {
  id: string;
  name: string;
  logo: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  tyreCount: number;
  lastUpdated: string;
  docUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  employeeId: string;
  avatar: string;
}

export interface SapB1ExchangePayload {
  order_no: string;
  customer: {
    name: string;
    mobile: string;
    pan?: string;
    gst?: string;
  };
  tyres: {
    serial_no: string;
    size: string;
    fitness_status: string;
    casing_code?: string;
  }[];
  status: string;
  synced_at: string;
  sync_status: 'SUCCESS' | 'PENDING' | 'ERROR';
}

