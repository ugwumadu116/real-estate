'use client'

import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Building,
    Home,
    Users,
    DollarSign,
    Wrench,
    AlertTriangle,
    TrendingUp,
    Calendar,
    FileText,
    MessageSquare,
    Plus,
    Eye,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from "lucide-react"
import { ProtectedRoute } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth, useRole } from "@/lib/auth-context"
import {
    mockDashboardStats,
    mockProperties,
    mockMaintenanceRequests,
    mockPayments,
    mockTenants,
    mockPropertyListings,
    mockPropertySales,
    mockBuyers
} from "@/lib/mock-data"
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils"

// Dashboard Stats Cards Component
function DashboardStatsCards() {
    const { user } = useAuth()
    const isAdmin = useRole('admin')
    const isPropertyManager = useRole('property_manager')
    const isLandlord = useRole('landlord')
    const isTenant = useRole('tenant')
    const isVendor = useRole('vendor')

    if (isTenant) {
        // Tenant-specific stats
        const tenantPayments = mockPayments.filter(p => p.tenantId === user?.id)
        const tenantMaintenance = mockMaintenanceRequests.filter(m => m.tenantId === user?.id)
        const overduePayments = tenantPayments.filter(p => p.status === 'overdue')
        const openMaintenance = tenantMaintenance.filter(m => m.status === 'open' || m.status === 'assigned')

        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rent Due</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(2200)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Due March 1st
                        </p>
                        <div className="absolute top-0 right-0 h-16 w-16 bg-primary/10 rounded-full -translate-y-8 translate-x-8" />
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Maintenance</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{openMaintenance.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Active requests
                        </p>
                        <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/10 rounded-full -translate-y-8 translate-x-8" />
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{overduePayments.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Need attention
                        </p>
                        <div className="absolute top-0 right-0 h-16 w-16 bg-red-500/10 rounded-full -translate-y-8 translate-x-8" />
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lease Status</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Active</div>
                        <p className="text-xs text-muted-foreground">
                            Expires Jan 14, 2025
                        </p>
                        <div className="absolute top-0 right-0 h-16 w-16 bg-green-500/10 rounded-full -translate-y-8 translate-x-8" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isVendor) {
        // Vendor-specific stats
        const assignedRequests = mockMaintenanceRequests.filter(m => m.assignedVendorId === user?.id)
        const completedRequests = assignedRequests.filter(m => m.status === 'completed')
        const inProgressRequests = assignedRequests.filter(m => m.status === 'in_progress')

        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressRequests.length}</div>
                        <p className="text-xs text-muted-foreground">
                            In progress
                        </p>
                        <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/10 rounded-full -translate-y-8 translate-x-8" />
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{completedRequests.length}</div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                        <div className="absolute top-0 right-0 h-16 w-16 bg-green-500/10 rounded-full -translate-y-8 translate-x-8" />
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.8</div>
                        <p className="text-xs text-muted-foreground">
                            Out of 5 stars
                        </p>
                        <div className="absolute top-0 right-0 h-16 w-16 bg-yellow-500/10 rounded-full -translate-y-8 translate-x-8" />
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                        <p className="text-xs text-muted-foreground">
                            All time
                        </p>
                        <div className="absolute top-0 right-0 h-16 w-16 bg-purple-500/10 rounded-full -translate-y-8 translate-x-8" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Admin, Property Manager, and Landlord stats
    const activeListings = mockPropertyListings.filter(l => l.status === 'active')
    const underContractSales = mockPropertySales.filter(s => s.status === 'under_contract')
    const qualifiedBuyers = mockBuyers.filter(b => b.status === 'qualified')
    const totalSalesValue = mockPropertySales.reduce((sum, sale) => sum + sale.acceptedPrice, 0)

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{mockDashboardStats.totalProperties}</div>
                    <p className="text-xs text-muted-foreground">
                        Managed properties
                    </p>
                    <div className="absolute top-0 right-0 h-16 w-16 bg-primary/10 rounded-full -translate-y-8 translate-x-8" />
                </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeListings.length}</div>
                    <p className="text-xs text-muted-foreground">
                        Properties for sale
                    </p>
                    <div className="absolute top-0 right-0 h-16 w-16 bg-green-500/10 rounded-full -translate-y-8 translate-x-8" />
                </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Under Contract</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{underContractSales.length}</div>
                    <p className="text-xs text-muted-foreground">
                        Sales in progress
                    </p>
                    <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/10 rounded-full -translate-y-8 translate-x-8" />
                </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalSalesValue)}</div>
                    <p className="text-xs text-muted-foreground">
                        All time sales
                    </p>
                    <div className="absolute top-0 right-0 h-16 w-16 bg-yellow-500/10 rounded-full -translate-y-8 translate-x-8" />
                </CardContent>
            </Card>
        </div>
    )
}

// Recent Activity Component
function RecentActivity() {
    const { user } = useAuth()
    const isTenant = useRole('tenant')
    const isVendor = useRole('vendor')

    if (isTenant) {
        const tenantMaintenance = mockMaintenanceRequests
            .filter(m => m.tenantId === user?.id)
            .slice(0, 5)

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Recent Maintenance Requests
                        <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View All
                        </Button>
                    </CardTitle>
                    <CardDescription>Your latest maintenance activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {tenantMaintenance.map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">{request.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(request.createdAt)}
                                    </p>
                                </div>
                                <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                                    {request.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (isVendor) {
        const vendorRequests = mockMaintenanceRequests
            .filter(m => m.assignedVendorId === user?.id)
            .slice(0, 5)

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Recent Assignments
                        <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View All
                        </Button>
                    </CardTitle>
                    <CardDescription>Your latest maintenance assignments</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {vendorRequests.map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">{request.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(request.createdAt)}
                                    </p>
                                </div>
                                <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                                    {request.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Admin, Property Manager, and Landlord activity
    const recentMaintenance = mockMaintenanceRequests.slice(0, 5)
    const recentPayments = mockPayments.slice(0, 5)

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Recent Maintenance
                        <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View All
                        </Button>
                    </CardTitle>
                    <CardDescription>Latest maintenance requests</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentMaintenance.map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">{request.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(request.createdAt)}
                                    </p>
                                </div>
                                <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                                    {request.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Recent Payments
                        <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View All
                        </Button>
                    </CardTitle>
                    <CardDescription>Latest payment activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentPayments.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        {formatCurrency(payment.amount)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(payment.dueDate)}
                                    </p>
                                </div>
                                <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                                    {payment.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Quick Actions Component
function QuickActions() {
    const { user } = useAuth()
    const isTenant = useRole('tenant')
    const isVendor = useRole('vendor')
    const isAdmin = useRole('admin')
    const isPropertyManager = useRole('property_manager')

    if (isTenant) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks for tenants</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3">
                        <Button variant="outline" className="justify-start h-12">
                            <Wrench className="mr-3 h-4 w-4" />
                            Submit Maintenance Request
                        </Button>
                        <Button variant="outline" className="justify-start h-12">
                            <DollarSign className="mr-3 h-4 w-4" />
                            Make Payment
                        </Button>
                        <Button variant="outline" className="justify-start h-12">
                            <MessageSquare className="mr-3 h-4 w-4" />
                            Contact Property Manager
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (isVendor) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks for vendors</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3">
                        <Button variant="outline" className="justify-start h-12">
                            <Wrench className="mr-3 h-4 w-4" />
                            View Assignments
                        </Button>
                        <Button variant="outline" className="justify-start h-12">
                            <MessageSquare className="mr-3 h-4 w-4" />
                            Contact Property Manager
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common management tasks</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3">
                    {(isAdmin || isPropertyManager) && (
                        <>
                            <Button variant="outline" className="justify-start h-12">
                                <Plus className="mr-3 h-4 w-4" />
                                Add New Property
                            </Button>
                            <Button variant="outline" className="justify-start h-12">
                                <Users className="mr-3 h-4 w-4" />
                                Add New Tenant
                            </Button>
                            <Button variant="outline" className="justify-start h-12">
                                <FileText className="mr-3 h-4 w-4" />
                                Create Lease
                            </Button>
                        </>
                    )}
                    <Button variant="outline" className="justify-start h-12">
                        <Wrench className="mr-3 h-4 w-4" />
                        View Maintenance Requests
                    </Button>
                    <Button variant="outline" className="justify-start h-12">
                        <DollarSign className="mr-3 h-4 w-4" />
                        View Payments
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

// Analytics Overview Component
function AnalyticsOverview() {
    const { user } = useAuth()
    const isTenant = useRole('tenant')
    const isVendor = useRole('vendor')

    if (isTenant || isVendor) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Occupancy Rate</span>
                            <span className="text-sm text-muted-foreground">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Rent Collection</span>
                            <span className="text-sm text-muted-foreground">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Maintenance Response</span>
                            <span className="text-sm text-muted-foreground">2.3 days</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: '75%' }} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Tenant Satisfaction</span>
                            <span className="text-sm text-muted-foreground">4.6/5</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: '92%' }} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Loading Component
function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                            <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

// Main Dashboard Component
function DashboardContent() {
    const { user } = useAuth()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.name}! Here's what's happening with your properties.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Today
                    </Button>
                    <Button>
                        <Activity className="mr-2 h-4 w-4" />
                        View Reports
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <DashboardStatsCards />

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <RecentActivity />
                    <AnalyticsOverview />
                </div>
                <div className="space-y-6">
                    <QuickActions />
                </div>
            </div>
        </div>
    )
}

// Main Page Component
export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <Suspense fallback={<DashboardLoading />}>
                    <DashboardContent />
                </Suspense>
            </DashboardLayout>
        </ProtectedRoute>
    )
} 