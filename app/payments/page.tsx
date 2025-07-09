"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock, X } from "lucide-react"
import Link from "next/link"
import { mockPayments, mockTenants, mockUnits, mockProperties, mockLeases } from "@/lib/mock-data"
import { PaymentStatus, PaymentType } from "@/lib/types"
import { PAYMENT_STATUS_OPTIONS, PAYMENT_TYPES, PAYMENT_METHODS } from "@/lib/constants"
import { formatCurrency, isPaymentOverdue, calculateLateFee, getTotalPaymentAmount } from "@/lib/utils"
import { format } from "date-fns"

export default function PaymentsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all")
    const [typeFilter, setTypeFilter] = useState<PaymentType | "all">("all")
    const [dateFilter, setDateFilter] = useState("all")

    // Get enriched payment data
    const enrichedPayments = useMemo(() => {
        return mockPayments.map(payment => {
            const tenant = mockTenants.find(t => t.id === payment.tenantId)
            const unit = mockUnits.find(u => u.id === payment.unitId)
            const property = unit ? mockProperties.find(p => p.id === unit.propertyId) : null
            const lease = mockLeases.find(l => l.id === payment.leaseId)

            return {
                ...payment,
                tenant,
                unit,
                property,
                lease,
                isOverdue: isPaymentOverdue(payment),
                lateFee: calculateLateFee(payment),
                totalAmount: getTotalPaymentAmount(payment)
            }
        })
    }, [])

    // Filter payments
    const filteredPayments = useMemo(() => {
        return enrichedPayments.filter(payment => {
            const matchesSearch = searchTerm === "" ||
                payment.tenant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.property?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.unit?.number.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter === "all" || payment.status === statusFilter
            const matchesType = typeFilter === "all" || payment.type === typeFilter

            let matchesDate = true
            if (dateFilter !== "all") {
                const now = new Date()
                const dueDate = new Date(payment.dueDate)

                switch (dateFilter) {
                    case "today":
                        matchesDate = dueDate.toDateString() === now.toDateString()
                        break
                    case "week":
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                        matchesDate = dueDate >= weekAgo && dueDate <= now
                        break
                    case "month":
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                        matchesDate = dueDate >= monthAgo && dueDate <= now
                        break
                    case "overdue":
                        matchesDate = payment.isOverdue
                        break
                }
            }

            return matchesSearch && matchesStatus && matchesType && matchesDate
        })
    }, [enrichedPayments, searchTerm, statusFilter, typeFilter, dateFilter])

    // Calculate statistics
    const stats = useMemo(() => {
        const totalPayments = enrichedPayments.length
        const paidPayments = enrichedPayments.filter(p => p.status === 'paid').length
        const pendingPayments = enrichedPayments.filter(p => p.status === 'pending').length
        const overduePayments = enrichedPayments.filter(p => p.status === 'overdue' || p.status === 'late').length

        const totalAmount = enrichedPayments.reduce((sum, p) => sum + p.amount, 0)
        const collectedAmount = enrichedPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
        const pendingAmount = enrichedPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
        const overdueAmount = enrichedPayments.filter(p => p.status === 'overdue' || p.status === 'late').reduce((sum, p) => sum + p.amount, 0)

        return {
            totalPayments,
            paidPayments,
            pendingPayments,
            overduePayments,
            totalAmount,
            collectedAmount,
            pendingAmount,
            overdueAmount
        }
    }, [enrichedPayments])

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
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                        <p className="text-muted-foreground">
                            Track rent payments and financial transactions
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/payments/create">Record Payment</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/payments/schedule">Payment Schedule</Link>
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.collectedAmount)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.paidPayments} payments received
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.pendingPayments} payments pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdueAmount)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.overduePayments} payments overdue
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalAmount > 0 ? Math.round((stats.collectedAmount / stats.totalAmount) * 100) : 0}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                of total expected payments
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Filter payments by various criteria</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Search</label>
                                <Input
                                    placeholder="Search by tenant, property, or unit..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PaymentStatus | "all")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        {PAYMENT_STATUS_OPTIONS.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as PaymentType | "all")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        {PAYMENT_TYPES.map(type => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date Range</label>
                                <Select value={dateFilter} onValueChange={setDateFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All dates" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Dates</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="week">This Week</SelectItem>
                                        <SelectItem value="month">This Month</SelectItem>
                                        <SelectItem value="overdue">Overdue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                        <CardDescription>
                            {filteredPayments.length} payments found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tenant</TableHead>
                                        <TableHead>Property/Unit</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPayments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{payment.tenant?.name}</div>
                                                    <div className="text-sm text-muted-foreground">{payment.tenant?.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{payment.property?.name}</div>
                                                    <div className="text-sm text-muted-foreground">Unit {payment.unit?.number}</div>
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
                                                <div>
                                                    <div className="font-medium">
                                                        {format(new Date(payment.dueDate), "MMM dd, yyyy")}
                                                    </div>
                                                    {payment.paidDate && (
                                                        <div className="text-sm text-muted-foreground">
                                                            Paid: {format(new Date(payment.paidDate), "MMM dd, yyyy")}
                                                        </div>
                                                    )}
                                                </div>
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
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/payments/${payment.id}`}>View</Link>
                                                    </Button>
                                                    {payment.status === 'pending' && (
                                                        <Button size="sm" asChild>
                                                            <Link href={`/payments/${payment.id}/record`}>Record</Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
} 