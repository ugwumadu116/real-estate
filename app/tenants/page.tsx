"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Search,
    Plus,
    Users,
    Home,
    Calendar,
    Phone,
    Mail,
    Eye,
    Edit,
    Filter,
    AlertTriangle
} from "lucide-react"
import { mockTenants, mockUnits, mockProperties, mockLeases } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import Link from "next/link"

export default function TenantsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [propertyFilter, setPropertyFilter] = useState("all")

    const filteredTenants = mockTenants.filter((tenant) => {
        const matchesSearch =
            tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.phone.includes(searchTerm)

        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" && tenant.isActive) ||
            (statusFilter === "inactive" && !tenant.isActive)

        const matchesProperty = propertyFilter === "all" ||
            (tenant.currentUnitId && getPropertyByUnitId(tenant.currentUnitId)?.id === propertyFilter)

        return matchesSearch && matchesStatus && matchesProperty
    })

    const getPropertyByUnitId = (unitId: string) => {
        const unit = mockUnits.find(u => u.id === unitId)
        return unit ? mockProperties.find(p => p.id === unit.propertyId) : null
    }

    const getUnitByTenantId = (tenantId: string) => {
        return mockUnits.find(u => u.currentTenantId === tenantId)
    }

    const getLeaseByTenantId = (tenantId: string) => {
        return mockLeases.find(l => l.tenantId === tenantId)
    }

    const getOverduePayments = (tenantId: string) => {
        // This would be calculated from actual payment data
        // For now, return a mock value
        return Math.random() > 0.7 ? 1 : 0
    }

    const getStatusColor = (isActive: boolean) => {
        return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
                        <p className="text-muted-foreground">
                            Manage tenant information and profiles
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/tenants/add">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Tenant
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Total Tenants</p>
                                    <p className="text-2xl font-bold">{mockTenants.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Home className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Active Tenants</p>
                                    <p className="text-2xl font-bold">
                                        {mockTenants.filter(t => t.isActive).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Leases Expiring</p>
                                    <p className="text-2xl font-bold">
                                        {mockLeases.filter(l => {
                                            const daysUntilExpiry = Math.ceil((l.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                            return daysUntilExpiry <= 30 && daysUntilExpiry > 0
                                        }).length}
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
                                    <p className="text-sm font-medium">Overdue Payments</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {mockTenants.filter(t => getOverduePayments(t.id) > 0).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search tenants..."
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
                                    <SelectItem value="inactive">Inactive</SelectItem>
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
                        Showing {filteredTenants.length} of {mockTenants.length} tenants
                    </p>
                </div>

                {/* Tenants Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tenant Directory</CardTitle>
                        <CardDescription>
                            Manage tenant information and view their current status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tenant</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Current Unit</TableHead>
                                    <TableHead>Lease Status</TableHead>
                                    <TableHead>Move-in Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTenants.map((tenant) => {
                                    const unit = getUnitByTenantId(tenant.id)
                                    const property = unit ? getPropertyByUnitId(unit.id) : null
                                    const lease = getLeaseByTenantId(tenant.id)
                                    const overduePayments = getOverduePayments(tenant.id)

                                    return (
                                        <TableRow key={tenant.id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarImage src="/placeholder-user.jpg" />
                                                        <AvatarFallback>
                                                            {tenant.name.split(" ").map((n) => n[0]).join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{tenant.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {tenant.dateOfBirth ?
                                                                `${new Date().getFullYear() - tenant.dateOfBirth.getFullYear()} years old` :
                                                                'Age not specified'
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm">
                                                        <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                                                        {tenant.email}
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                                                        {tenant.phone}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {unit && property ? (
                                                    <div>
                                                        <div className="font-medium">{unit.number}</div>
                                                        <div className="text-sm text-muted-foreground">{property.name}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">No unit assigned</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {lease ? (
                                                    <div>
                                                        <div className="font-medium">${lease.rent.toLocaleString()}/month</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Expires {new Date(lease.endDate).toLocaleDateString()}
                                                        </div>
                                                        {overduePayments > 0 && (
                                                            <Badge variant="destructive" className="text-xs mt-1">
                                                                {overduePayments} overdue payment{overduePayments > 1 ? 's' : ''}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">No active lease</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {tenant.moveInDate ? (
                                                    <div>
                                                        <div className="font-medium">
                                                            {new Date(tenant.moveInDate).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {Math.floor((new Date().getTime() - tenant.moveInDate.getTime()) / (1000 * 60 * 60 * 24))} days
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">Not specified</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(tenant.isActive)}>
                                                    {tenant.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/tenants/${tenant.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/tenants/${tenant.id}/edit`}>
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

                        {filteredTenants.length === 0 && (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-muted-foreground text-lg mb-4">No tenants found matching your criteria.</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm("")
                                        setStatusFilter("all")
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