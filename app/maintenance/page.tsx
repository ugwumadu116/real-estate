"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import {
    AlertTriangle,
    Clock,
    CheckCircle,
    Wrench,
    Plus,
    Search,
    Filter,
    Calendar,
    DollarSign
} from "lucide-react"
import { mockMaintenanceRequests, mockVendors, mockProperties, mockUsers } from "@/lib/mock-data"
import { MaintenanceRequest, MaintenanceStatus, MaintenancePriority, MaintenanceCategory } from "@/lib/types"
import Link from "next/link"

export default function MaintenancePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | "all">("all")
    const [priorityFilter, setPriorityFilter] = useState<MaintenancePriority | "all">("all")
    const [categoryFilter, setCategoryFilter] = useState<MaintenanceCategory | "all">("all")

    // Calculate maintenance statistics
    const totalRequests = mockMaintenanceRequests.length
    const openRequests = mockMaintenanceRequests.filter(req => req.status === "open").length
    const inProgressRequests = mockMaintenanceRequests.filter(req => req.status === "in_progress").length
    const completedRequests = mockMaintenanceRequests.filter(req => req.status === "completed").length
    const emergencyRequests = mockMaintenanceRequests.filter(req => req.priority === "emergency").length

    // Filter maintenance requests
    const filteredRequests = mockMaintenanceRequests.filter(request => {
        const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || request.status === statusFilter
        const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter
        const matchesCategory = categoryFilter === "all" || request.category === categoryFilter

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })

    const getStatusBadge = (status: MaintenanceStatus) => {
        const statusConfig = {
            open: { variant: "secondary" as const, text: "Open" },
            assigned: { variant: "default" as const, text: "Assigned" },
            in_progress: { variant: "default" as const, text: "In Progress" },
            completed: { variant: "default" as const, text: "Completed" },
            cancelled: { variant: "destructive" as const, text: "Cancelled" }
        }
        const config = statusConfig[status]
        return <Badge variant={config.variant}>{config.text}</Badge>
    }

    const getPriorityBadge = (priority: MaintenancePriority) => {
        const priorityConfig = {
            low: { variant: "secondary" as const, text: "Low", icon: null },
            medium: { variant: "default" as const, text: "Medium", icon: null },
            high: { variant: "default" as const, text: "High", icon: <AlertTriangle className="w-3 h-3" /> },
            emergency: { variant: "destructive" as const, text: "Emergency", icon: <AlertTriangle className="w-3 h-3" /> }
        }
        const config = priorityConfig[priority]
        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                {config.icon}
                {config.text}
            </Badge>
        )
    }

    const getCategoryIcon = (category: MaintenanceCategory) => {
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
        return icons[category] || "🔧"
    }

    const getVendorName = (vendorId?: string) => {
        if (!vendorId) return "Unassigned"
        const vendor = mockVendors.find(v => v.id === vendorId)
        return vendor?.name || "Unknown Vendor"
    }

    const getTenantName = (tenantId: string) => {
        const tenant = mockUsers.find(u => u.id === tenantId)
        return tenant?.name || "Unknown Tenant"
    }

    const getPropertyName = (propertyId: string) => {
        const property = mockProperties.find(p => p.id === propertyId)
        return property?.name || "Unknown Property"
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
                        <p className="text-muted-foreground">
                            Manage maintenance requests and work orders
                        </p>
                    </div>
                    <Link href="/maintenance/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            New Request
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalRequests}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Open</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{openRequests}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{inProgressRequests}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completedRequests}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Emergency</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{emergencyRequests}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search requests..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as MaintenanceStatus | "all")}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="assigned">Assigned</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Priority</label>
                                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as MaintenancePriority | "all")}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priorities</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="emergency">Emergency</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as MaintenanceCategory | "all")}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
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
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm("")
                                        setStatusFilter("all")
                                        setPriorityFilter("all")
                                        setCategoryFilter("all")
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Maintenance Requests Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Maintenance Requests</CardTitle>
                        <CardDescription>
                            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Request</TableHead>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Tenant</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Cost</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRequests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>
                                            <div>
                                                <Link
                                                    href={`/maintenance/${request.id}`}
                                                    className="font-medium hover:underline"
                                                >
                                                    {request.title}
                                                </Link>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {request.description}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getPropertyName(request.propertyId)}</TableCell>
                                        <TableCell>{getTenantName(request.tenantId)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span>{getCategoryIcon(request.category)}</span>
                                                <span className="capitalize">{request.category.replace('_', ' ')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                                        <TableCell>{getVendorName(request.assignedVendorId)}</TableCell>
                                        <TableCell>
                                            {request.actualCost ? (
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" />
                                                    {request.actualCost}
                                                </div>
                                            ) : request.estimatedCost ? (
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <DollarSign className="w-3 h-3" />
                                                    ~{request.estimatedCost}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                                {request.createdAt.toLocaleDateString()}
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