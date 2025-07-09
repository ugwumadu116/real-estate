"use client"

import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, DollarSign, User, Building, Home, Calendar, FileText, AlertTriangle, CheckCircle, Clock, X } from "lucide-react"
import { format } from "date-fns"
import { mockPayments, mockTenants, mockUnits, mockProperties, mockLeases } from "@/lib/mock-data"
import { PaymentStatus } from "@/lib/types"
import { PAYMENT_STATUS_OPTIONS, PAYMENT_TYPES, PAYMENT_METHODS } from "@/lib/constants"
import { formatCurrency, isPaymentOverdue, calculateLateFee, getTotalPaymentAmount } from "@/lib/utils"

export default function PaymentDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const paymentId = params.id as string

    const payment = mockPayments.find((p) => p.id === paymentId)

    if (!payment) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Payment Not Found</h1>
                            <p className="text-muted-foreground">
                                The requested payment could not be found
                            </p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    const tenant = mockTenants.find((t) => t.id === payment.tenantId)
    const unit = mockUnits.find((u) => u.id === payment.unitId)
    const property = unit ? mockProperties.find((p) => p.id === unit.propertyId) : null
    const lease = mockLeases.find((l) => l.id === payment.leaseId)

    const isOverdue = isPaymentOverdue(payment)
    const lateFee = calculateLateFee(payment)
    const totalAmount = getTotalPaymentAmount(payment)

    const getStatusIcon = (status: PaymentStatus) => {
        switch (status) {
            case "paid": return <CheckCircle className="h-4 w-4 text-green-600" />
            case "pending": return <Clock className="h-4 w-4 text-yellow-600" />
            case "late": return <AlertTriangle className="h-4 w-4 text-orange-600" />
            case "overdue": return <X className="h-4 w-4 text-red-600" />
            default: return <Clock className="h-4 w-4 text-gray-600" />
        }
    }

    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case "paid": return "bg-green-100 text-green-800"
            case "pending": return "bg-yellow-100 text-yellow-800"
            case "late": return "bg-orange-100 text-orange-800"
            case "overdue": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Payment Details</h1>
                            <p className="text-muted-foreground">
                                View payment information and history
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {payment.status === 'pending' && (
                            <Button asChild>
                                <a href={`/payments/${payment.id}/record`}>Record Payment</a>
                            </Button>
                        )}
                        <Button variant="outline">Send Receipt</Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Payment Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Payment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Payment ID</label>
                                            <p className="text-sm">{payment.id}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Amount</label>
                                            <p className="text-2xl font-bold">{formatCurrency(payment.amount)}</p>
                                            {lateFee > 0 && (
                                                <p className="text-sm text-red-600">
                                                    +{formatCurrency(lateFee)} late fee
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                                            <p className="text-xl font-semibold">{formatCurrency(totalAmount)}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Payment Type</label>
                                            <Badge variant="outline">
                                                {PAYMENT_TYPES.find(t => t.value === payment.type)?.label}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Status</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                {getStatusIcon(payment.status)}
                                                <Badge className={getStatusColor(payment.status)}>
                                                    {PAYMENT_STATUS_OPTIONS.find(s => s.value === payment.status)?.label}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                                            <p className="text-sm">{format(new Date(payment.dueDate), "PPP")}</p>
                                        </div>
                                        {payment.paidDate && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Paid Date</label>
                                                <p className="text-sm">{format(new Date(payment.paidDate), "PPP")}</p>
                                            </div>
                                        )}
                                        {payment.method && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                                                <Badge variant="outline">
                                                    {PAYMENT_METHODS.find(m => m.value === payment.method)?.label}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {payment.reference && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Reference</label>
                                        <p className="text-sm">{payment.reference}</p>
                                    </div>
                                )}

                                {payment.notes && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Notes</label>
                                        <p className="text-sm">{payment.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tenant and Property Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Related Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="tenant" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="tenant">Tenant</TabsTrigger>
                                        <TabsTrigger value="property">Property</TabsTrigger>
                                        <TabsTrigger value="lease">Lease</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="tenant" className="space-y-4">
                                        {tenant && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <User className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">{tenant.name}</div>
                                                        <div className="text-sm text-muted-foreground">{tenant.email}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Phone</div>
                                                    <div className="text-sm">{tenant.phone}</div>
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                    <TabsContent value="property" className="space-y-4">
                                        {property && unit && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <Building className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">{property.name}</div>
                                                        <div className="text-sm text-muted-foreground">{property.address}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Home className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">Unit {unit.number}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {unit.bedrooms} bed, {unit.bathrooms} bath
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                    <TabsContent value="lease" className="space-y-4">
                                        {lease && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Lease Period</div>
                                                    <div className="text-sm">
                                                        {format(new Date(lease.startDate), "MMM dd, yyyy")} - {format(new Date(lease.endDate), "MMM dd, yyyy")}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Monthly Rent</div>
                                                    <div className="text-sm font-medium">{formatCurrency(lease.rent)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Security Deposit</div>
                                                    <div className="text-sm font-medium">{formatCurrency(lease.deposit)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Late Fee</div>
                                                    <div className="text-sm">${lease.lateFee}/day</div>
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Actions and Timeline */}
                    <div className="space-y-6">
                        {/* Payment Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full" variant="outline">
                                    Send Receipt
                                </Button>
                                <Button className="w-full" variant="outline">
                                    Send Reminder
                                </Button>
                                <Button className="w-full" variant="outline">
                                    Edit Payment
                                </Button>
                                <Button className="w-full" variant="outline">
                                    Download Receipt
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Payment Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <div>
                                            <div className="text-sm font-medium">Payment Created</div>
                                            <div className="text-xs text-muted-foreground">
                                                {format(new Date(payment.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                                            </div>
                                        </div>
                                    </div>

                                    {payment.paidDate && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                            <div>
                                                <div className="text-sm font-medium">Payment Received</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {format(new Date(payment.paidDate), "MMM dd, yyyy 'at' h:mm a")}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                                        <div>
                                            <div className="text-sm font-medium">Due Date</div>
                                            <div className="text-xs text-muted-foreground">
                                                {format(new Date(payment.dueDate), "MMM dd, yyyy")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
} 