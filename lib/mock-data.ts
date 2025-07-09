import {
  Property,
  Unit,
  Tenant,
  Lease,
  MaintenanceRequest,
  Payment,
  Vendor,
  User,
  Document,
  Message,
  Notification,
  DashboardStats,
  MoveInChecklist,
  ChecklistItem,
  MoveOutInspection,
  InspectionItem,
  SecurityDeposit,
  DepositDeduction,
  UnitConditionReport,
  ConditionArea,
  PropertyListing,
  Buyer,
  PropertySale,
  PropertyInquiry,
  PropertyShowing,
  PropertyOffer
} from './types'

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john@propease.com",
    phone: "(555) 123-4567",
    role: "admin",
    avatar: "/placeholder-user.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    permissions: ["all"]
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah@propease.com",
    phone: "(555) 234-5678",
    role: "property_manager",
    avatar: "/placeholder-user.jpg",
    isActive: true,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
    permissions: ["properties", "tenants", "leases", "maintenance", "payments"]
  },
  {
    id: "user-3",
    name: "Mike Chen",
    email: "mike@propease.com",
    phone: "(555) 345-6789",
    role: "landlord",
    avatar: "/placeholder-user.jpg",
    isActive: true,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
    permissions: ["properties", "reports"]
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily@email.com",
    phone: "(555) 456-7890",
    role: "tenant",
    avatar: "/placeholder-user.jpg",
    isActive: true,
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04"),
    permissions: ["own_lease", "maintenance_requests", "payments"]
  },
  {
    id: "user-5",
    name: "David Wilson",
    email: "david@email.com",
    phone: "(555) 567-8901",
    role: "tenant",
    avatar: "/placeholder-user.jpg",
    isActive: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    permissions: ["own_lease", "maintenance_requests", "payments"]
  },
  {
    id: "user-6",
    name: "Lisa Brown",
    email: "lisa@email.com",
    phone: "(555) 678-9012",
    role: "tenant",
    avatar: "/placeholder-user.jpg",
    isActive: true,
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-06"),
    permissions: ["own_lease", "maintenance_requests", "payments"]
  },
  {
    id: "user-7",
    name: "Bob's Plumbing",
    email: "bob@plumbing.com",
    phone: "(555) 789-0123",
    role: "vendor",
    avatar: "/placeholder-user.jpg",
    isActive: true,
    createdAt: new Date("2024-01-07"),
    updatedAt: new Date("2024-01-07"),
    permissions: ["maintenance_assignments"]
  }
]

// Mock Vendors
export const mockVendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "Bob's Plumbing",
    email: "bob@plumbing.com",
    phone: "(555) 789-0123",
    specialties: ["plumbing"],
    rating: 4.8,
    totalJobs: 45,
    isActive: true,
    address: "123 Main St, City, State 12345",
    licenseNumber: "PL123456",
    insuranceInfo: "Policy #INS789012",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "vendor-2",
    name: "Quick Fix Electrical",
    email: "quick@electrical.com",
    phone: "(555) 890-1234",
    specialties: ["electrical"],
    rating: 4.6,
    totalJobs: 32,
    isActive: true,
    address: "456 Oak Ave, City, State 12345",
    licenseNumber: "EL654321",
    insuranceInfo: "Policy #INS345678",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  },
  {
    id: "vendor-3",
    name: "Cool Air HVAC",
    email: "cool@hvac.com",
    phone: "(555) 901-2345",
    specialties: ["hvac"],
    rating: 4.9,
    totalJobs: 28,
    isActive: true,
    address: "789 Pine St, City, State 12345",
    licenseNumber: "HV987654",
    insuranceInfo: "Policy #INS901234",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03")
  }
]

// Mock Properties
export const mockProperties: Property[] = [
  {
    id: "prop-1",
    name: "Sunset Apartments",
    address: {
      street: "123 Sunset Blvd",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    },
    type: "apartment",
    status: "active",
    description: "Modern apartment complex with luxury amenities and city views",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop"
    ],
    documents: [],
    units: [],
    totalUnits: 24,
    occupiedUnits: 20,
    propertyManagerId: "user-2",
    ownerId: "user-3",
    yearBuilt: 2018,
    amenities: ["Pool", "Gym", "Parking", "Security", "Elevator"],
    coordinates: { lat: 34.0522, lng: -118.2437 },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "prop-2",
    name: "Downtown Lofts",
    address: {
      street: "456 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    type: "apartment",
    status: "active",
    description: "Historic building converted to modern lofts in the heart of downtown",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"
    ],
    documents: [],
    units: [],
    totalUnits: 12,
    occupiedUnits: 10,
    propertyManagerId: "user-2",
    ownerId: "user-3",
    yearBuilt: 1920,
    amenities: ["Rooftop Deck", "Storage", "Bike Room", "Package Receiving"],
    coordinates: { lat: 40.7128, lng: -74.0060 },
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  },
  {
    id: "prop-3",
    name: "Riverside Townhomes",
    address: {
      street: "789 River Road",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "USA"
    },
    type: "townhouse",
    status: "active",
    description: "Family-friendly townhomes with river views and private yards",
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop"
    ],
    documents: [],
    units: [],
    totalUnits: 8,
    occupiedUnits: 7,
    propertyManagerId: "user-2",
    ownerId: "user-3",
    yearBuilt: 2015,
    amenities: ["Private Yards", "Garage", "Community Pool", "Playground"],
    coordinates: { lat: 30.2672, lng: -97.7431 },
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03")
  }
]

// Mock Units
export const mockUnits: Unit[] = [
  // Sunset Apartments Units
  {
    id: "unit-1",
    propertyId: "prop-1",
    number: "101",
    type: "1br",
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    rent: 2200,
    deposit: 2200,
    status: "occupied",
    floor: 1,
    description: "Cozy 1-bedroom apartment with city views",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"],
    amenities: ["Balcony", "In-unit Laundry", "Dishwasher"],
    currentTenantId: "user-4",
    currentLeaseId: "lease-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "unit-2",
    propertyId: "prop-1",
    number: "102",
    type: "2br",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    rent: 2800,
    deposit: 2800,
    status: "occupied",
    floor: 1,
    description: "Spacious 2-bedroom apartment with modern finishes",
    images: ["https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&h=400&fit=crop"],
    amenities: ["Balcony", "In-unit Laundry", "Dishwasher", "Walk-in Closet"],
    currentTenantId: "user-5",
    currentLeaseId: "lease-2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "unit-3",
    propertyId: "prop-1",
    number: "201",
    type: "studio",
    bedrooms: 0,
    bathrooms: 1,
    area: 500,
    rent: 1800,
    deposit: 1800,
    status: "available",
    floor: 2,
    description: "Efficient studio apartment perfect for singles",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop"],
    amenities: ["Built-in Storage", "Dishwasher"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  // Downtown Lofts Units
  {
    id: "unit-4",
    propertyId: "prop-2",
    number: "A1",
    type: "1br",
    bedrooms: 1,
    bathrooms: 1,
    area: 900,
    rent: 3200,
    deposit: 3200,
    status: "occupied",
    floor: 1,
    description: "Industrial-style loft with exposed brick",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"],
    amenities: ["Exposed Brick", "High Ceilings", "Large Windows"],
    currentTenantId: "user-6",
    currentLeaseId: "lease-3",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  },
  {
    id: "unit-5",
    propertyId: "prop-2",
    number: "B2",
    type: "2br",
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    rent: 4200,
    deposit: 4200,
    status: "available",
    floor: 2,
    description: "Luxury loft with rooftop access",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop"],
    amenities: ["Rooftop Access", "Exposed Brick", "High Ceilings", "Large Windows"],
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  }
]

// Mock Tenants
export const mockTenants: Tenant[] = [
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily@email.com",
    phone: "(555) 456-7890",
    dateOfBirth: new Date("1990-05-15"),
    emergencyContact: {
      name: "Robert Davis",
      phone: "(555) 456-7891",
      relationship: "Father"
    },
    documents: [],
    currentUnitId: "unit-1",
    currentLeaseId: "lease-1",
    isActive: true,
    moveInDate: new Date("2024-01-15"),
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04")
  },
  {
    id: "user-5",
    name: "David Wilson",
    email: "david@email.com",
    phone: "(555) 567-8901",
    dateOfBirth: new Date("1988-12-03"),
    emergencyContact: {
      name: "Maria Wilson",
      phone: "(555) 567-8902",
      relationship: "Sister"
    },
    documents: [],
    currentUnitId: "unit-2",
    currentLeaseId: "lease-2",
    isActive: true,
    moveInDate: new Date("2024-02-01"),
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05")
  },
  {
    id: "user-6",
    name: "Lisa Brown",
    email: "lisa@email.com",
    phone: "(555) 678-9012",
    dateOfBirth: new Date("1992-08-22"),
    emergencyContact: {
      name: "James Brown",
      phone: "(555) 678-9013",
      relationship: "Brother"
    },
    documents: [],
    currentUnitId: "unit-4",
    currentLeaseId: "lease-3",
    isActive: true,
    moveInDate: new Date("2024-01-20"),
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-06")
  }
]

// Mock Leases
export const mockLeases: Lease[] = [
  {
    id: "lease-1",
    tenantId: "user-4",
    unitId: "unit-1",
    propertyId: "prop-1",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2025-01-14"),
    rent: 2200,
    deposit: 2200,
    status: "active",
    type: "yearly",
    documents: [],
    terms: "Standard lease agreement with 12-month term",
    lateFee: 50,
    gracePeriod: 5,
    autoRenew: true,
    renewalTerms: "Month-to-month after initial term",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  },
  {
    id: "lease-2",
    tenantId: "user-5",
    unitId: "unit-2",
    propertyId: "prop-1",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2025-01-31"),
    rent: 2800,
    deposit: 2800,
    status: "active",
    type: "yearly",
    documents: [],
    terms: "Standard lease agreement with 12-month term",
    lateFee: 75,
    gracePeriod: 5,
    autoRenew: true,
    renewalTerms: "Month-to-month after initial term",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25")
  },
  {
    id: "lease-3",
    tenantId: "user-6",
    unitId: "unit-4",
    propertyId: "prop-2",
    startDate: new Date("2024-01-20"),
    endDate: new Date("2025-01-19"),
    rent: 3200,
    deposit: 3200,
    status: "active",
    type: "yearly",
    documents: [],
    terms: "Standard lease agreement with 12-month term",
    lateFee: 100,
    gracePeriod: 5,
    autoRenew: true,
    renewalTerms: "Month-to-month after initial term",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  }
]

// Mock Maintenance Requests
export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: "maint-1",
    unitId: "unit-1",
    propertyId: "prop-1",
    tenantId: "user-4",
    title: "Leaky Faucet in Kitchen",
    description: "The kitchen faucet is dripping constantly and needs repair",
    category: "plumbing",
    priority: "medium",
    status: "completed",
    assignedVendorId: "vendor-1",
    estimatedCost: 150,
    actualCost: 125,
    scheduledDate: new Date("2024-02-15"),
    completedDate: new Date("2024-02-16"),
    images: [],
    tenantNotes: "Please fix as soon as possible",
    vendorNotes: "Replaced cartridge and fixed leak",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-16")
  },
  {
    id: "maint-2",
    unitId: "unit-2",
    propertyId: "prop-1",
    tenantId: "user-5",
    title: "AC Not Cooling Properly",
    description: "Air conditioning unit is not cooling the apartment effectively",
    category: "hvac",
    priority: "high",
    status: "in_progress",
    assignedVendorId: "vendor-3",
    estimatedCost: 300,
    scheduledDate: new Date("2024-03-01"),
    images: [],
    tenantNotes: "It's getting very hot in here",
    vendorNotes: "Diagnosing the issue",
    createdAt: new Date("2024-02-28"),
    updatedAt: new Date("2024-02-28")
  },
  {
    id: "maint-3",
    unitId: "unit-4",
    propertyId: "prop-2",
    tenantId: "user-6",
    title: "Light Switch Not Working",
    description: "The light switch in the living room stopped working",
    category: "electrical",
    priority: "medium",
    status: "assigned",
    assignedVendorId: "vendor-2",
    estimatedCost: 100,
    scheduledDate: new Date("2024-03-05"),
    images: [],
    tenantNotes: "Need this fixed soon",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01")
  }
]

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: "payment-1",
    tenantId: "user-4",
    leaseId: "lease-1",
    unitId: "unit-1",
    propertyId: "prop-1",
    amount: 2200,
    type: "rent",
    dueDate: new Date("2024-02-01"),
    paidDate: new Date("2024-02-01"),
    status: "paid",
    method: "online",
    reference: "TXN123456",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  },
  {
    id: "payment-2",
    tenantId: "user-4",
    leaseId: "lease-1",
    unitId: "unit-1",
    propertyId: "prop-1",
    amount: 2200,
    type: "rent",
    dueDate: new Date("2024-03-01"),
    paidDate: new Date("2024-03-01"),
    status: "paid",
    method: "online",
    reference: "TXN123457",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01")
  },
  {
    id: "payment-3",
    tenantId: "user-5",
    leaseId: "lease-2",
    unitId: "unit-2",
    propertyId: "prop-1",
    amount: 2800,
    type: "rent",
    dueDate: new Date("2024-03-01"),
    status: "pending",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01")
  },
  {
    id: "payment-4",
    tenantId: "user-6",
    leaseId: "lease-3",
    unitId: "unit-4",
    propertyId: "prop-2",
    amount: 3200,
    type: "rent",
    dueDate: new Date("2024-02-20"),
    status: "overdue",
    lateFee: 100,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20")
  }
]

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: "msg-1",
    senderId: "user-4",
    recipientIds: ["user-2"],
    type: "direct",
    subject: "Maintenance Request Update",
    content: "Hi, I wanted to follow up on my maintenance request for the leaky faucet. When can I expect someone to come by?",
    status: "read",
    readAt: new Date("2024-02-12"),
    createdAt: new Date("2024-02-12")
  },
  {
    id: "msg-2",
    senderId: "user-2",
    recipientIds: ["user-4"],
    type: "direct",
    subject: "Re: Maintenance Request Update",
    content: "Hi Emily, I've scheduled a plumber for tomorrow at 2 PM. They should be able to fix the faucet issue.",
    status: "read",
    readAt: new Date("2024-02-12"),
    createdAt: new Date("2024-02-12")
  }
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-4",
    type: "rent_due",
    title: "Rent Due Reminder",
    message: "Your rent payment of $2,200 is due on March 1st, 2024",
    channel: "email",
    isRead: false,
    createdAt: new Date("2024-02-25")
  },
  {
    id: "notif-2",
    userId: "user-6",
    type: "maintenance_update",
    title: "Maintenance Request Update",
    message: "Your maintenance request has been assigned to a vendor",
    channel: "in_app",
    isRead: true,
    readAt: new Date("2024-03-01"),
    createdAt: new Date("2024-03-01")
  }
]

// Dashboard Statistics
export const mockDashboardStats: DashboardStats = {
  totalProperties: 3,
  totalUnits: 44,
  occupiedUnits: 37,
  occupancyRate: 84.1,
  totalRentCollected: 8200,
  pendingMaintenance: 2,
  overduePayments: 1,
  activeLeases: 3
}

// Mock Move-in Checklists
export const mockMoveInChecklists: MoveInChecklist[] = [
  {
    id: "checklist-1",
    tenantId: "user-4",
    unitId: "unit-1",
    propertyId: "prop-1",
    items: [
      {
        id: "item-1",
        category: "keys",
        title: "Unit Keys Handover",
        description: "Receive keys to the unit and mailbox",
        status: "completed",
        completedAt: new Date("2024-01-15"),
        completedBy: "user-2",
        required: true
      },
      {
        id: "item-2",
        category: "utilities",
        title: "Utility Account Setup",
        description: "Set up electricity, water, and internet accounts",
        status: "completed",
        completedAt: new Date("2024-01-15"),
        completedBy: "user-4",
        required: true
      },
      {
        id: "item-3",
        category: "inspection",
        title: "Unit Walkthrough",
        description: "Complete initial unit inspection with photos",
        status: "completed",
        completedAt: new Date("2024-01-15"),
        completedBy: "user-2",
        required: true
      },
      {
        id: "item-4",
        category: "documentation",
        title: "Lease Agreement Review",
        description: "Review and sign lease agreement",
        status: "completed",
        completedAt: new Date("2024-01-15"),
        completedBy: "user-4",
        required: true
      },
      {
        id: "item-5",
        category: "payment",
        title: "Security Deposit Payment",
        description: "Pay security deposit and first month's rent",
        status: "completed",
        completedAt: new Date("2024-01-15"),
        completedBy: "user-4",
        required: true
      }
    ],
    completedBy: "user-2",
    completedAt: new Date("2024-01-15"),
    notes: "All items completed successfully. Tenant moved in on schedule.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "checklist-2",
    tenantId: "user-5",
    unitId: "unit-2",
    propertyId: "prop-1",
    items: [
      {
        id: "item-6",
        category: "keys",
        title: "Unit Keys Handover",
        description: "Receive keys to the unit and mailbox",
        status: "completed",
        completedAt: new Date("2024-02-01"),
        completedBy: "user-2",
        required: true
      },
      {
        id: "item-7",
        category: "utilities",
        title: "Utility Account Setup",
        description: "Set up electricity, water, and internet accounts",
        status: "pending",
        required: true
      },
      {
        id: "item-8",
        category: "inspection",
        title: "Unit Walkthrough",
        description: "Complete initial unit inspection with photos",
        status: "completed",
        completedAt: new Date("2024-02-01"),
        completedBy: "user-2",
        required: true
      }
    ],
    completedBy: "user-2",
    notes: "Utilities setup pending - tenant will complete this week",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  }
]

// Mock Move-out Inspections
export const mockMoveOutInspections: MoveOutInspection[] = [
  {
    id: "inspection-1",
    tenantId: "user-6",
    unitId: "unit-3",
    propertyId: "prop-1",
    inspectorId: "user-2",
    inspectionDate: new Date("2024-02-28"),
    status: "completed",
    items: [
      {
        id: "insp-item-1",
        category: "cleaning",
        title: "Kitchen Cleaning",
        description: "Kitchen cabinets and appliances",
        condition: "good",
        deductionAmount: 0,
        notes: "Kitchen is clean and well-maintained",
        photos: []
      },
      {
        id: "insp-item-2",
        category: "damage",
        title: "Wall Damage",
        description: "Small hole in living room wall",
        condition: "damaged",
        deductionAmount: 150,
        notes: "Hole needs to be patched and painted",
        photos: []
      },
      {
        id: "insp-item-3",
        category: "keys",
        title: "Key Return",
        description: "Return of unit and mailbox keys",
        condition: "excellent",
        deductionAmount: 0,
        notes: "All keys returned",
        photos: []
      }
    ],
    totalDeductions: 150,
    notes: "Overall condition is good with minor wall damage",
    tenantSignature: "Lisa Brown",
    inspectorSignature: "Sarah Johnson",
    createdAt: new Date("2024-02-28"),
    updatedAt: new Date("2024-02-28")
  }
]

// Mock Security Deposits
export const mockSecurityDeposits: SecurityDeposit[] = [
  {
    id: "deposit-1",
    tenantId: "user-4",
    leaseId: "lease-1",
    unitId: "unit-1",
    propertyId: "prop-1",
    amount: 2200,
    status: "held",
    heldDate: new Date("2024-01-15"),
    deductions: [],
    notes: "Security deposit held for active lease",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "deposit-2",
    tenantId: "user-5",
    leaseId: "lease-2",
    unitId: "unit-2",
    propertyId: "prop-1",
    amount: 2800,
    status: "held",
    heldDate: new Date("2024-02-01"),
    deductions: [],
    notes: "Security deposit held for active lease",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  },
  {
    id: "deposit-3",
    tenantId: "user-6",
    leaseId: "lease-3",
    unitId: "unit-3",
    propertyId: "prop-1",
    amount: 3200,
    status: "pending_refund",
    heldDate: new Date("2023-03-01"),
    refundedDate: new Date("2024-03-15"),
    refundedAmount: 3050,
    deductions: [
      {
        id: "deduction-1",
        amount: 150,
        reason: "Wall damage repair",
        category: "damage",
        description: "Cost to patch and paint wall damage",
        supportingDocuments: [],
        appliedDate: new Date("2024-03-15"),
        appliedBy: "user-2"
      }
    ],
    notes: "Deposit refunded with deduction for wall damage",
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2024-03-15")
  }
]

// Mock Unit Condition Reports
export const mockUnitConditionReports: UnitConditionReport[] = [
  {
    id: "report-1",
    unitId: "unit-1",
    propertyId: "prop-1",
    reportType: "move_in",
    inspectorId: "user-2",
    inspectionDate: new Date("2024-01-15"),
    areas: [
      {
        id: "area-1",
        name: "Living Room",
        category: "living_room",
        condition: "excellent",
        description: "Large living room with hardwood floors and large windows",
        issues: [],
        photos: []
      },
      {
        id: "area-2",
        name: "Kitchen",
        category: "kitchen",
        condition: "excellent",
        description: "Modern kitchen with stainless steel appliances",
        issues: [],
        photos: []
      },
      {
        id: "area-3",
        name: "Master Bedroom",
        category: "bedroom",
        condition: "excellent",
        description: "Spacious master bedroom with walk-in closet",
        issues: [],
        photos: []
      },
      {
        id: "area-4",
        name: "Bathroom",
        category: "bathroom",
        condition: "excellent",
        description: "Updated bathroom with modern fixtures",
        issues: [],
        photos: []
      }
    ],
    overallCondition: "excellent",
    notes: "Unit is in excellent condition. All appliances working properly.",
    photos: [],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "report-2",
    unitId: "unit-3",
    propertyId: "prop-1",
    reportType: "move_out",
    inspectorId: "user-2",
    inspectionDate: new Date("2024-02-28"),
    areas: [
      {
        id: "area-5",
        name: "Living Room",
        category: "living_room",
        condition: "good",
        description: "Living room in good condition with minor wall damage",
        issues: ["Small hole in wall needs repair"],
        photos: [],
        estimatedRepairCost: 150
      },
      {
        id: "area-6",
        name: "Kitchen",
        category: "kitchen",
        condition: "excellent",
        description: "Kitchen clean and well-maintained",
        issues: [],
        photos: []
      },
      {
        id: "area-7",
        name: "Master Bedroom",
        category: "bedroom",
        condition: "excellent",
        description: "Bedroom in excellent condition",
        issues: [],
        photos: []
      },
      {
        id: "area-8",
        name: "Bathroom",
        category: "bathroom",
        condition: "excellent",
        description: "Bathroom clean and well-maintained",
        issues: [],
        photos: []
      }
    ],
    overallCondition: "good",
    notes: "Unit in good condition overall. Minor wall damage noted.",
    photos: [],
    createdAt: new Date("2024-02-28"),
    updatedAt: new Date("2024-02-28")
  }
]

// Helper function to get property by ID
export const getPropertyById = (id: string): Property | undefined => {
  return mockProperties.find(property => property.id === id)
}

// Helper function to get units by property ID
export const getUnitsByPropertyId = (propertyId: string): Unit[] => {
  return mockUnits.filter(unit => unit.propertyId === propertyId)
}

// Helper function to get tenant by ID
export const getTenantById = (id: string): Tenant | undefined => {
  return mockTenants.find(tenant => tenant.id === id)
}

// Helper function to get lease by ID
export const getLeaseById = (id: string): Lease | undefined => {
  return mockLeases.find(lease => lease.id === id)
}

// Helper function to get maintenance requests by property ID
export const getMaintenanceRequestsByPropertyId = (propertyId: string): MaintenanceRequest[] => {
  return mockMaintenanceRequests.filter(request => request.propertyId === propertyId)
}

// Helper function to get payments by property ID
export const getPaymentsByPropertyId = (propertyId: string): Payment[] => {
  return mockPayments.filter(payment => payment.propertyId === propertyId)
}

// Helper function to update lease
export const updateLease = (id: string, updates: Partial<Lease>): Lease | undefined => {
  const leaseIndex = mockLeases.findIndex(lease => lease.id === id)
  if (leaseIndex === -1) return undefined

  mockLeases[leaseIndex] = {
    ...mockLeases[leaseIndex],
    ...updates,
    updatedAt: new Date()
  }

  return mockLeases[leaseIndex]
}

// Helper functions for new data types
export const getMoveInChecklistByTenantId = (tenantId: string): MoveInChecklist | undefined => {
  return mockMoveInChecklists.find(checklist => checklist.tenantId === tenantId)
}

export const getMoveOutInspectionByTenantId = (tenantId: string): MoveOutInspection | undefined => {
  return mockMoveOutInspections.find(inspection => inspection.tenantId === tenantId)
}

export const getSecurityDepositByTenantId = (tenantId: string): SecurityDeposit | undefined => {
  return mockSecurityDeposits.find(deposit => deposit.tenantId === tenantId)
}

export const getUnitConditionReportsByUnitId = (unitId: string): UnitConditionReport[] => {
  return mockUnitConditionReports.filter(report => report.unitId === unitId)
}
