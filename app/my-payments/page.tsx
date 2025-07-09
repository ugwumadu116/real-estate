"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    DollarSign,
    Clock,
    CheckCircle,
    AlertTriangle,
    X,
    Calendar,
    CreditCard,
    Download
} from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/lib/auth-context"
import { mockPayments, mockUnits, mockProperties, mockLeases } from "@/lib/mock-data"
import { PaymentStatus } from "@/lib/types"
import { PAYMENT_STATUS_OPTIONS, PAYMENT_TYPES, PAYMENT_METHODS } from "@/lib/constants"
import { formatCurrency, isPaymentOverdue, calculateLateFee, getTotalPaymentAmount } from "@/lib/utils"

export default function MyPaymentsPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState("history")

    // Get tenant's payments
    const tenantPayments = useMemo(() => {
        if (!user) return []

        return mockPayments
            .filter(payment => payment.tenantId === user.id)
            .map(payment => {
                const unit = mockUnits.find(u => u.id === payment.unitId)
                const property = unit ? mockProperties.find(p => p.id === unit.propertyId) : null
                const lease = mockLeases.find(l => l.id === payment.leaseId)

                return {
                    ...payment,
                    unit,
                    property,
                    lease,
                    isOverdue: isPaymentOverdue(payment),
                    lateFee: calculateLateFee(payment),
                    totalAmount: getTotalPaymentAmount(payment)
                }
            })
            .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    }, [user])

    // Calculate statistics
    const stats = useMemo(() => {
        const totalPayments = tenantPayments.length
        const paidPayments = tenantPayments.filter(p => p.status === 'paid').length
        const pendingPayments = tenantPayments.filter(p => p.status === 'pending').length
        const overduePayments = tenantPayments.filter(p => p.status === 'overdue' || p.status === 'late').length

        const totalPaid = tenantPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
        const totalPending = tenantPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
        const totalOverdue = tenantPayments.filter(p => p.status === 'overdue' || p.status === 'late').reduce((sum, p) => sum + p.amount, 0)

        return {
            totalPayments,
            paidPayments,
            pendingPayments,
            overduePayments,
            totalPaid,
            totalPending,
            totalOverdue
        }
    }, [tenantPayments])

    // Get upcoming payments
    const upcomingPayments = useMemo(() => {
        const now = new Date()
        return tenantPayments
            .filter(payment => {
                const dueDate = new Date(payment.dueDate)
                return dueDate > now && payment.status === 'pending'
            })
            .slice(0, 5) // Show next 5 payments
    }, [tenantPayments])

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

    if (!user) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Payments</h1>
                        <p className="text-muted-foreground">
                            Please log in to view your payment information
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Payments</h1>
                        <p className="text-muted-foreground">
                            View your payment history and manage upcoming payments
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Statement
                        </Button>
                        <Button>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Make Payment
                        </Button>
                    </div>
                </div>

                {/* Payment Statistics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalPaid)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.paidPayments} payments completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.totalPending)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.pendingPayments} payments pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalOverdue)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.overduePayments} payments overdue
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {upcomingPayments.length > 0 ? formatCurrency(upcomingPayments[0].amount) : "$0"}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {upcomingPayments.length > 0
                                    ? `Due ${format(new Date(upcomingPayments[0].dueDate), "MMM dd")}`
                                    : "No upcoming payments"
                                }
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Payments */}
                {upcomingPayments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Payments</CardTitle>
                            <CardDescription>Your next scheduled payments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingPayments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Calendar className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {payment.property?.name} - Unit {payment.unit?.number}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Due {format(new Date(payment.dueDate), "EEEE, MMMM dd, yyyy")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-semibold">{formatCurrency(payment.amount)}</div>
                                            <Badge variant="outline" className="mt-1">
                                                {PAYMENT_TYPES.find(t => t.value === payment.type)?.label}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Payment History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                        <CardDescription>Complete history of all your payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="history">All Payments</TabsTrigger>
                                <TabsTrigger value="paid">Paid</TabsTrigger>
                                <TabsTrigger value="pending">Pending</TabsTrigger>
                            </TabsList>

                            <TabsContent value="history" className="space-y-4">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Property/Unit</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Method</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tenantPayments.map((payment) => (
                                                <TableRow key={payment.id}>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">
                                                                {payment.paidDate
                                                                    ? format(new Date(payment.paidDate), "MMM dd, yyyy")
                                                                    : format(new Date(payment.dueDate), "MMM dd, yyyy")
                                                                }
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Due: {format(new Date(payment.dueDate), "MMM dd")}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{payment.property?.name}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Unit {payment.unit?.number}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{formatCurrency(payment.amount)}</div>
                                                            {payment.lateFee > 0 && (
                                                                <div className="text-sm text-red-600">
                                                                    +{formatCurrency(payment.lateFee)} late fee
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {PAYMENT_TYPES.find(t => t.value === payment.type)?.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {getStatusIcon(payment.status)}
                                                            <Badge className={getStatusColor(payment.status)}>
                                                                {PAYMENT_STATUS_OPTIONS.find(s => s.value === payment.status)?.label}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {payment.method ? (
                                                            <Badge variant="outline">
                                                                {PAYMENT_METHODS.find(m => m.value === payment.method)?.label}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant="outline">
                                                                Receipt
                                                            </Button>
                                                            {payment.status === 'pending' && (
                                                                <Button size="sm">
                                                                    Pay Now
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="paid" className="space-y-4">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Property/Unit</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Method</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tenantPayments
                                                .filter(p => p.status === 'paid')
                                                .map((payment) => (
                                                    <TableRow key={payment.id}>
                                                        <TableCell>
                                                            {payment.paidDate && format(new Date(payment.paidDate), "MMM dd, yyyy")}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">{payment.property?.name}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Unit {payment.unit?.number}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">
                                                                {PAYMENT_TYPES.find(t => t.value === payment.type)?.label}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {payment.method && (
                                                                <Badge variant="outline">
                                                                    {PAYMENT_METHODS.find(m => m.value === payment.method)?.label}
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button size="sm" variant="outline">
                                                                Receipt
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="pending" className="space-y-4">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Due Date</TableHead>
                                                <TableHead>Property/Unit</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tenantPayments
                                                .filter(p => p.status === 'pending' || p.status === 'overdue' || p.status === 'late')
                                                .map((payment) => (
                                                    <TableRow key={payment.id}>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">
                                                                    {format(new Date(payment.dueDate), "MMM dd, yyyy")}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {format(new Date(payment.dueDate), "EEEE")}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">{payment.property?.name}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Unit {payment.unit?.number}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">{formatCurrency(payment.amount)}</div>
                                                                {payment.lateFee > 0 && (
                                                                    <div className="text-sm text-red-600">
                                                                        +{formatCurrency(payment.lateFee)} late fee
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">
                                                                {PAYMENT_TYPES.find(t => t.value === payment.type)?.label}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                {getStatusIcon(payment.status)}
                                                                <Badge className={getStatusColor(payment.status)}>
                                                                    {PAYMENT_STATUS_OPTIONS.find(s => s.value === payment.status)?.label}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button size="sm">
                                                                Pay Now
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
} 