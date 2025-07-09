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
    Users,
    Home,
    DollarSign,
    Calendar,
    MapPin,
    Phone,
    Mail,
    FileText,
    Wrench,
    AlertTriangle,
    CheckCircle,
    Clock,
    User,
    Heart,
    Shield
} from "lucide-react"
import { mockTenants, mockUnits, mockProperties, mockLeases, mockMaintenanceRequests, mockPayments } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import Link from "next/link"

export default function TenantDetailsPage() {
    const params = useParams()
    const tenantId = params.id as string

    const tenant = mockTenants.find((t) => t.id === tenantId)
    const unit = tenant?.currentUnitId ? mockUnits.find((u) => u.id === tenant.currentUnitId) : null
    const property = unit ? mockProperties.find((p) => p.id === unit.propertyId) : null
    const lease = tenant?.currentLeaseId ? mockLeases.find((l) => l.id === tenant.currentLeaseId) : null
    const maintenanceRequests = mockMaintenanceRequests.filter((m) => m.tenantId === tenantId)
    const payments = mockPayments.filter((p) => p.tenantId === tenantId)

    const getStatusColor = (isActive: boolean) => {
        return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }

    const getLeaseStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800"
            case "expired": return "bg-red-100 text-red-800"
            case "terminated": return "bg-gray-100 text-gray-800"
            case "pending": return "bg-yellow-100 text-yellow-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "paid": return "bg-green-100 text-green-800"
            case "pending": return "bg-yellow-100 text-yellow-800"
            case "late": return "bg-orange-100 text-orange-800"
            case "overdue": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getOverduePayments = () => {
        return payments.filter(p => p.status === 'overdue' || p.status === 'late').length
    }

    const getTotalRentPaid = () => {
        return payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
    }

    if (!tenant) {
        return (
            <DashboardLayout>
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Tenant Not Found</h1>
                    <p className="text-muted-foreground mb-4">The tenant you're looking for doesn't exist.</p>
                    <Button asChild>
                        <Link href="/tenants">Back to Tenants</Link>
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
                            <Link href="/tenants">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
                            <p className="text-muted-foreground">
                                Tenant Profile • {tenant.isActive ? "Active" : "Inactive"}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link href={`/tenants/${tenant.id}/move-in`}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Move-in
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/tenants/${tenant.id}/move-out`}>
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Move-out
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/tenants/${tenant.id}/deposit`}>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Deposit
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/tenants/${tenant.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="overview" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="lease">Lease Info</TabsTrigger>
                                <TabsTrigger value="payments">Payments</TabsTrigger>
                                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                {/* Tenant Status Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Tenant Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <Badge className={`${getStatusColor(tenant.isActive)} text-sm font-medium`}>
                                                {tenant.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">Current Unit</p>
                                                <p className="font-semibold">
                                                    {unit ? unit.number : "No unit assigned"}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Personal Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Contact Details</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">{tenant.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">{tenant.phone}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold mb-2">Personal Details</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Date of Birth</span>
                                                            <span className="text-sm">
                                                                {tenant.dateOfBirth ?
                                                                    new Date(tenant.dateOfBirth).toLocaleDateString() :
                                                                    "Not specified"
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Age</span>
                                                            <span className="text-sm">
                                                                {tenant.dateOfBirth ?
                                                                    `${new Date().getFullYear() - tenant.dateOfBirth.getFullYear()} years` :
                                                                    "Not specified"
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">Move-in Date</span>
                                                            <span className="text-sm">
                                                                {tenant.moveInDate ?
                                                                    new Date(tenant.moveInDate).toLocaleDateString() :
                                                                    "Not specified"
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Emergency Contact</h4>
                                                    {tenant.emergencyContact ? (
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-muted-foreground">Name</span>
                                                                <span className="text-sm">{tenant.emergencyContact.name}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-muted-foreground">Phone</span>
                                                                <span className="text-sm">{tenant.emergencyContact.phone}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-muted-foreground">Relationship</span>
                                                                <span className="text-sm">{tenant.emergencyContact.relationship}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">No emergency contact specified</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold mb-2">Current Residence</h4>
                                                    {unit && property ? (
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-muted-foreground">Unit</span>
                                                                <span className="text-sm font-medium">{unit.number}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-muted-foreground">Property</span>
                                                                <span className="text-sm">{property.name}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-muted-foreground">Address</span>
                                                                <span className="text-sm text-right">
                                                                    {property.address.street}, {property.address.city}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">No current residence</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Stats */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
                                                <div className="font-semibold">${getTotalRentPaid().toLocaleString()}</div>
                                                <div className="text-sm text-muted-foreground">Total Paid</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                                                <div className="font-semibold text-red-600">{getOverduePayments()}</div>
                                                <div className="text-sm text-muted-foreground">Overdue</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <Wrench className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                                                <div className="font-semibold">{maintenanceRequests.length}</div>
                                                <div className="text-sm text-muted-foreground">Requests</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <Calendar className="h-6 w-6 mx-auto mb-2 text-green-500" />
                                                <div className="font-semibold">
                                                    {tenant.moveInDate ?
                                                        Math.floor((new Date().getTime() - tenant.moveInDate.getTime()) / (1000 * 60 * 60 * 24)) :
                                                        0
                                                    }
                                                </div>
                                                <div className="text-sm text-muted-foreground">Days</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="lease" className="space-y-6">
                                {lease ? (
                                    <>
                                        {/* Current Lease */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Current Lease</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Lease Details</h4>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm text-muted-foreground">Lease ID</span>
                                                                    <span className="text-sm font-medium">{lease.id}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm text-muted-foreground">Status</span>
                                                                    <Badge className={getLeaseStatusColor(lease.status)}>
                                                                        {lease.status}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm text-muted-foreground">Type</span>
                                                                    <span className="text-sm capitalize">{lease.type}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm text-muted-foreground">Monthly Rent</span>
                                                                    <span className="text-sm font-medium">${lease.rent.toLocaleString()}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm text-muted-foreground">Security Deposit</span>
                                                                    <span className="text-sm font-medium">${lease.deposit.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Lease Period</h4>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm text-muted-foreground">Start Date</span>
                                                                    <span className="text-sm">{new Date(lease.startDate).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm text-muted-foreground">End Date</span>
                                                                    <span className="text-sm">{new Date(lease.endDate).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm text-muted-foreground">Duration</span>
                                                                    <span className="text-sm">
                                                                        {Math.ceil((lease.endDate.getTime() - lease.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm text-muted-foreground">Days Remaining</span>
                                                                    <span className="text-sm">
                                                                        {Math.ceil((lease.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="font-semibold mb-2">Terms & Conditions</h4>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm text-muted-foreground">Late Fee</span>
                                                                    <span className="text-sm">${lease.lateFee}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm text-muted-foreground">Grace Period</span>
                                                                    <span className="text-sm">{lease.gracePeriod} days</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm text-muted-foreground">Auto Renew</span>
                                                                    <span className="text-sm">{lease.autoRenew ? "Yes" : "No"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator className="my-6" />

                                                <div>
                                                    <h4 className="font-semibold mb-2">Terms</h4>
                                                    <p className="text-sm text-muted-foreground">{lease.terms}</p>
                                                </div>

                                                {lease.renewalTerms && (
                                                    <>
                                                        <Separator className="my-6" />
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Renewal Terms</h4>
                                                            <p className="text-sm text-muted-foreground">{lease.renewalTerms}</p>
                                                        </div>
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </>
                                ) : (
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                            <h3 className="text-lg font-semibold mb-2">No Active Lease</h3>
                                            <p className="text-muted-foreground mb-4">
                                                This tenant doesn't have an active lease agreement.
                                            </p>
                                            <Button asChild>
                                                <Link href="/leases/create">Create Lease</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
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
                                                                                new Date(payment.paidDate).toLocaleDateString() :
                                                                                new Date(payment.dueDate).toLocaleDateString()
                                                                            }
                                                                        </div>
                                                                        <div className="text-sm text-muted-foreground">
                                                                            Due: {new Date(payment.dueDate).toLocaleDateString()}
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
                                                                    <Badge className={getPaymentStatusColor(payment.status)}>
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
                                                No payment records found for this tenant.
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="maintenance" className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Maintenance Requests</h3>
                                    <Button size="sm" asChild>
                                        <Link href="/maintenance/create">New Request</Link>
                                    </Button>
                                </div>

                                {maintenanceRequests.length > 0 ? (
                                    <div className="space-y-4">
                                        {maintenanceRequests.map((request) => (
                                            <Card key={request.id}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h4 className="font-semibold">{request.title}</h4>
                                                                <Badge variant={
                                                                    request.priority === 'emergency' ? 'destructive' :
                                                                        request.priority === 'high' ? 'default' :
                                                                            request.priority === 'medium' ? 'secondary' : 'outline'
                                                                }>
                                                                    {request.priority}
                                                                </Badge>
                                                                <Badge variant={
                                                                    request.status === 'completed' ? 'default' :
                                                                        request.status === 'in_progress' ? 'secondary' :
                                                                            'outline'
                                                                }>
                                                                    {request.status.replace('_', ' ')}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mb-2">
                                                                {request.description}
                                                            </p>
                                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                                <span>Category: {request.category.replace('_', ' ')}</span>
                                                                <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                                                                {request.estimatedCost && (
                                                                    <span>Est. Cost: ${request.estimatedCost}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/maintenance/${request.id}`}>View Details</Link>
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                            <h3 className="text-lg font-semibold mb-2">No Maintenance Requests</h3>
                                            <p className="text-muted-foreground">
                                                No maintenance requests have been submitted by this tenant.
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
                                            No documents have been uploaded for this tenant yet.
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
                                <CardTitle>Tenant Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <Avatar className="w-20 h-20 mx-auto mb-3">
                                        <AvatarImage src="/placeholder-user.jpg" />
                                        <AvatarFallback className="text-lg">
                                            {tenant.name.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-semibold text-lg">{tenant.name}</h3>
                                    <Badge className={getStatusColor(tenant.isActive)}>
                                        {tenant.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Current Unit</span>
                                        <span className="font-medium">
                                            {unit ? unit.number : "None"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Property</span>
                                        <span className="font-medium">
                                            {property ? property.name : "None"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Monthly Rent</span>
                                        <span className="font-medium">
                                            {lease ? `$${lease.rent.toLocaleString()}` : "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Lease Status</span>
                                        <span className="font-medium">
                                            {lease ? lease.status : "No lease"}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Button asChild className="w-full">
                                        <Link href={`/tenants/${tenant.id}/edit`}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href={`/leases/${lease?.id || 'create'}`}>
                                            <FileText className="h-4 w-4 mr-2" />
                                            {lease ? "View Lease" : "Create Lease"}
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href={`/units/${unit?.id || '#'}`}>
                                            <Home className="h-4 w-4 mr-2" />
                                            View Unit
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