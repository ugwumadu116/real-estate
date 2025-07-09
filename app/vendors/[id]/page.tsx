"use client"

import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
    ArrowLeft,
    Star,
    Phone,
    Mail,
    MapPin,
    Wrench,
    Calendar,
    DollarSign,
    Award,
    Clock,
    CheckCircle,
    AlertTriangle,
    MessageSquare,
    Edit
} from "lucide-react"
import { mockVendors, mockMaintenanceRequests, mockProperties, mockUsers } from "@/lib/mock-data"
import { MaintenanceStatus, MaintenancePriority } from "@/lib/types"
import Link from "next/link"

export default function VendorDetailPage() {
    const params = useParams()

    // Get vendor
    const vendor = mockVendors.find(v => v.id === params.id)

    if (!vendor) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/vendors">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Vendors
                            </Button>
                        </Link>
                    </div>
                    <div className="text-center py-12">
                        <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">Vendor not found</h2>
                        <p className="text-muted-foreground">The vendor you're looking for doesn't exist.</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    // Get vendor's maintenance requests
    const vendorRequests = mockMaintenanceRequests.filter(req => req.assignedVendorId === vendor.id)
    const activeRequests = vendorRequests.filter(req => ["assigned", "in_progress"].includes(req.status))
    const completedRequests = vendorRequests.filter(req => req.status === "completed")
    const totalEarnings = completedRequests.reduce((sum, req) => sum + (req.actualCost || 0), 0)

    // Calculate performance metrics
    const completionRate = vendorRequests.length > 0 ? (completedRequests.length / vendorRequests.length) * 100 : 0
    const averageRating = vendor.rating
    const responseTime = "2.3 days" // Mock data

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
            low: { variant: "secondary" as const, text: "Low" },
            medium: { variant: "default" as const, text: "Medium" },
            high: { variant: "default" as const, text: "High" },
            emergency: { variant: "destructive" as const, text: "Emergency" }
        }
        const config = priorityConfig[priority]
        return <Badge variant={config.variant}>{config.text}</Badge>
    }

    const getVendorInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    const getPropertyName = (propertyId: string) => {
        const property = mockProperties.find(p => p.id === propertyId)
        return property?.name || "Unknown Property"
    }

    const getTenantName = (tenantId: string) => {
        const tenant = mockUsers.find(u => u.id === tenantId)
        return tenant?.name || "Unknown Tenant"
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/vendors">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Vendors
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{vendor.name}</h1>
                            <p className="text-muted-foreground">
                                Vendor Profile & Performance
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/vendors/${vendor.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        </Link>
                        <Button>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Vendor Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Vendor Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarFallback className="text-lg">
                                            {getVendorInitials(vendor.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-semibold">{vendor.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-medium">{vendor.rating}/5</span>
                                                <span className="text-muted-foreground">
                                                    ({vendor.totalJobs} total jobs)
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">{vendor.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">{vendor.phone}</span>
                                            </div>
                                            {vendor.address && (
                                                <div className="flex items-center gap-2 col-span-2">
                                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm">{vendor.address}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Specialties</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {vendor.specialties.map(specialty => (
                                                    <Badge key={specialty} variant="secondary">
                                                        {specialty.replace('_', ' ')}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {vendor.licenseNumber && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">License Number</Label>
                                                <p className="mt-1 text-sm">{vendor.licenseNumber}</p>
                                            </div>
                                        )}

                                        {vendor.insuranceInfo && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Insurance</Label>
                                                <p className="mt-1 text-sm">{vendor.insuranceInfo}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Performance Metrics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Metrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{vendorRequests.length}</div>
                                        <div className="text-sm text-muted-foreground">Total Jobs</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{activeRequests.length}</div>
                                        <div className="text-sm text-muted-foreground">Active Jobs</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
                                        <div className="text-sm text-muted-foreground">Completion Rate</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
                                        <div className="text-sm text-muted-foreground">Total Earnings</div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Completion Rate</span>
                                            <span>{completionRate.toFixed(1)}%</span>
                                        </div>
                                        <Progress value={completionRate} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Average Rating</span>
                                            <span>{averageRating}/5</span>
                                        </div>
                                        <Progress value={(averageRating / 5) * 100} className="h-2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Jobs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Jobs</CardTitle>
                                <CardDescription>
                                    Latest maintenance requests assigned to this vendor
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Request</TableHead>
                                            <TableHead>Property</TableHead>
                                            <TableHead>Priority</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Cost</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vendorRequests.slice(0, 5).map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>
                                                    <div>
                                                        <Link
                                                            href={`/maintenance/${request.id}`}
                                                            className="font-medium hover:underline"
                                                        >
                                                            {request.title}
                                                        </Link>
                                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                                            {request.description}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getPropertyName(request.propertyId)}</TableCell>
                                                <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                                                <TableCell>{getStatusBadge(request.status)}</TableCell>
                                                <TableCell>
                                                    {request.actualCost ? (
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign className="w-3 h-3" />
                                                            {request.actualCost}
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

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Response Time</span>
                                    <span className="font-medium">{responseTime}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Active Jobs</span>
                                    <span className="font-medium">{activeRequests.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Completed This Month</span>
                                    <span className="font-medium">
                                        {completedRequests.filter(req =>
                                            req.completedDate &&
                                            req.completedDate.getMonth() === new Date().getMonth()
                                        ).length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Average Job Cost</span>
                                    <span className="font-medium">
                                        ${completedRequests.length > 0
                                            ? (totalEarnings / completedRequests.length).toFixed(0)
                                            : '0'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Vendor
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send Email
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Send Message
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge variant={vendor.isActive ? "default" : "secondary"} className="w-full justify-center">
                                    {vendor.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {vendor.isActive
                                        ? "This vendor is currently accepting new assignments."
                                        : "This vendor is not currently accepting new assignments."
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
} 