"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Search,
    Plus,
    FileText,
    Users,
    Calendar,
    DollarSign,
    Eye,
    Edit,
    AlertTriangle,
    CheckCircle,
    Clock,
    X
} from "lucide-react"
import { mockLeases, mockTenants, mockUnits, mockProperties } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import { LeaseStatus, LeaseType } from "@/lib/types"
import Link from "next/link"
import { format } from "date-fns"

export default function LeasesPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [propertyFilter, setPropertyFilter] = useState("all")

    const filteredLeases = mockLeases.filter((lease) => {
        const tenant = mockTenants.find(t => t.id === lease.tenantId)
        const unit = mockUnits.find(u => u.id === lease.unitId)
        const property = unit ? mockProperties.find(p => p.id === unit.propertyId) : null

        const matchesSearch =
            (tenant?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (unit?.number.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (property?.name.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesStatus = statusFilter === "all" || lease.status === statusFilter
        const matchesType = typeFilter === "all" || lease.type === typeFilter
        const matchesProperty = propertyFilter === "all" || lease.propertyId === propertyFilter

        return matchesSearch && matchesStatus && matchesType && matchesProperty
    })

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

    const getDaysUntilExpiry = (endDate: Date) => {
        const days = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return days
    }

    const getExpiryStatus = (endDate: Date) => {
        const days = getDaysUntilExpiry(endDate)
        if (days < 0) return "expired"
        if (days <= 30) return "expiring_soon"
        if (days <= 90) return "expiring_later"
        return "active"
    }

    const getExpiryColor = (endDate: Date) => {
        const status = getExpiryStatus(endDate)
        switch (status) {
            case "expired": return "text-red-600"
            case "expiring_soon": return "text-orange-600"
            case "expiring_later": return "text-yellow-600"
            default: return "text-green-600"
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Leases</h1>
                        <p className="text-muted-foreground">
                            Manage lease agreements and track their status
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/leases/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Lease
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Total Leases</p>
                                    <p className="text-2xl font-bold">{mockLeases.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Active Leases</p>
                                    <p className="text-2xl font-bold">
                                        {mockLeases.filter(l => l.status === "active").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Expiring Soon</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {mockLeases.filter(l => getExpiryStatus(l.endDate) === "expiring_soon").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Monthly Revenue</p>
                                    <p className="text-2xl font-bold">
                                        ${mockLeases.filter(l => l.status === "active").reduce((sum, l) => sum + l.rent, 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search leases..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="terminated">Terminated</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by property" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Properties</SelectItem>
                                    {mockProperties.map((property) => (
                                        <SelectItem key={property.id} value={property.id}>
                                            {property.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("")
                                    setStatusFilter("all")
                                    setTypeFilter("all")
                                    setPropertyFilter("all")
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">
                        Showing {filteredLeases.length} of {mockLeases.length} leases
                    </p>
                </div>

                {/* Leases Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lease Agreements</CardTitle>
                        <CardDescription>
                            Manage and track all lease agreements
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tenant</TableHead>
                                    <TableHead>Unit & Property</TableHead>
                                    <TableHead>Lease Details</TableHead>
                                    <TableHead>Financial</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLeases.map((lease) => {
                                    const tenant = mockTenants.find(t => t.id === lease.tenantId)
                                    const unit = mockUnits.find(u => u.id === lease.unitId)
                                    const property = unit ? mockProperties.find(p => p.id === unit.propertyId) : null
                                    const daysUntilExpiry = getDaysUntilExpiry(lease.endDate)

                                    return (
                                        <TableRow key={lease.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{tenant?.name || "Unknown Tenant"}</div>
                                                    <div className="text-sm text-muted-foreground">{tenant?.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {unit && property ? (
                                                    <div>
                                                        <div className="font-medium">{unit.number}</div>
                                                        <div className="text-sm text-muted-foreground">{property.name}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">Unit not found</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="capitalize">
                                                            {lease.type}
                                                        </Badge>
                                                        <Badge className={getStatusColor(lease.status)}>
                                                            {lease.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {format(new Date(lease.startDate), "MMM dd, yyyy")} - {format(new Date(lease.endDate), "MMM dd, yyyy")}
                                                    </div>
                                                    <div className={`text-sm ${getExpiryColor(lease.endDate)}`}>
                                                        {daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : `${Math.abs(daysUntilExpiry)} days expired`}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium">${lease.rent.toLocaleString()}/month</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Deposit: ${lease.deposit.toLocaleString()}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Late fee: ${lease.lateFee}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(lease.status)}
                                                    <Badge className={getStatusColor(lease.status)}>
                                                        {lease.status}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/leases/${lease.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/leases/${lease.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>

                        {filteredLeases.length === 0 && (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-muted-foreground text-lg mb-4">No leases found matching your criteria.</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm("")
                                        setStatusFilter("all")
                                        setTypeFilter("all")
                                        setPropertyFilter("all")
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
} 