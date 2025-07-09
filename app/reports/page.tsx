"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Building,
    CalendarIcon,
    Download,
    BarChart3,
    PieChart,
    LineChart
} from "lucide-react"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { cn } from "@/lib/utils"
import { mockPayments, mockProperties, mockUnits, mockLeases } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"

export default function ReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState("current")
    const [selectedProperty, setSelectedProperty] = useState("all")
    const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined)
    const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined)

    // Calculate date range based on selected period
    const dateRange = useMemo(() => {
        const now = new Date()
        let startDate: Date
        let endDate: Date

        switch (selectedPeriod) {
            case "current":
                startDate = startOfMonth(now)
                endDate = endOfMonth(now)
                break
            case "last":
                startDate = startOfMonth(subMonths(now, 1))
                endDate = endOfMonth(subMonths(now, 1))
                break
            case "quarter":
                startDate = startOfMonth(subMonths(now, 3))
                endDate = endOfMonth(now)
                break
            case "year":
                startDate = new Date(now.getFullYear(), 0, 1)
                endDate = new Date(now.getFullYear(), 11, 31)
                break
            case "custom":
                startDate = customStartDate || startOfMonth(now)
                endDate = customEndDate || endOfMonth(now)
                break
            default:
                startDate = startOfMonth(now)
                endDate = endOfMonth(now)
        }

        return { startDate, endDate }
    }, [selectedPeriod, customStartDate, customEndDate])

    // Filter payments by date range and property
    const filteredPayments = useMemo(() => {
        return mockPayments.filter(payment => {
            const paymentDate = new Date(payment.paidDate || payment.dueDate)
            const inDateRange = paymentDate >= dateRange.startDate && paymentDate <= dateRange.endDate

            if (selectedProperty === "all") return inDateRange

            const unit = mockUnits.find(u => u.id === payment.unitId)
            return inDateRange && unit?.propertyId === selectedProperty
        })
    }, [dateRange, selectedProperty])

    // Calculate financial metrics
    const financialMetrics = useMemo(() => {
        const totalIncome = filteredPayments
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0)

        const pendingPayments = filteredPayments
            .filter(p => p.status === 'pending')
            .reduce((sum, p) => sum + p.amount, 0)

        const overduePayments = filteredPayments
            .filter(p => p.status === 'overdue' || p.status === 'late')
            .reduce((sum, p) => sum + p.amount, 0)

        // Mock expenses (in a real app, this would come from expense data)
        const totalExpenses = totalIncome * 0.3 // 30% of income as expenses
        const netIncome = totalIncome - totalExpenses

        // Calculate by payment type
        const incomeByType = filteredPayments
            .filter(p => p.status === 'paid')
            .reduce((acc, payment) => {
                acc[payment.type] = (acc[payment.type] || 0) + payment.amount
                return acc
            }, {} as Record<string, number>)

        // Calculate by property
        const incomeByProperty = filteredPayments
            .filter(p => p.status === 'paid')
            .reduce((acc, payment) => {
                const unit = mockUnits.find(u => u.id === payment.unitId)
                const property = unit ? mockProperties.find(p => p.id === unit.propertyId) : null
                const propertyName = property?.name || 'Unknown'
                acc[propertyName] = (acc[propertyName] || 0) + payment.amount
                return acc
            }, {} as Record<string, number>)

        return {
            totalIncome,
            pendingPayments,
            overduePayments,
            totalExpenses,
            netIncome,
            incomeByType,
            incomeByProperty
        }
    }, [filteredPayments])

    // Mock expense categories
    const expenseCategories = [
        { category: "Maintenance", amount: financialMetrics.totalExpenses * 0.4 },
        { category: "Property Management", amount: financialMetrics.totalExpenses * 0.25 },
        { category: "Insurance", amount: financialMetrics.totalExpenses * 0.15 },
        { category: "Utilities", amount: financialMetrics.totalExpenses * 0.1 },
        { category: "Property Taxes", amount: financialMetrics.totalExpenses * 0.1 }
    ]

    const getPeriodLabel = () => {
        switch (selectedPeriod) {
            case "current": return "Current Month"
            case "last": return "Last Month"
            case "quarter": return "Last 3 Months"
            case "year": return "This Year"
            case "custom": return "Custom Period"
            default: return "Current Month"
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
                        <p className="text-muted-foreground">
                            View detailed financial reports and analytics
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                        </Button>
                        <Button>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Generate Report
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Report Filters</CardTitle>
                        <CardDescription>Select the time period and property for your report</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Time Period</label>
                                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="current">Current Month</SelectItem>
                                        <SelectItem value="last">Last Month</SelectItem>
                                        <SelectItem value="quarter">Last 3 Months</SelectItem>
                                        <SelectItem value="year">This Year</SelectItem>
                                        <SelectItem value="custom">Custom Period</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedPeriod === "custom" && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Start Date</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !customStartDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {customStartDate ? format(customStartDate, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={customStartDate}
                                                    onSelect={setCustomStartDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">End Date</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !customEndDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {customEndDate ? format(customEndDate, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={customEndDate}
                                                    onSelect={setCustomEndDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </>
                            )}

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
                        </div>
                    </CardContent>
                </Card>

                {/* Financial Overview */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(financialMetrics.totalIncome)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {getPeriodLabel()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatCurrency(financialMetrics.totalExpenses)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {getPeriodLabel()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(financialMetrics.netIncome)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {getPeriodLabel()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {financialMetrics.totalIncome > 0
                                    ? Math.round((financialMetrics.netIncome / financialMetrics.totalIncome) * 100)
                                    : 0}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Net profit margin
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Reports */}
                <Tabs defaultValue="income" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="income">Income Report</TabsTrigger>
                        <TabsTrigger value="expenses">Expense Report</TabsTrigger>
                        <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
                        <TabsTrigger value="property">By Property</TabsTrigger>
                    </TabsList>

                    <TabsContent value="income" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Income Breakdown</CardTitle>
                                <CardDescription>Income categorized by payment type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(financialMetrics.incomeByType).map(([type, amount]) => (
                                            <div key={type} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <div className="font-medium capitalize">{type.replace('_', ' ')}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {financialMetrics.totalIncome > 0
                                                            ? Math.round((amount / financialMetrics.totalIncome) * 100)
                                                            : 0}% of total
                                                    </div>
                                                </div>
                                                <div className="text-lg font-semibold">{formatCurrency(amount)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="expenses" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Expense Breakdown</CardTitle>
                                <CardDescription>Expenses categorized by type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Percentage</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {expenseCategories.map((expense) => (
                                            <TableRow key={expense.category}>
                                                <TableCell className="font-medium">{expense.category}</TableCell>
                                                <TableCell>{formatCurrency(expense.amount)}</TableCell>
                                                <TableCell>
                                                    {financialMetrics.totalExpenses > 0
                                                        ? Math.round((expense.amount / financialMetrics.totalExpenses) * 100)
                                                        : 0}%
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="font-semibold">
                                            <TableCell>Total Expenses</TableCell>
                                            <TableCell>{formatCurrency(financialMetrics.totalExpenses)}</TableCell>
                                            <TableCell>100%</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="profit-loss" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profit & Loss Statement</CardTitle>
                                <CardDescription>Summary of income, expenses, and net profit</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                        <div>
                                            <div className="font-medium text-green-800">Total Income</div>
                                            <div className="text-sm text-green-600">All revenue received</div>
                                        </div>
                                        <div className="text-lg font-semibold text-green-800">
                                            {formatCurrency(financialMetrics.totalIncome)}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">Expenses</div>
                                        {expenseCategories.map((expense) => (
                                            <div key={expense.category} className="flex justify-between items-center">
                                                <span className="text-sm">{expense.category}</span>
                                                <span className="text-sm text-red-600">-{formatCurrency(expense.amount)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                                        <div>
                                            <div className="font-medium text-blue-800">Net Income</div>
                                            <div className="text-sm text-blue-600">Income minus expenses</div>
                                        </div>
                                        <div className="text-lg font-semibold text-blue-800">
                                            {formatCurrency(financialMetrics.netIncome)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="property" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Income by Property</CardTitle>
                                <CardDescription>Revenue breakdown by property</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(financialMetrics.incomeByProperty).map(([propertyName, amount]) => (
                                        <div key={propertyName} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Building className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <div className="font-medium">{propertyName}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {financialMetrics.totalIncome > 0
                                                            ? Math.round((amount / financialMetrics.totalIncome) * 100)
                                                            : 0}% of total income
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-lg font-semibold">{formatCurrency(amount)}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
} 