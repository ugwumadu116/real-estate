import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  Property,
  Unit,
  Tenant,
  Lease,
  MaintenanceRequest,
  Payment,
  UnitStatus,
  MaintenanceStatus,
  PaymentStatus,
  MaintenancePriority
} from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = new Date(date)

  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }

  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    case 'long':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    case 'time':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    default:
      return d.toLocaleDateString()
  }
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
  }

  return formatDate(d, 'short')
}

// Currency formatting
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

// Status utilities
export function getStatusColor(status: UnitStatus | MaintenanceStatus | PaymentStatus | MaintenancePriority): string {
  const statusColors = {
    // Unit Status
    available: 'bg-green-100 text-green-800 border-green-200',
    occupied: 'bg-blue-100 text-blue-800 border-blue-200',
    under_maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
    reserved: 'bg-purple-100 text-purple-800 border-purple-200',

    // Maintenance Status
    open: 'bg-blue-100 text-blue-800 border-blue-200',
    assigned: 'bg-purple-100 text-purple-800 border-purple-200',
    in_progress: 'bg-orange-100 text-orange-800 border-orange-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',

    // Payment Status
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    late: 'bg-orange-100 text-orange-800 border-orange-200',
    overdue: 'bg-red-100 text-red-800 border-red-200',

    // Maintenance Priority
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    emergency: 'bg-red-100 text-red-800 border-red-200'
  }

  return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// Property utilities
export function getPropertyAddress(property: Property): string {
  const { address } = property
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
}

export function getPropertyFullAddress(property: Property): string {
  const { address } = property
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`
}

export function calculateOccupancyRate(property: Property): number {
  if (property.totalUnits === 0) return 0
  return Math.round((property.occupiedUnits / property.totalUnits) * 100)
}

// Unit utilities
export function getUnitDisplayName(unit: Unit): string {
  return `Unit ${unit.number}`
}

export function getUnitFullName(unit: Unit, property?: Property): string {
  const unitName = getUnitDisplayName(unit)
  if (property) {
    return `${property.name} - ${unitName}`
  }
  return unitName
}

// Tenant utilities
export function getTenantFullName(tenant: Tenant): string {
  return tenant.name
}

export function getTenantContactInfo(tenant: Tenant): string {
  return `${tenant.email} | ${tenant.phone}`
}

// Lease utilities
export function isLeaseActive(lease: Lease): boolean {
  const now = new Date()
  return lease.status === 'active' &&
    lease.startDate <= now &&
    lease.endDate >= now
}

export function isLeaseExpiringSoon(lease: Lease, days: number = 30): boolean {
  if (!isLeaseActive(lease)) return false

  const now = new Date()
  const expiryDate = new Date(lease.endDate)
  const diffTime = expiryDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays <= days && diffDays > 0
}

export function getLeaseDuration(lease: Lease): string {
  const start = new Date(lease.startDate)
  const end = new Date(lease.endDate)
  const diffTime = end.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 30) {
    return `${diffDays} days`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months > 1 ? 's' : ''}`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} year${years > 1 ? 's' : ''}`
  }
}

// Payment utilities
export function isPaymentOverdue(payment: Payment): boolean {
  if (payment.status === 'paid') return false

  const now = new Date()
  const dueDate = new Date(payment.dueDate)
  return now > dueDate
}

export function calculateLateFee(payment: Payment, dailyRate: number = 5): number {
  if (payment.status === 'paid' || !isPaymentOverdue(payment)) return 0

  const now = new Date()
  const dueDate = new Date(payment.dueDate)
  const diffTime = now.getTime() - dueDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays * dailyRate)
}

export function getTotalPaymentAmount(payment: Payment): number {
  let total = payment.amount
  if (payment.lateFee) {
    total += payment.lateFee
  }
  return total
}

// Maintenance utilities
export function getMaintenancePriorityColor(priority: MaintenancePriority): string {
  const colors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    emergency: 'text-red-600'
  }
  return colors[priority] || 'text-gray-600'
}

export function getMaintenanceStatusColor(status: MaintenanceStatus): string {
  const colors = {
    open: 'text-blue-600',
    assigned: 'text-purple-600',
    in_progress: 'text-orange-600',
    completed: 'text-green-600',
    cancelled: 'text-gray-600'
  }
  return colors[status] || 'text-gray-600'
}

// Search and filter utilities
export function searchProperties(properties: Property[], query: string): Property[] {
  if (!query.trim()) return properties

  const searchTerm = query.toLowerCase()
  return properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm) ||
    getPropertyAddress(property).toLowerCase().includes(searchTerm) ||
    property.description.toLowerCase().includes(searchTerm)
  )
}

export function searchTenants(tenants: Tenant[], query: string): Tenant[] {
  if (!query.trim()) return tenants

  const searchTerm = query.toLowerCase()
  return tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm) ||
    tenant.email.toLowerCase().includes(searchTerm) ||
    tenant.phone.includes(searchTerm)
  )
}

export function filterUnitsByStatus(units: Unit[], status: UnitStatus): Unit[] {
  return units.filter(unit => unit.status === status)
}

export function filterMaintenanceByStatus(requests: MaintenanceRequest[], status: MaintenanceStatus): MaintenanceRequest[] {
  return requests.filter(request => request.status === status)
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function isValidZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zipCode)
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// Number utilities
export function roundToDecimals(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return roundToDecimals((part / total) * 100, 1)
}

// String utilities
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// Time utilities
export function getDaysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay))
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
}
