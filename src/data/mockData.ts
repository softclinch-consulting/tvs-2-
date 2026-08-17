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
  SapB1ExchangePayload
} from '../types';

export const TYRE_IMAGES = {
  full: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
  serial: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
  sidewall: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=600&q=80',
  damage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
  gate: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
  unloading: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
  truck: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
  factory: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
  casing: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80'
};

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'CUST-001',
    name: 'ABC Transport (RAJA)',
    address: 'Plot 45, Transport Nagar, Madhavaram, Chennai - 600060',
    pan: 'AABCT1234F',
    gst: '33AABCT1234F1Z5',
    mobileNo: '9840295102',
    fleetOrDealerType: 'Fleet Operator',
    outstandingAmount: 184500,
    creditLimit: 500000,
    loyaltyPoints: 1240,
    sapSynced: true,
    createdAt: '2025-04-10T10:00:00Z'
  },
  {
    id: 'CUST-002',
    name: 'XYZ Logistics & Freight',
    address: 'Old No 12, Ring Road Bypass, Coimbatore - 641018',
    pan: 'BBXYZ5678K',
    gst: '33BBXYZ5678K2Z8',
    mobileNo: '9841299878',
    fleetOrDealerType: 'Dealer',
    outstandingAmount: 64200,
    creditLimit: 300000,
    loyaltyPoints: 850,
    sapSynced: true,
    createdAt: '2025-06-15T11:30:00Z'
  },
  {
    id: 'CUST-003',
    name: 'Sri Travels Bus Lines',
    address: 'Main Bus Stand Commercial Complex, Madurai - 625001',
    pan: 'CCSTR9012L',
    gst: '33CCSTR9012L1Z2',
    mobileNo: '9840212345',
    fleetOrDealerType: 'Fleet Operator',
    outstandingAmount: 0,
    creditLimit: 400000,
    loyaltyPoints: 2100,
    sapSynced: true,
    createdAt: '2025-01-20T09:00:00Z'
  }
];

export const INITIAL_TYRES: Tyre[] = Array.from({ length: 20 }, (_, i) => {
  const num = i + 1;
  const id = `TYR-${num.toString().padStart(3, '0')}`;
  const isMissing = num === 19 || num === 20;
  const makes = ['TVS', 'MRF', 'Apollo', 'MC', 'CEAT', 'Bridgestone'];
  const make = makes[i % makes.length];
  const sizes = ['10.00-20', '11.00-20', '295/80 R22.5'];
  const size = sizes[i % sizes.length];

  let fitnessStatus: 'FIT_OK' | 'EPR_ENTIRE_PARTY_RISK' | 'PARTIAL_RISK' | 'UNFIT_REJECT_RETURN' | 'PENDING' = 'FIT_OK';
  if (num === 4) fitnessStatus = 'EPR_ENTIRE_PARTY_RISK';
  if (num === 7) fitnessStatus = 'PARTIAL_RISK';
  if (num === 12) fitnessStatus = 'UNFIT_REJECT_RETURN';
  if (isMissing) fitnessStatus = 'PENDING';

  return {
    id,
    serialNo: num === 1 ? '1020' : `ABC1234567${num.toString().padStart(2, '0')}`,
    brand: make === 'TVS' ? 'TVS TREAD' : make,
    make,
    model: make === 'TVS' ? 'TVS Eurogrip HD' : 'Commercial Radial',
    size,
    dot: `DOT 4B 202${3 + (i % 3)}`,
    casingCode: `CSG-TVS-${8800 + num}`,
    colorField: make === 'MC' ? (i % 2 === 0 ? 'Blue Stripe' : 'Yellow Stripe') : undefined,
    type: 'Radial',
    condition: isMissing ? 'Repair Needed' : i % 3 === 0 ? 'Retreadable' : 'Casing OK',
    jobCardId: 'JC-TVS-2026-00125',
    orderNo: 'TVS-CHN-000124',
    customerName: 'ABC Transport (RAJA)',
    vehicleNo: 'TN38 AB 1234',
    photos: {
      full: TYRE_IMAGES.full,
      serial: TYRE_IMAGES.serial,
      sidewall: TYRE_IMAGES.sidewall,
      damage: TYRE_IMAGES.damage
    },
    driverChecked: true,
    gateScanned: !isMissing,
    fitnessStatus,
    inspectionRemarks: isMissing
      ? 'Awaiting Physical Scan at Factory Gate'
      : fitnessStatus === 'FIT_OK'
      ? 'Casing intact, suitable for cold retreading'
      : fitnessStatus === 'EPR_ENTIRE_PARTY_RISK'
      ? 'Entire Party Risk - High shoulder wear, customer approved processing'
      : fitnessStatus === 'PARTIAL_RISK'
      ? 'Partial Risk - Minor bead chafing detected'
      : 'Unfit - Major ply separation detected, reject and return',
    tickedForCompletion: !isMissing,
    currentStage: isMissing ? undefined : 'BUFFING',
    materialUsage: {
      patchSize: 'Radial Patch #20',
      patchQuantity: 1,
      cushionGumKg: 0.75,
      treadRubberKg: 9.2,
      cementLiters: 0.25,
      shiftInCharge: 'M. Selvam (Shift A)',
      operatorName: 'K. Vignesh',
      recordedAt: '2026-08-13T14:30:00Z'
    },
    status: isMissing ? 'MISSING' : 'RECEIVED',
    currentLocation: isMissing ? 'Missing - In Transit Investigation' : 'TVS TREAD Production Line - Buffing Bay',
    registeredAt: `2026-08-13T10:${(15 + (i % 20)).toString().padStart(2, '0')}:00Z`,
    receivedAt: !isMissing ? `2026-08-13T11:${(46 + (i % 8)).toString().padStart(2, '0')}:00Z` : undefined,
    treadDepthMm: isMissing ? 3.2 : 4.5 + (i % 4),
    sidewallOk: fitnessStatus !== 'UNFIT_REJECT_RETURN',
    repairable: fitnessStatus !== 'UNFIT_REJECT_RETURN'
  };
});

export const INITIAL_JOB_CARDS: JobCard[] = [
  {
    id: 'JC-TVS-2026-00125',
    orderNo: 'TVS-CHN-000124',
    customerId: 'CUST-001',
    customerName: 'ABC Transport (RAJA)',
    vehicleNo: 'TN38 AB 1234',
    vehicleModel: 'Ashok Leyland 2820',
    pickupLocation: 'Chennai Central Depot, Bay 4',
    pickupDate: '2026-08-13',
    driverId: 'DRV-101',
    driverName: 'Kumar (Sales/Driver)',
    status: 'MISMATCH_DETECTED',
    pickupQty: 20,
    confirmedQty: 20,
    receivedQty: 18,
    missingQty: 2,
    otpCode: '849201',
    otpVerified: true,
    processingStage: 'BUFFING',
    materialUsage: {
      patchSize: 'Radial Patch #20',
      patchQuantity: 12,
      cushionGumKg: 14.5,
      treadRubberKg: 180.0,
      cementLiters: 4.5,
      shiftInCharge: 'M. Selvam (Shift A)',
      operatorName: 'K. Vignesh',
      recordedAt: '2026-08-13T14:30:00Z'
    },
    qcApproval: {
      approved: false,
      inspectorName: 'Suresh (Senior Inspector)',
      pciPressurePsi: 110,
      pdiNotes: '18 Tyres passed preliminary buffing. Awaiting Mismatch Case MIS-0045 clearance.',
      approvedAt: '2026-08-13T15:00:00Z'
    },
    createdAt: '2026-08-13T09:30:00Z',
    updatedAt: '2026-08-13T11:54:00Z',
    gateOperatorName: 'Ravi (Gate Bay 2)'
  },
  {
    id: 'JC-TVS-2026-00124',
    orderNo: 'TVS-CBE-000098',
    customerId: 'CUST-002',
    customerName: 'XYZ Logistics & Freight',
    vehicleNo: 'TN38 CD 5678',
    vehicleModel: 'Tata Signa 4825.T',
    pickupLocation: 'Tirupur Freight Terminal',
    pickupDate: '2026-08-12',
    driverId: 'DRV-102',
    driverName: 'Santhosh',
    status: 'CLOSED',
    pickupQty: 14,
    confirmedQty: 14,
    receivedQty: 14,
    missingQty: 0,
    otpCode: '592314',
    otpVerified: true,
    processingStage: 'PDI',
    createdAt: '2026-08-12T08:15:00Z',
    updatedAt: '2026-08-12T17:30:00Z',
    gateOperatorName: 'Ravi'
  }
];

export const INITIAL_RETREAD_ORDERS: RetreadOrder[] = [
  {
    id: 'ORD-2026-081',
    orderNo: 'TVS-CHN-000124',
    branch: 'Chennai - Ashok Nagar',
    customerId: 'CUST-001',
    customerName: 'ABC Transport (RAJA)',
    mobileNo: '9840295102',
    orderType: 'RETREAD',
    vehicleNo: 'TN38 AB 1234',
    tyreCount: 20,
    tyres: INITIAL_TYRES,
    status: 'PROCESSING',
    totalAmount: 94000,
    paidAmount: 50000,
    paymentStatus: 'PARTIALLY_PAID',
    createdAt: '2026-08-13T09:00:00Z',
    timeline: [
      { status: 'Order Received', timestamp: '2026-08-13 09:00', description: 'Order created with Branch series TVS-CHN-000124' },
      { status: 'Allocated to Sales Staff', timestamp: '2026-08-13 09:15', description: 'Assigned to Sales Exec Kumar (DRV-101)' },
      { status: 'Pickup Scheduled', timestamp: '2026-08-13 09:30', description: 'Pickup scheduled at Madhavaram Depot' },
      { status: 'Tyre Picked', timestamp: '2026-08-13 10:30', description: '20 Tyres verified with Inaiwazhi OTP 849201' },
      { status: 'Received at Unit', timestamp: '2026-08-13 11:54', description: '18 Tyres scanned off truck. Discrepancy logged' },
      { status: 'Inspection', timestamp: '2026-08-13 13:00', description: 'Inspection completed: 15 Fit-OK, 1 EPR, 1 Partial Risk, 1 Unfit' },
      { status: 'Processing', timestamp: '2026-08-13 14:30', description: 'Under Buffing & Rasping in TVS Factory' }
    ]
  },
  {
    id: 'ORD-2026-082',
    orderNo: 'TVS-CBE-000098',
    branch: 'Coimbatore',
    customerId: 'CUST-002',
    customerName: 'XYZ Logistics & Freight',
    mobileNo: '9841299878',
    orderType: 'RETREAD',
    vehicleNo: 'TN38 CD 5678',
    tyreCount: 14,
    tyres: [],
    status: 'DELIVERED',
    totalAmount: 65800,
    paidAmount: 65800,
    paymentStatus: 'PAID',
    createdAt: '2026-08-12T08:00:00Z',
    timeline: [
      { status: 'Order Received', timestamp: '2026-08-12 08:00', description: 'Order TVS-CBE-000098 placed' },
      { status: 'Tyre Picked', timestamp: '2026-08-12 09:00', description: '14 Tyres picked' },
      { status: 'Received at Unit', timestamp: '2026-08-12 11:00', description: '14 Tyres received and inspected' },
      { status: 'Processing', timestamp: '2026-08-12 14:00', description: 'Curing and PCI completed' },
      { status: 'Delivered', timestamp: '2026-08-12 17:30', description: 'Delivered to customer via OTP verification' }
    ]
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2026-0042',
    orderNo: 'TVS-CHN-000124',
    jobCardId: 'JC-TVS-2026-00125',
    customerName: 'ABC Transport (RAJA)',
    mobileNo: '9840295102',
    tyreSerialNo: 'ABC123456719',
    category: 'Missing Item',
    description: 'Tyre TYR-019 (Serial ABC123456719) handed over at pickup yard but missing in gate unloading scan report.',
    submissionDate: '2026-08-13T12:15:00Z',
    smsConfirmationSent: true,
    inspectionResult: 'PENDING',
    inspectionNotes: 'Assigned to Supervisor Raj for yard CCTV and transit tracking reconciliation.',
    resolutionStatus: 'IN_REVIEW'
  },
  {
    id: 'CMP-2026-0039',
    orderNo: 'TVS-CBE-000098',
    jobCardId: 'JC-TVS-2026-00124',
    customerName: 'XYZ Logistics & Freight',
    mobileNo: '9841299878',
    tyreSerialNo: 'XYZ987654301',
    category: 'Premature Wear',
    description: 'Customer reported uneven shoulder wear on right drive tyre after 12,000 km.',
    submissionDate: '2026-08-10T14:00:00Z',
    smsConfirmationSent: true,
    inspectionResult: 'ACCEPTED',
    inspectionNotes: 'Alignment issue with vehicle axle acknowledged; 50% goodwill warranty credit granted.',
    resolutionStatus: 'APPROVED_REPLACEMENT',
    creditOrRefundAmount: 2350
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'PAY-2026-904',
    orderNo: 'TVS-CHN-000124',
    customerName: 'ABC Transport (RAJA)',
    amount: 50000,
    paymentMethod: 'UPI',
    transactionRef: 'UPI/20260813/TVS889104',
    status: 'SUCCESS',
    sapSynced: true,
    timestamp: '2026-08-13T10:00:00Z'
  },
  {
    id: 'PAY-2026-902',
    orderNo: 'TVS-CBE-000098',
    customerName: 'XYZ Logistics & Freight',
    amount: 65800,
    paymentMethod: 'RAZORPAY_GATEWAY',
    transactionRef: 'RZP_LIVE_998102341',
    status: 'SUCCESS',
    sapSynced: true,
    timestamp: '2026-08-12T16:45:00Z'
  }
];

export const INITIAL_SAP_EXCHANGE: SapB1ExchangePayload = {
  order_no: 'TVS-CHN-000124',
  customer: {
    name: 'RAJA (ABC Transport)',
    mobile: '9840295102',
    pan: 'AABCT1234F',
    gst: '33AABCT1234F1Z5'
  },
  tyres: [
    {
      serial_no: '1020',
      size: '11.00-20',
      fitness_status: 'FIT-OK',
      casing_code: 'CSG-TVS-8801'
    },
    {
      serial_no: 'ABC123456702',
      size: '10.00-20',
      fitness_status: 'FIT-OK',
      casing_code: 'CSG-TVS-8802'
    },
    {
      serial_no: 'ABC123456704',
      size: '11.00-20',
      fitness_status: 'EPR-ENTIRE-PARTY-RISK',
      casing_code: 'CSG-TVS-8804'
    },
    {
      serial_no: 'ABC123456712',
      size: '10.00-20',
      fitness_status: 'UNFIT-REJECT-RETURN',
      casing_code: 'CSG-TVS-8812'
    }
  ],
  status: 'Ready for Dispatch',
  synced_at: '2026-08-13T14:45:00Z',
  sync_status: 'SUCCESS'
};

export const INITIAL_MISMATCH_CASES: MismatchCase[] = [
  {
    id: 'MIS-0045',
    jobCardId: 'JC-TVS-2026-00125',
    customerName: 'ABC Transport (RAJA)',
    driverName: 'Kumar (Sales/Driver)',
    gateOperatorName: 'Ravi (Gate Bay 2)',
    expectedQty: 20,
    receivedQty: 18,
    missingQty: 2,
    missingTyreIds: ['TYR-019', 'TYR-020'],
    status: 'OPEN',
    gatePhotos: [TYRE_IMAGES.gate, TYRE_IMAGES.unloading],
    remarks: 'Gate physical scan count mismatch for Order TVS-CHN-000124. 18 tyres scanned off truck TN38 AB 1234 out of 20 customer confirmed via Inaiwazhi. TYR-019 and TYR-020 missing on physical arrival.',
    assignedTo: 'Raj (Supervisor)',
    createdAt: '2026-08-13T11:54:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-08-13T09:00:00Z',
    action: 'Order Placed (Branch Series)',
    userId: 'SALES-101',
    userName: 'Kumar (Sales Exec)',
    userRole: 'Sales Employee',
    jobCardId: 'JC-TVS-2026-00125',
    details: 'Order TVS-CHN-000124 created for ABC Transport (RAJA). 20 Tyres scheduled for pickup.'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-08-13T10:15:00Z',
    action: 'Pickup Created',
    userId: 'DRV-101',
    userName: 'Kumar',
    userRole: 'Driver / Sales',
    jobCardId: 'JC-TVS-2026-00125',
    details: 'Job Card JC-TVS-2026-00125 created for ABC Transport (TN38 AB 1234)'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-08-13T10:29:00Z',
    action: 'Inaiwazhi OTP Verified',
    userId: 'INAIWAZHI-SYS',
    userName: 'Inaiwazhi WhatsApp Bot',
    userRole: 'Customer Interface',
    jobCardId: 'JC-TVS-2026-00125',
    details: 'Customer verified OTP 849201 via WhatsApp. Confirmed quantity: 20 tyres.'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-08-13T11:54:00Z',
    action: 'Mismatch Case Created',
    userId: 'SYSTEM',
    userName: 'Reconciliation Engine',
    userRole: 'System',
    jobCardId: 'JC-TVS-2026-00125',
    details: 'Case MIS-0045 created automatically. Expected: 20, Received: 18, Difference: 2 (TYR-019, TYR-020).'
  },
  {
    id: 'AUD-005',
    timestamp: '2026-08-13T13:00:00Z',
    action: 'Inspection & Fitness Classified',
    userId: 'INSP-301',
    userName: 'Suresh',
    userRole: 'Inspection Team',
    jobCardId: 'JC-TVS-2026-00125',
    details: '18 Tyres classified: 15 Fit-OK, 1 EPR, 1 Partial Risk, 1 Unfit-Reject Return. Synced to SAP B1.'
  },
  {
    id: 'AUD-006',
    timestamp: '2026-08-13T14:30:00Z',
    action: 'Buffing & Rasping Stage Started',
    userId: 'PROD-401',
    userName: 'M. Selvam',
    userRole: 'Production Team',
    jobCardId: 'JC-TVS-2026-00125',
    details: 'Material used logged: Radial Patch #20 (12 qty), 14.5 kg Cushion Gum, 180 kg Tread Rubber.'
  }
];

export const INITIAL_INTERNAL_MESSAGES: InternalMessage[] = [
  {
    id: 'MSG-001',
    caseId: 'MIS-0045',
    senderId: 'GATE-201',
    senderName: 'Ravi',
    senderRole: 'Gate',
    text: '⚠️ Unloaded truck TN38 AB 1234 at Bay 2. Only 18 tyres physically present. Scanned all 18 barcodes/serials. Missing 2 tyres from customer confirmation list.',
    timestamp: '11:55 AM'
  },
  {
    id: 'MSG-002',
    caseId: 'MIS-0045',
    senderId: 'SUP-301',
    senderName: 'Raj',
    senderRole: 'Supervisor',
    text: 'Kumar (Driver), please verify your pickup sheet. Customer ABC Transport OTP-confirmed 20 tyres at 10:29 AM. Did 2 tyres stay behind at their warehouse?',
    timestamp: '11:58 AM'
  },
  {
    id: 'MSG-003',
    caseId: 'MIS-0045',
    senderId: 'DRV-101',
    senderName: 'Kumar',
    senderRole: 'Driver',
    text: 'I physically tagged 20 tyres. However, during loading at Madhavaram, 2 tyres (MRF 10.00-20 and Apollo 11.00-20) were kept in the secondary bay. Checking with customer warehouse supervisor now.',
    timestamp: '12:02 PM'
  }
];

export const INITIAL_WHATSAPP_MESSAGES: WhatsAppMessage[] = [
  {
    id: 'WMSG-001',
    jobCardId: 'JC-TVS-2026-00125',
    sender: 'INAIWAZHI',
    text: '👋 *TVS TREAD – Sundaram Industries*\n\nDear Customer *RAJA (ABC Transport)*,\nYour Retread Order *TVS-CHN-000124* has been scheduled for pickup.\n\nDriver: *Kumar* (+91 98765 43210)\nVehicle: *TN38 AB 1234*\nPickup Location: *Madhavaram Depot*',
    timestamp: '09:30 AM',
    type: 'NOTIFICATION'
  },
  {
    id: 'WMSG-002',
    jobCardId: 'JC-TVS-2026-00125',
    sender: 'INAIWAZHI',
    text: '🔐 *TVS TREAD Pickup OTP Verification*\n\nDriver Kumar has registered *20 Tyres* for pickup under Order *TVS-CHN-000124*.\n\nYour Verification OTP is: *849201*\n\nPlease share this OTP with the driver or confirm below to authorize handover of 20 tyres.',
    timestamp: '10:28 AM',
    type: 'OTP',
    otpCode: '849201',
    isVerified: true
  },
  {
    id: 'WMSG-003',
    jobCardId: 'JC-TVS-2026-00125',
    sender: 'INAIWAZHI',
    text: '✅ *Pickup Confirmed!*\n\nOTP *849201* verified successfully.\n*20 Tyres* officially received by TVS TREAD logistics.\nJob Card: *JC-TVS-2026-00125*\nVehicle: TN38 AB 1234 in transit to TVS Factory Unit.',
    timestamp: '10:30 AM',
    type: 'CONFIRMATION'
  },
  {
    id: 'WMSG-004',
    jobCardId: 'JC-TVS-2026-00125',
    sender: 'INAIWAZHI',
    text: '⚠️ *TVS Factory Gate Discrepancy Notice*\n\nDear RAJA, during physical unloading at TVS Factory Gate Bay 2, *18 Tyres* were received out of the *20 Tyres* confirmed at pickup.\n\nDiscrepancy Case *MIS-0045* has been logged. Our supervisor Raj (+91 98765 43213) is reviewing yard logs.',
    timestamp: '11:56 AM',
    type: 'MISMATCH_ALERT'
  },
  {
    id: 'WMSG-005',
    jobCardId: 'JC-TVS-2026-00125',
    sender: 'INAIWAZHI',
    text: '📩 *Complaint Logged (CMP-2026-0042)*\n\nYour inquiry regarding missing tyre TYR-019 has been received. SMS Confirmation dispatched to 9840295102. SAP B1 ticket sync: Active.',
    timestamp: '12:16 PM',
    type: 'COMPLAINT_SMS'
  }
];

export const INITIAL_TYRE_COMPANIES: TyreCompany[] = [
  {
    id: 'COMP-TVS',
    name: 'TVS TREAD (Sundaram Industries)',
    logo: 'TVS',
    description: 'TVS TREAD - Pioneer in Cold Retreading & Commercial Fleet Solutions',
    status: 'ACTIVE',
    tyreCount: 1420,
    lastUpdated: '2026-08-13'
  },
  {
    id: 'COMP-MC',
    name: 'MC Line (Color Stripe Casing)',
    logo: 'MC',
    description: 'MC Custom Compound Retreading with Identification Color Strips',
    status: 'ACTIVE',
    tyreCount: 380,
    lastUpdated: '2026-08-13'
  },
  {
    id: 'COMP-001',
    name: 'MRF Tyres',
    logo: 'MRF',
    description: 'MRF Limited - Commercial Heavy Duty Radial & Bias Tyres',
    status: 'ACTIVE',
    tyreCount: 842,
    lastUpdated: '2026-08-10'
  },
  {
    id: 'COMP-002',
    name: 'Apollo Tyres',
    logo: 'APOLLO',
    description: 'Apollo EnduRace & EnduMile Commercial Truck Tyres',
    status: 'ACTIVE',
    tyreCount: 620,
    lastUpdated: '2026-08-11'
  },
  {
    id: 'COMP-003',
    name: 'CEAT Specialty',
    logo: 'CEAT',
    description: 'CEAT Winmile & MileXL Heavy Commercial Vehicles',
    status: 'ACTIVE',
    tyreCount: 415,
    lastUpdated: '2026-08-09'
  },
  {
    id: 'COMP-004',
    name: 'JK Tyre & Industries',
    logo: 'JK',
    description: 'JK Tyre Jetsteel & Jetway Fleet Range',
    status: 'ACTIVE',
    tyreCount: 530,
    lastUpdated: '2026-08-12'
  },
  {
    id: 'COMP-005',
    name: 'Bridgestone Commercial',
    logo: 'BRIDGESTONE',
    description: 'Bridgestone R156 & M729 Commercial Fleet Series',
    status: 'ACTIVE',
    tyreCount: 290,
    lastUpdated: '2026-08-08'
  }
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'ADM-001',
    name: 'Enterprise Admin (SoftClinch / TVS)',
    role: 'ADMIN',
    phone: '+91 98402 95102',
    employeeId: 'EMP-ADM-001',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'SALES-101',
    name: 'Kumar (Sales & Pickup Executive)',
    role: 'SALES_EMPLOYEE',
    phone: '+91 98765 43210',
    employeeId: 'EMP-SALES-101',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'INSP-301',
    name: 'Suresh (Senior Tyre Inspector)',
    role: 'INSPECTION_TEAM',
    phone: '+91 98765 43212',
    employeeId: 'EMP-INS-301',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'PROD-401',
    name: 'M. Selvam (Production Shift In-Charge)',
    role: 'PRODUCTION_TEAM',
    phone: '+91 98765 43215',
    employeeId: 'EMP-PROD-401',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'ACC-501',
    name: 'P. Ramesh (Accounts & SAP Officer)',
    role: 'ACCOUNTS',
    phone: '+91 98765 43216',
    employeeId: 'EMP-ACC-501',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'CUST-001',
    name: 'RAJA (ABC Transport Fleet Owner)',
    role: 'CUSTOMER',
    phone: '+91 98402 95102',
    employeeId: 'CUST-001',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'GATE-201',
    name: 'Ravi (Gate Bay 2 Receiving Operator)',
    role: 'GATE_OPERATOR',
    phone: '+91 98765 43211',
    employeeId: 'EMP-GAT-201',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'DRV-101',
    name: 'Kumar (Driver)',
    role: 'DRIVER',
    phone: '+91 98765 43210',
    employeeId: 'EMP-DRV-101',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  }
];
