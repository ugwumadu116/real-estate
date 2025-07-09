// User and Authentication Types
export type UserRole = 'admin' | 'property_manager' | 'landlord' | 'tenant' | 'vendor'

export interface User {
    id: string
    name: string
    email: string
    phone?: string
    role: UserRole
    avatar?: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    permissions: string[]
}

// Property Management Types
export type PropertyType = 'apartment' | 'house' | 'condo' | 'townhouse' | 'commercial' | 'apartment_block' | 'duplex' | 'terrace' | 'semi_detached_duplex' | 'fully_detached_duplex' | 'land'
export type PropertyStatus = 'active' | 'inactive' | 'maintenance' | 'development' | 'for_sale' | 'sold' | 'under_contract'

export interface Property {
    id: string
    name: string
    address: {
        street: string
        city: string
        state: string
        zipCode: string
        country: string
    }
    type: PropertyType
    status: PropertyStatus
    description: string
    images: string[]
    documents: Document[]
    units: Unit[]
    totalUnits: number
    occupiedUnits: number
    propertyManagerId: string
    ownerId: string
    yearBuilt?: number
    amenities: string[]
    coordinates: {
        lat: number
        lng: number
    }
    createdAt: Date
    updatedAt: Date
}

// Unit Management Types
export type UnitType = 'studio' | '1br' | '2br' | '3br' | '4br' | 'penthouse'
export type UnitStatus = 'available' | 'occupied' | 'under_maintenance' | 'reserved'

export interface Unit {
    id: string
    propertyId: string
    number: string
    type: UnitType
    bedrooms: number
    bathrooms: number
    area: number // in square feet
    rent: number
    deposit: number
    status: UnitStatus
    floor?: number
    description?: string
    images: string[]
    amenities: string[]
    currentTenantId?: string
    currentLeaseId?: string
    createdAt: Date
    updatedAt: Date
}

// Tenant Management Types
export interface Tenant {
    id: string
    name: string
    email: string
    phone: string
    dateOfBirth?: Date
    emergencyContact?: {
        name: string
        phone: string
        relationship: string
    }
    documents: Document[]
    currentUnitId?: string
    currentLeaseId?: string
    isActive: boolean
    moveInDate?: Date
    moveOutDate?: Date
    createdAt: Date
    updatedAt: Date
}

// Lease Management Types
export type LeaseStatus = 'active' | 'expired' | 'terminated' | 'pending'
export type LeaseType = 'monthly' | 'quarterly' | 'yearly' | 'custom'

export interface Lease {
    id: string
    tenantId: string
    unitId: string
    propertyId: string
    startDate: Date
    endDate: Date
    rent: number
    deposit: number
    status: LeaseStatus
    type: LeaseType
    documents: Document[]
    terms: string
    lateFee: number
    gracePeriod: number // in days
    autoRenew: boolean
    renewalTerms?: string
    createdAt: Date
    updatedAt: Date
}

// Maintenance Management Types
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'emergency'
export type MaintenanceStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
export type MaintenanceCategory = 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'pest_control' | 'cleaning' | 'other'

export interface MaintenanceRequest {
    id: string
    unitId: string
    propertyId: string
    tenantId: string
    title: string
    description: string
    category: MaintenanceCategory
    priority: MaintenancePriority
    status: MaintenanceStatus
    assignedVendorId?: string
    estimatedCost?: number
    actualCost?: number
    scheduledDate?: Date
    completedDate?: Date
    images: string[]
    tenantNotes?: string
    vendorNotes?: string
    createdAt: Date
    updatedAt: Date
}

// Vendor Management Types
export interface Vendor {
    id: string
    name: string
    email: string
    phone: string
    specialties: MaintenanceCategory[]
    rating: number
    totalJobs: number
    isActive: boolean
    address?: string
    licenseNumber?: string
    insuranceInfo?: string
    createdAt: Date
    updatedAt: Date
}

// Financial Management Types
export type PaymentStatus = 'pending' | 'paid' | 'late' | 'overdue' | 'cancelled'
export type PaymentType = 'rent' | 'deposit' | 'late_fee' | 'maintenance' | 'utility' | 'other'

export interface Payment {
    id: string
    tenantId: string
    leaseId: string
    unitId: string
    propertyId: string
    amount: number
    type: PaymentType
    dueDate: Date
    paidDate?: Date
    status: PaymentStatus
    method?: 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'online'
    reference?: string
    notes?: string
    lateFee?: number
    createdAt: Date
    updatedAt: Date
}

// Document Management Types
export interface Document {
    id: string
    name: string
    type: string
    url: string
    size: number
    uploadedBy: string
    uploadedAt: Date
    expiresAt?: Date
}

// Communication Types
export type MessageType = 'direct' | 'group' | 'broadcast'
export type MessageStatus = 'sent' | 'delivered' | 'read'

export interface Message {
    id: string
    senderId: string
    recipientIds: string[]
    type: MessageType
    subject?: string
    content: string
    status: MessageStatus
    readAt?: Date
    createdAt: Date
}

// Notification Types
export type NotificationType = 'rent_due' | 'maintenance_update' | 'lease_renewal' | 'payment_received' | 'general'
export type NotificationChannel = 'email' | 'sms' | 'in_app'

export interface Notification {
    id: string
    userId: string
    type: NotificationType
    title: string
    message: string
    channel: NotificationChannel
    isRead: boolean
    readAt?: Date
    createdAt: Date
}

// Dashboard and Analytics Types
export interface DashboardStats {
    totalProperties: number
    totalUnits: number
    occupiedUnits: number
    occupancyRate: number
    totalRentCollected: number
    pendingMaintenance: number
    overduePayments: number
    activeLeases: number
}

export interface PropertyStats {
    propertyId: string
    totalUnits: number
    occupiedUnits: number
    occupancyRate: number
    monthlyRent: number
    collectedRent: number
    pendingMaintenance: number
    overduePayments: number
}

// Form and UI Types
export interface FormField {
    name: string
    label: string
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'file'
    required: boolean
    options?: { value: string; label: string }[]
    validation?: {
        min?: number
        max?: number
        pattern?: string
        message?: string
    }
}

export interface TableColumn {
    key: string
    label: string
    sortable?: boolean
    filterable?: boolean
    width?: string
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

// Filter and Search Types
export interface PropertyFilters {
    type?: PropertyType
    status?: PropertyStatus
    minRent?: number
    maxRent?: number
    location?: string
    amenities?: string[]
}

export interface TenantFilters {
    isActive?: boolean
    hasOverduePayments?: boolean
    propertyId?: string
    search?: string
}

export interface MaintenanceFilters {
    status?: MaintenanceStatus
    priority?: MaintenancePriority
    category?: MaintenanceCategory
    propertyId?: string
    assignedVendorId?: string
}

// Move-in/Move-out Process Types
export type ChecklistStatus = 'pending' | 'completed' | 'skipped'
export type InspectionStatus = 'pending' | 'in_progress' | 'completed' | 'approved'
export type DepositStatus = 'held' | 'refunded' | 'deducted' | 'pending_refund'

export interface MoveInChecklist {
    id: string
    tenantId: string
    unitId: string
    propertyId: string
    items: ChecklistItem[]
    completedBy: string
    completedAt?: Date
    notes?: string
    createdAt: Date
    updatedAt: Date
}

export interface ChecklistItem {
    id: string
    category: 'keys' | 'utilities' | 'inspection' | 'documentation' | 'payment'
    title: string
    description: string
    status: ChecklistStatus
    completedAt?: Date
    completedBy?: string
    notes?: string
    required: boolean
}

export interface MoveOutInspection {
    id: string
    tenantId: string
    unitId: string
    propertyId: string
    inspectorId: string
    inspectionDate: Date
    status: InspectionStatus
    items: InspectionItem[]
    totalDeductions: number
    notes?: string
    tenantSignature?: string
    inspectorSignature?: string
    createdAt: Date
    updatedAt: Date
}

export interface InspectionItem {
    id: string
    category: 'cleaning' | 'damage' | 'maintenance' | 'keys' | 'utilities'
    title: string
    description: string
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged'
    deductionAmount: number
    notes?: string
    photos: string[]
}

export interface SecurityDeposit {
    id: string
    tenantId: string
    leaseId: string
    unitId: string
    propertyId: string
    amount: number
    status: DepositStatus
    heldDate: Date
    refundedDate?: Date
    refundedAmount?: number
    deductions: DepositDeduction[]
    notes?: string
    createdAt: Date
    updatedAt: Date
}

export interface DepositDeduction {
    id: string
    amount: number
    reason: string
    category: 'damage' | 'cleaning' | 'unpaid_rent' | 'utilities' | 'other'
    description: string
    supportingDocuments: string[]
    appliedDate: Date
    appliedBy: string
}

export interface UnitConditionReport {
    id: string
    unitId: string
    propertyId: string
    reportType: 'move_in' | 'move_out' | 'periodic'
    inspectorId: string
    inspectionDate: Date
    areas: ConditionArea[]
    overallCondition: 'excellent' | 'good' | 'fair' | 'poor'
    notes?: string
    photos: string[]
    createdAt: Date
    updatedAt: Date
}

export interface ConditionArea {
    id: string
    name: string
    category: 'living_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'hallway' | 'balcony' | 'storage'
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged'
    description: string
    issues: string[]
    photos: string[]
    estimatedRepairCost?: number
}

// Property Selling Types
export type ListingStatus = 'draft' | 'active' | 'pending' | 'under_contract' | 'sold' | 'expired' | 'cancelled'
export type SaleStatus = 'pending' | 'under_contract' | 'closing' | 'completed' | 'cancelled'
export type BuyerStatus = 'prospect' | 'interested' | 'qualified' | 'under_contract' | 'closed' | 'lost'

export interface PropertyListing {
    id: string
    propertyId: string
    title: string
    description: string
    listingPrice: number
    originalPrice?: number
    status: ListingStatus
    listingDate: Date
    expiryDate?: Date
    featured: boolean
    images: string[]
    documents: Document[]
    features: string[]
    propertyHighlights: string[]
    showingInstructions?: string
    agentId: string
    views: number
    inquiries: number
    createdAt: Date
    updatedAt: Date
}

export interface Buyer {
    id: string
    name: string
    email: string
    phone: string
    status: BuyerStatus
    budget: {
        min: number
        max: number
    }
    preferences: {
        propertyTypes: PropertyType[]
        locations: string[]
        bedrooms?: number
        bathrooms?: number
        minArea?: number
        maxArea?: number
    }
    financing: {
        preApproved: boolean
        preApprovalAmount?: number
        lender?: string
        downPayment?: number
    }
    notes?: string
    assignedAgentId?: string
    createdAt: Date
    updatedAt: Date
}

export interface PropertySale {
    id: string
    propertyId: string
    listingId: string
    buyerId: string
    sellerId: string
    agentId: string
    status: SaleStatus
    offerPrice: number
    acceptedPrice: number
    earnestMoney: number
    closingDate: Date
    actualClosingDate?: Date
    commission: {
        agentCommission: number
        totalCommission: number
    }
    documents: Document[]
    timeline: SaleTimelineEvent[]
    notes?: string
    createdAt: Date
    updatedAt: Date
}

export interface SaleTimelineEvent {
    id: string
    title: string
    description: string
    date: Date
    status: 'pending' | 'completed' | 'overdue'
    assignedTo?: string
    notes?: string
}

export interface PropertyInquiry {
    id: string
    listingId: string
    buyerId: string
    message: string
    preferredContactMethod: 'email' | 'phone' | 'text'
    preferredTime?: string
    status: 'new' | 'contacted' | 'scheduled' | 'showed' | 'followed_up' | 'closed'
    scheduledShowing?: Date
    notes?: string
    createdAt: Date
    updatedAt: Date
}

export interface PropertyShowing {
    id: string
    listingId: string
    buyerId: string
    agentId: string
    scheduledDate: Date
    duration: number // in minutes
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
    feedback?: {
        rating: number
        comments: string
        interested: boolean
        offerLikelihood: 'low' | 'medium' | 'high'
    }
    notes?: string
    createdAt: Date
    updatedAt: Date
}

export interface PropertyOffer {
    id: string
    listingId: string
    buyerId: string
    amount: number
    earnestMoney: number
    financing: {
        type: 'cash' | 'conventional' | 'fha' | 'va' | 'usda'
        preApproved: boolean
        lender?: string
        downPayment: number
    }
    contingencies: {
        inspection: boolean
        appraisal: boolean
        financing: boolean
        saleOfBuyerHome: boolean
        other?: string
    }
    closingDate: Date
    status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired'
    counterOffer?: {
        amount: number
        terms: string
        expiryDate: Date
    }
    notes?: string
    createdAt: Date
    updatedAt: Date
} 