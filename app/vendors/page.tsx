"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Search,
    Plus,
    Star,
    Phone,
    Mail,
    MapPin,
    Wrench,
    Users,
    Award
} from "lucide-react"
import { mockVendors, mockMaintenanceRequests } from "@/lib/mock-data"
import { Vendor, MaintenanceCategory } from "@/lib/types"
import Link from "next/link"

export default function VendorsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [specialtyFilter, setSpecialtyFilter] = useState<MaintenanceCategory | "all">("all")
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

    // Calculate vendor statistics
    const totalVendors = mockVendors.length
    const activeVendors = mockVendors.filter(v => v.isActive).length
    const topRatedVendors = mockVendors.filter(v => v.rating >= 4.5).length
    const totalJobs = mockVendors.reduce((sum, v) => sum + v.totalJobs, 0)

    // Filter vendors
    const filteredVendors = mockVendors.filter(vendor => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.phone.includes(searchTerm)
        const matchesSpecialty = specialtyFilter === "all" || vendor.specialties.includes(specialtyFilter)
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" && vendor.isActive) ||
            (statusFilter === "inactive" && !vendor.isActive)

        return matchesSearch && matchesSpecialty && matchesStatus
    })

    const getSpecialtyIcon = (specialty: MaintenanceCategory) => {
        const icons = {
            plumbing: "🚰",
            electrical: "⚡",
            hvac: "❄️",
            appliance: "🔌",
            structural: "🏗️",
            pest_control: "🐛",
            cleaning: "🧹",
            other: "🔧"
        }
        return icons[specialty] || "🔧"
    }

    const getVendorInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    const getVendorJobs = (vendorId: string) => {
        return mockMaintenanceRequests.filter(req => req.assignedVendorId === vendorId).length
    }

    const getVendorActiveJobs = (vendorId: string) => {
        return mockMaintenanceRequests.filter(req =>
            req.assignedVendorId === vendorId &&
            ["assigned", "in_progress"].includes(req.status)
        ).length
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
                        <p className="text-muted-foreground">
                            Manage vendor relationships and assignments
                        </p>
                    </div>
                    <Link href="/vendors/add">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Vendor
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalVendors}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeVendors}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Top Rated</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{topRatedVendors}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalJobs}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search vendors..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Specialty</label>
                                <Select value={specialtyFilter} onValueChange={(value) => setSpecialtyFilter(value as MaintenanceCategory | "all")}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Specialties</SelectItem>
                                        <SelectItem value="plumbing">Plumbing</SelectItem>
                                        <SelectItem value="electrical">Electrical</SelectItem>
                                        <SelectItem value="hvac">HVAC</SelectItem>
                                        <SelectItem value="appliance">Appliance</SelectItem>
                                        <SelectItem value="structural">Structural</SelectItem>
                                        <SelectItem value="pest_control">Pest Control</SelectItem>
                                        <SelectItem value="cleaning">Cleaning</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Vendors Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Vendor Directory</CardTitle>
                        <CardDescription>
                            {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Specialties</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Jobs</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVendors.map((vendor) => (
                                    <TableRow key={vendor.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {getVendorInitials(vendor.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <Link
                                                        href={`/vendors/${vendor.id}`}
                                                        className="font-medium hover:underline"
                                                    >
                                                        {vendor.name}
                                                    </Link>
                                                    {vendor.address && (
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <MapPin className="w-3 h-3" />
                                                            {vendor.address}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {vendor.specialties.map(specialty => (
                                                    <Badge key={specialty} variant="secondary" className="text-xs">
                                                        <span className="mr-1">{getSpecialtyIcon(specialty)}</span>
                                                        {specialty.replace('_', ' ')}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-medium">{vendor.rating}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    ({vendor.totalJobs} jobs)
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-sm">
                                                    <span className="font-medium">{getVendorActiveJobs(vendor.id)}</span> active
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {getVendorJobs(vendor.id)} total assigned
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Mail className="w-3 h-3 text-muted-foreground" />
                                                    {vendor.email}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Phone className="w-3 h-3 text-muted-foreground" />
                                                    {vendor.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={vendor.isActive ? "default" : "secondary"}>
                                                {vendor.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/vendors/${vendor.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link href={`/vendors/${vendor.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
} 