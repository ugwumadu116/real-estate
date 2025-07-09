import { UserRole, PropertyType, UnitStatus, MaintenancePriority, MaintenanceStatus, PaymentStatus } from './types'

// Role Permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    admin: ['all'],
    property_manager: [
        'properties',
        'units',
        'tenants',
        'leases',
        'maintenance',
        'payments',
        'reports',
        'messages',
        'notifications'
    ],
    landlord: [
        'properties',
        'units',
        'tenants',
        'leases',
        'payments',
        'reports'
    ],
    tenant: [
        'own_lease',
        'own_payments',
        'maintenance_requests',
        'messages',
        'notifications'
    ],
    vendor: [
        'maintenance_assignments',
        'maintenance_updates',
        'messages'
    ]
}

// Property Types
export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'apartment_block', label: 'Apartment Block' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'terrace', label: 'Terrace' },
    { value: 'semi_detached_duplex', label: 'Semi Detached Duplex' },
    { value: 'fully_detached_duplex', label: 'Fully Detached Duplex' },
    { value: 'land', label: 'Land' }
]

// Unit Types
export const UNIT_TYPES = [
    { value: 'studio', label: 'Studio' },
    { value: '1br', label: '1 Bedroom' },
    { value: '2br', label: '2 Bedrooms' },
    { value: '3br', label: '3 Bedrooms' },
    { value: '4br', label: '4 Bedrooms' },
    { value: 'penthouse', label: 'Penthouse' }
]



// Unit Status Options
export const UNIT_STATUS_OPTIONS: { value: UnitStatus; label: string; color: string }[] = [
    { value: 'available', label: 'Available', color: 'green' },
    { value: 'occupied', label: 'Occupied', color: 'blue' },
    { value: 'under_maintenance', label: 'Under Maintenance', color: 'orange' },
    { value: 'reserved', label: 'Reserved', color: 'purple' }
]

// Maintenance Priority Options
export const MAINTENANCE_PRIORITY_OPTIONS: { value: MaintenancePriority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'emergency', label: 'Emergency', color: 'red' }
]

// Maintenance Status Options
export const MAINTENANCE_STATUS_OPTIONS: { value: MaintenanceStatus; label: string; color: string }[] = [
    { value: 'open', label: 'Open', color: 'blue' },
    { value: 'assigned', label: 'Assigned', color: 'purple' },
    { value: 'in_progress', label: 'In Progress', color: 'orange' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'gray' }
]

// Payment Status Options
export const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'paid', label: 'Paid', color: 'green' },
    { value: 'late', label: 'Late', color: 'orange' },
    { value: 'overdue', label: 'Overdue', color: 'red' },
    { value: 'cancelled', label: 'Cancelled', color: 'gray' }
]

// Maintenance Categories
export const MAINTENANCE_CATEGORIES = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'appliance', label: 'Appliance' },
    { value: 'structural', label: 'Structural' },
    { value: 'pest_control', label: 'Pest Control' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'other', label: 'Other' }
]

// Payment Types
export const PAYMENT_TYPES = [
    { value: 'rent', label: 'Rent' },
    { value: 'deposit', label: 'Deposit' },
    { value: 'late_fee', label: 'Late Fee' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'utility', label: 'Utility' },
    { value: 'other', label: 'Other' }
]

// Payment Methods
export const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'online', label: 'Online' }
]

// Lease Types
export const LEASE_TYPES = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom' }
]

// Common Amenities
export const COMMON_AMENITIES = [
    'Pool',
    'Gym',
    'Parking',
    'Security',
    'Elevator',
    'Balcony',
    'In-unit Laundry',
    'Dishwasher',
    'Walk-in Closet',
    'Rooftop Access',
    'Storage',
    'Bike Room',
    'Package Receiving',
    'Private Yards',
    'Garage',
    'Community Pool',
    'Playground',
    'Exposed Brick',
    'High Ceilings',
    'Large Windows',
    'Built-in Storage'
]

// Navigation Items by Role
export const NAVIGATION_ITEMS = {
    admin: [
        { href: '/dashboard', label: 'Dashboard', icon: 'Home' },
        { href: '/properties', label: 'Properties', icon: 'Building' },
        { href: '/tenants', label: 'Tenants', icon: 'Users' },
        { href: '/leases', label: 'Leases', icon: 'FileText' },
        { href: '/payments', label: 'Payments', icon: 'CreditCard' },
        { href: '/maintenance', label: 'Maintenance', icon: 'Wrench' },
        { href: '/vendors', label: 'Vendors', icon: 'Truck' },
        { href: '/reports', label: 'Reports', icon: 'BarChart' },
        { href: '/messages', label: 'Messages', icon: 'MessageSquare' },
        { href: '/settings', label: 'Settings', icon: 'Settings' }
    ],
    property_manager: [
        { href: '/dashboard', label: 'Dashboard', icon: 'Home' },
        { href: '/properties', label: 'Properties', icon: 'Building' },
        { href: '/tenants', label: 'Tenants', icon: 'Users' },
        { href: '/leases', label: 'Leases', icon: 'FileText' },
        { href: '/payments', label: 'Payments', icon: 'CreditCard' },
        { href: '/maintenance', label: 'Maintenance', icon: 'Wrench' },
        { href: '/vendors', label: 'Vendors', icon: 'Truck' },
        { href: '/reports', label: 'Reports', icon: 'BarChart' },
        { href: '/messages', label: 'Messages', icon: 'MessageSquare' }
    ],
    landlord: [
        { href: '/dashboard', label: 'Dashboard', icon: 'Home' },
        { href: '/properties', label: 'Properties', icon: 'Building' },
        { href: '/tenants', label: 'Tenants', icon: 'Users' },
        { href: '/leases', label: 'Leases', icon: 'FileText' },
        { href: '/payments', label: 'Payments', icon: 'CreditCard' },
        { href: '/reports', label: 'Reports', icon: 'BarChart' }
    ],
    tenant: [
        { href: '/dashboard', label: 'Dashboard', icon: 'Home' },
        { href: '/my-lease', label: 'My Lease', icon: 'FileText' },
        { href: '/my-payments', label: 'My Payments', icon: 'CreditCard' },
        { href: '/maintenance', label: 'Maintenance', icon: 'Wrench' },
        { href: '/messages', label: 'Messages', icon: 'MessageSquare' }
    ],
    vendor: [
        { href: '/dashboard', label: 'Dashboard', icon: 'Home' },
        { href: '/assignments', label: 'Assignments', icon: 'Wrench' },
        { href: '/messages', label: 'Messages', icon: 'MessageSquare' }
    ]
}

// Dashboard Cards by Role
export const DASHBOARD_CARDS = {
    admin: [
        { title: 'Total Properties', key: 'totalProperties', icon: 'Building', color: 'blue' },
        { title: 'Total Units', key: 'totalUnits', icon: 'Home', color: 'green' },
        { title: 'Occupancy Rate', key: 'occupancyRate', icon: 'Percent', color: 'purple', format: 'percentage' },
        { title: 'Total Rent Collected', key: 'totalRentCollected', icon: 'DollarSign', color: 'green', format: 'currency' },
        { title: 'Pending Maintenance', key: 'pendingMaintenance', icon: 'Wrench', color: 'orange' },
        { title: 'Overdue Payments', key: 'overduePayments', icon: 'AlertTriangle', color: 'red' }
    ],
    property_manager: [
        { title: 'My Properties', key: 'totalProperties', icon: 'Building', color: 'blue' },
        { title: 'Total Units', key: 'totalUnits', icon: 'Home', color: 'green' },
        { title: 'Occupancy Rate', key: 'occupancyRate', icon: 'Percent', color: 'purple', format: 'percentage' },
        { title: 'Rent Collected', key: 'totalRentCollected', icon: 'DollarSign', color: 'green', format: 'currency' },
        { title: 'Pending Maintenance', key: 'pendingMaintenance', icon: 'Wrench', color: 'orange' },
        { title: 'Overdue Payments', key: 'overduePayments', icon: 'AlertTriangle', color: 'red' }
    ],
    landlord: [
        { title: 'My Properties', key: 'totalProperties', icon: 'Building', color: 'blue' },
        { title: 'Total Units', key: 'totalUnits', icon: 'Home', color: 'green' },
        { title: 'Occupancy Rate', key: 'occupancyRate', icon: 'Percent', color: 'purple', format: 'percentage' },
        { title: 'Monthly Income', key: 'totalRentCollected', icon: 'DollarSign', color: 'green', format: 'currency' },
        { title: 'Active Leases', key: 'activeLeases', icon: 'FileText', color: 'blue' }
    ],
    tenant: [
        { title: 'My Unit', key: 'currentUnit', icon: 'Home', color: 'blue' },
        { title: 'Rent Due', key: 'rentDue', icon: 'DollarSign', color: 'orange', format: 'currency' },
        { title: 'Lease Status', key: 'leaseStatus', icon: 'FileText', color: 'green' },
        { title: 'Open Maintenance', key: 'openMaintenance', icon: 'Wrench', color: 'orange' }
    ],
    vendor: [
        { title: 'Active Assignments', key: 'activeAssignments', icon: 'Wrench', color: 'blue' },
        { title: 'Completed Jobs', key: 'completedJobs', icon: 'CheckCircle', color: 'green' },
        { title: 'Average Rating', key: 'averageRating', icon: 'Star', color: 'yellow' }
    ]
}

// Table Columns Configuration
export const TABLE_COLUMNS = {
    properties: [
        { key: 'name', label: 'Property Name', sortable: true },
        { key: 'address', label: 'Address', sortable: false },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'totalUnits', label: 'Total Units', sortable: true },
        { key: 'occupiedUnits', label: 'Occupied', sortable: true },
        { key: 'occupancyRate', label: 'Occupancy Rate', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ],
    units: [
        { key: 'number', label: 'Unit Number', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'bedrooms', label: 'Bedrooms', sortable: true },
        { key: 'bathrooms', label: 'Bathrooms', sortable: true },
        { key: 'area', label: 'Area (sq ft)', sortable: true },
        { key: 'rent', label: 'Rent', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ],
    tenants: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phone', label: 'Phone', sortable: false },
        { key: 'currentUnit', label: 'Current Unit', sortable: true },
        { key: 'moveInDate', label: 'Move-in Date', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ],
    maintenance: [
        { key: 'title', label: 'Title', sortable: true },
        { key: 'category', label: 'Category', sortable: true },
        { key: 'priority', label: 'Priority', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'assignedVendor', label: 'Assigned Vendor', sortable: true },
        { key: 'createdAt', label: 'Created', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ],
    payments: [
        { key: 'tenant', label: 'Tenant', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'dueDate', label: 'Due Date', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'method', label: 'Method', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ]
}

// Form Validation Rules
export const VALIDATION_RULES = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    phone: {
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        message: 'Please enter a valid phone number'
    },
    zipCode: {
        pattern: /^\d{5}(-\d{4})?$/,
        message: 'Please enter a valid ZIP code'
    },
    rent: {
        min: 0,
        message: 'Rent must be a positive number'
    },
    area: {
        min: 0,
        message: 'Area must be a positive number'
    }
}

// Date Formats
export const DATE_FORMATS = {
    display: 'MMM dd, yyyy',
    input: 'yyyy-MM-dd',
    time: 'MMM dd, yyyy HH:mm',
    short: 'MM/dd/yyyy'
}

// Currency Format
export const CURRENCY_FORMAT = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
}

// Pagination
export const PAGINATION = {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50]
}

// File Upload
export const FILE_UPLOAD = {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxFiles: 5
} 