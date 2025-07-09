"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CalendarIcon, DollarSign, AlertTriangle, Clock, CheckCircle } from "lucide-react"
import { format, addMonths, startOfMonth, endOfMonth } from "date-fns"
import { cn } from "@/lib/utils"
import { mockLeases, mockTenants, mockUnits, mockProperties } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"

export default function PaymentSchedulePage() {
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [selectedProperty, setSelectedProperty] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [selectedPayments, setSelectedPayments] = useState<string[]>([])

    // Get active leases
    const activeLeases = mockLeases.filter(lease => lease.status === 'active')

    // Generate payment schedule for the selected month
    const paymentSchedule = useMemo(() => {
        const schedule = []
        const monthStart = startOfMonth(selectedMonth)
        const monthEnd = endOfMonth(selectedMonth)

        for (const lease of activeLeases) {
            // Skip if property filter is applied and doesn't match
            if (selectedProperty !== "all") {
                const unit = mockUnits.find(u => u.id === lease.unitId)
                if (unit?.propertyId !== selectedProperty) continue
            }

            // Check if this lease has a payment due in the selected month
            const leaseStart = new Date(lease.startDate)
            const leaseEnd = new Date(lease.endDate)

            // Generate payment dates for this lease
            let currentDate = new Date(leaseStart)
            while (currentDate <= leaseEnd) {
                if (currentDate >= monthStart && currentDate <= monthEnd) {
                    const tenant = mockTenants.find(t => t.id === lease.tenantId)
                    const unit = mockUnits.find(u => u.id === lease.unitId)
                    const property = unit ? mockProperties.find(p => p.id === unit.propertyId) : null

                    // Determine payment status
                    let status: 'upcoming' | 'due' | 'overdue' = 'upcoming'
                    const now = new Date()
                    const daysUntilDue = Math.ceil((currentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

                    if (currentDate < now) {
                        status = 'overdue'
                    } else if (daysUntilDue <= 7) {
                        status = 'due'
                    }

                    schedule.push({
                        id: `schedule-${lease.id}-${currentDate.getTime()}`,
                        leaseId: lease.id,
                        tenantId: lease.tenantId,
                        unitId: lease.unitId,
                        propertyId: unit?.propertyId || '',
                        dueDate: new Date(currentDate),
                        amount: lease.rent,
                        status,
                        tenant,
                        unit,
                        property,
                        lease
                    })
                }

                // Move to next month
                currentDate = addMonths(currentDate, 1)
            }
        }

        // Filter by status
        if (selectedStatus !== "all") {
            return schedule.filter(payment => payment.status === selectedStatus)
        }

        return schedule.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    }, [activeLeases, selectedMonth, selectedProperty, selectedStatus])

    // Calculate statistics
    const stats = useMemo(() => {
        const totalPayments = paymentSchedule.length
        const upcomingPayments = paymentSchedule.filter(p => p.status === 'upcoming').length
        const duePayments = paymentSchedule.filter(p => p.status === 'due').length
        const overduePayments = paymentSchedule.filter(p => p.status === 'overdue').length

        const totalAmount = paymentSchedule.reduce((sum, p) => sum + p.amount, 0)
        const upcomingAmount = paymentSchedule.filter(p => p.status === 'upcoming').reduce((sum, p) => sum + p.amount, 0)
        const dueAmount = paymentSchedule.filter(p => p.status === 'due').reduce((sum, p) => sum + p.amount, 0)
        const overdueAmount = paymentSchedule.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)

        return {
            totalPayments,
            upcomingPayments,
            duePayments,
            overduePayments,
            totalAmount,
            upcomingAmount,
            dueAmount,
            overdueAmount
        }
    }, [paymentSchedule])

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedPayments(paymentSchedule.map(p => p.id))
        } else {
            setSelectedPayments([])
        }
    }

    const handleSelectPayment = (paymentId: string, checked: boolean) => {
        if (checked) {
            setSelectedPayments(prev => [...prev, paymentId])
        } else {
            setSelectedPayments(prev => prev.filter(id => id !== paymentId))
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "upcoming": return <Clock className="h-4 w-4 text-blue-600" />
            case "due": return <AlertTriangle className="h-4 w-4 text-orange-600" />
            case "overdue": return <AlertTriangle className="h-4 w-4 text-red-600" />
            default: return <Clock className="h-4 w-4 text-gray-600" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "upcoming": return "bg-blue-100 text-blue-800"
            case "due": return "bg-orange-100 text-orange-800"
            case "overdue": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "upcoming": return "Upcoming"
            case "due": return "Due Soon"
            case "overdue": return "Overdue"
            default: return "Unknown"
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Payment Schedule</h1>
                        <p className="text-muted-foreground">
                            View and manage upcoming rent payments
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.totalPayments} payments expected
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.upcomingAmount)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.upcomingPayments} payments upcoming
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{formatCurrency(stats.dueAmount)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.duePayments} payments due soon
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdueAmount)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.overduePayments} payments overdue
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Filter payment schedule by month, property, and status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Month</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {format(selectedMonth, "MMMM yyyy")}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={selectedMonth}
                                            onSelect={(date) => date && setSelectedMonth(date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Property</label>
                                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All properties" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Properties</SelectItem>
                                        {mockProperties.map(property => (
                                            <SelectItem key={property.id} value={property.id}>
                                                {property.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="upcoming">Upcoming</SelectItem>
                                        <SelectItem value="due">Due Soon</SelectItem>
                                        <SelectItem value="overdue">Overdue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Schedule Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Payment Schedule</CardTitle>
                                <CardDescription>
                                    {paymentSchedule.length} payments for {format(selectedMonth, "MMMM yyyy")}
                                </CardDescription>
                            </div>
                            {selectedPayments.length > 0 && (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        Send Reminders ({selectedPayments.length})
                                    </Button>
                                    <Button size="sm">
                                        Record Payments ({selectedPayments.length})
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedPayments.length === paymentSchedule.length && paymentSchedule.length > 0}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>Tenant</TableHead>
                                        <TableHead>Property/Unit</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paymentSchedule.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedPayments.includes(payment.id)}
                                                    onCheckedChange={(checked) => handleSelectPayment(payment.id, checked as boolean)}
                                                />
                                            </TableCell>
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
                                                <div className="font-medium">{formatCurrency(payment.amount)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {format(payment.dueDate, "MMM dd, yyyy")}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {format(payment.dueDate, "EEEE")}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(payment.status)}
                                                    <Badge className={getStatusColor(payment.status)}>
                                                        {getStatusLabel(payment.status)}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">
                                                        Send Reminder
                                                    </Button>
                                                    <Button size="sm">
                                                        Record Payment
                                                    </Button>
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