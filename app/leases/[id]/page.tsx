"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    ArrowLeft,
    Edit,
    FileText,
    Users,
    Home,
    DollarSign,
    Calendar,
    MapPin,
    Phone,
    Mail,
    AlertTriangle,
    CheckCircle,
    Clock,
    X,
    Download,
    Printer
} from "lucide-react"
import { mockLeases, mockTenants, mockUnits, mockProperties, mockPayments } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import { LeaseStatus } from "@/lib/types"
import Link from "next/link"
import { format } from "date-fns"

export default function LeaseDetailsPage() {
    const params = useParams()
    const leaseId = params.id as string

    const lease = mockLeases.find((l) => l.id === leaseId)
    const tenant = lease ? mockTenants.find((t) => t.id === lease.tenantId) : null
    const unit = lease ? mockUnits.find((u) => u.id === lease.unitId) : null
    const property = unit ? mockProperties.find((p) => p.id === unit.propertyId) : null
    const payments = lease ? mockPayments.filter((p) => p.leaseId === lease.id) : []

    const getStatusColor = (status: LeaseStatus) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800"
            case "expired": return "bg-red-100 text-red-800"
            case "terminated": return "bg-gray-100 text-gray-800"
            case "pending": return "bg-yellow-100 text-yellow-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusIcon = (status: LeaseStatus) => {
        switch (status) {
            case "active": return <CheckCircle className="h-4 w-4" />
            case "expired": return <X className="h-4 w-4" />
            case "terminated": return <X className="h-4 w-4" />
            case "pending": return <Clock className="h-4 w-4" />
            default: return <FileText className="h-4 w-4" />
        }
    }

    const getDaysUntilExpiry = () => {
        if (!lease) return 0
        const days = Math.ceil((lease.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return days
    }

    const getTotalRentPaid = () => {
        return payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
    }

    const getOverduePayments = () => {
        return payments.filter(p => p.status === 'overdue' || p.status === 'late').length
    }

    if (!lease || !tenant || !unit || !property) {
        return (
            <DashboardLayout>
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Lease Not Found</h1>
                    <p className="text-muted-foreground mb-4">The lease you're looking for doesn't exist.</p>
                    <Button asChild>
                        <Link href="/leases">Back to Leases</Link>
                    </Button>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/leases">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Lease Agreement</h1>
                            <p className="text-muted-foreground">
                                {tenant.name} • {unit.number} • {property.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/leases/${lease.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Lease
                            </Link>
                        </Button>
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                        <Button variant="outline">
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="overview" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="payments">Payments</TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                {/* Lease Status Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            {getStatusIcon(lease.status)}
                                            Lease Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <Badge className={`${getStatusColor(lease.status)} text-sm font-medium`}>
                                                {lease.status}
                                            </Badge>
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">Days Remaining</p>
                                                <p className={`text-2xl font-bold ${getDaysUntilExpiry() > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {getDaysUntilExpiry() > 0 ? getDaysUntilExpiry() : Math.abs(getDaysUntilExpiry())}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {getDaysUntilExpiry() > 0 ? 'days remaining' : 'days expired'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Lease Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Lease Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Lease Information</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Lease ID</span>
                                                            <span className="text-sm font-medium">{lease.id}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Type</span>
                                                            <Badge variant="outline" className="capitalize">
                                                                {lease.type}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Status</span>
                                                            <Badge className={getStatusColor(lease.status)}>
                                                                {lease.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Auto Renew</span>
                                                            <span className="text-sm">{lease.autoRenew ? "Yes" : "No"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold mb-2">Lease Period</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Start Date</span>
                                                            <span className="text-sm">{format(new Date(lease.startDate), "MMM dd, yyyy")}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">End Date</span>
                                                            <span className="text-sm">{format(new Date(lease.endDate), "MMM dd, yyyy")}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Duration</span>
                                                            <span className="text-sm">
                                                                {Math.ceil((lease.endDate.getTime() - lease.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Financial Terms</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Monthly Rent</span>
                                                            <span className="text-sm font-medium">${lease.rent.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Security Deposit</span>
                                                            <span className="text-sm font-medium">${lease.deposit.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Late Fee</span>
                                                            <span className="text-sm">${lease.lateFee}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Grace Period</span>
                                                            <span className="text-sm">{lease.gracePeriod} days</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold mb-2">Payment Summary</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Total Paid</span>
                                                            <span className="text-sm font-medium">${getTotalRentPaid().toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Overdue Payments</span>
                                                            <span className="text-sm text-red-600">{getOverduePayments()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="my-6" />

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold mb-2">Terms and Conditions</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{lease.terms}</p>
                                            </div>

                                            {lease.renewalTerms && (
                                                <div>
                                                    <h4 className="font-semibold mb-2">Renewal Terms</h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{lease.renewalTerms}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Property and Unit Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Property & Unit Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-semibold mb-2">Property Details</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">Property Name</span>
                                                        <span className="text-sm font-medium">{property.name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">Address</span>
                                                        <span className="text-sm text-right">
                                                            {property.address.street}, {property.address.city}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">Type</span>
                                                        <span className="text-sm capitalize">{property.type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Unit Details</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">Unit Number</span>
                                                        <span className="text-sm font-medium">{unit.number}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">Type</span>
                                                        <span className="text-sm">
                                                            {unit.bedrooms}BR, {unit.bathrooms}BA
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">Area</span>
                                                        <span className="text-sm">{unit.area} sq ft</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">Floor</span>
                                                        <span className="text-sm">{unit.floor || "N/A"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="payments" className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Payment History</h3>
                                    <Button size="sm" asChild>
                                        <Link href="/payments/create">Record Payment</Link>
                                    </Button>
                                </div>

                                {payments.length > 0 ? (
                                    <Card>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="text-left p-4 font-medium">Date</th>
                                                            <th className="text-left p-4 font-medium">Amount</th>
                                                            <th className="text-left p-4 font-medium">Type</th>
                                                            <th className="text-left p-4 font-medium">Status</th>
                                                            <th className="text-left p-4 font-medium">Method</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {payments.map((payment) => (
                                                            <tr key={payment.id} className="border-b">
                                                                <td className="p-4">
                                                                    <div>
                                                                        <div className="font-medium">
                                                                            {payment.paidDate ?
                                                                                format(new Date(payment.paidDate), "MMM dd, yyyy") :
                                                                                format(new Date(payment.dueDate), "MMM dd, yyyy")
                                                                            }
                                                                        </div>
                                                                        <div className="text-sm text-muted-foreground">
                                                                            Due: {format(new Date(payment.dueDate), "MMM dd, yyyy")}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 font-medium">${payment.amount.toLocaleString()}</td>
                                                                <td className="p-4">
                                                                    <Badge variant="outline" className="capitalize">
                                                                        {payment.type.replace('_', ' ')}
                                                                    </Badge>
                                                                </td>
                                                                <td className="p-4">
                                                                    <Badge className={
                                                                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                                payment.status === 'late' ? 'bg-orange-100 text-orange-800' :
                                                                                    'bg-red-100 text-red-800'
                                                                    }>
                                                                        {payment.status}
                                                                    </Badge>
                                                                </td>
                                                                <td className="p-4 text-sm text-muted-foreground">
                                                                    {payment.method ? payment.method.replace('_', ' ') : 'N/A'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                            <h3 className="text-lg font-semibold mb-2">No Payment History</h3>
                                            <p className="text-muted-foreground">
                                                No payment records found for this lease.
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="documents" className="space-y-6">
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold mb-2">No Documents</h3>
                                        <p className="text-muted-foreground">
                                            No documents have been uploaded for this lease yet.
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Tenant Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <Avatar className="w-16 h-16 mx-auto mb-3">
                                        <AvatarImage src="/placeholder-user.jpg" />
                                        <AvatarFallback className="text-lg">
                                            {tenant.name.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-semibold text-lg">{tenant.name}</h3>
                                    <p className="text-sm text-muted-foreground">{tenant.email}</p>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{tenant.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            Move-in: {tenant.moveInDate ? new Date(tenant.moveInDate).toLocaleDateString() : "Not specified"}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Button asChild className="w-full">
                                        <Link href={`/tenants/${tenant.id}`}>
                                            <Users className="h-4 w-4 mr-2" />
                                            View Tenant Profile
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href={`/units/${unit.id}`}>
                                            <Home className="h-4 w-4 mr-2" />
                                            View Unit Details
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href={`/property/${property.id}`}>
                                            <MapPin className="h-4 w-4 mr-2" />
                                            View Property
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
} 