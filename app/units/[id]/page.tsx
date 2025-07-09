"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeft,
    Edit,
    Users,
    Home,
    DollarSign,
    Calendar,
    MapPin,
    Phone,
    Mail,
    FileText,
    Wrench,
    AlertTriangle,
    CheckCircle,
    Clock
} from "lucide-react"
import { mockUnits, mockProperties, mockTenants, mockLeases, mockMaintenanceRequests } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UnitStatus } from "@/lib/types"
import Link from "next/link"
import { format } from "date-fns"

export default function UnitDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const unitId = params.id as string

    const unit = mockUnits.find((u) => u.id === unitId)
    const property = unit ? mockProperties.find((p) => p.id === unit.propertyId) : null
    const tenant = unit?.currentTenantId ? mockTenants.find((t) => t.id === unit.currentTenantId) : null
    const lease = unit?.currentLeaseId ? mockLeases.find((l) => l.id === unit.currentLeaseId) : null
    const maintenanceRequests = mockMaintenanceRequests.filter((m) => m.unitId === unitId)

    const getStatusColor = (status: UnitStatus) => {
        switch (status) {
            case "available": return "bg-green-100 text-green-800"
            case "occupied": return "bg-blue-100 text-blue-800"
            case "under_maintenance": return "bg-yellow-100 text-yellow-800"
            case "reserved": return "bg-purple-100 text-purple-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusIcon = (status: UnitStatus) => {
        switch (status) {
            case "available": return <CheckCircle className="h-4 w-4" />
            case "occupied": return <Users className="h-4 w-4" />
            case "under_maintenance": return <Wrench className="h-4 w-4" />
            case "reserved": return <Clock className="h-4 w-4" />
            default: return <Home className="h-4 w-4" />
        }
    }

    if (!unit || !property) {
        return (
            <DashboardLayout>
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Unit Not Found</h1>
                    <p className="text-muted-foreground mb-4">The unit you're looking for doesn't exist.</p>
                    <Button asChild>
                        <Link href="/properties">Back to Properties</Link>
                    </Button>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={`/properties/${property.id}/units`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Unit {unit.number}</h1>
                            <p className="text-muted-foreground">
                                {property.name} • {unit.bedrooms}BR, {unit.bathrooms}BA • {unit.area} sq ft
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/units/${unitId}/condition-reports`}>
                                <FileText className="h-4 w-4 mr-2" />
                                Condition Reports
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/properties/${property.id}/units`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Unit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="overview" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="tenant">Tenant Info</TabsTrigger>
                                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                {/* Unit Status Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            {getStatusIcon(unit.status)}
                                            Unit Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <Badge className={`${getStatusColor(unit.status)} text-sm font-medium`}>
                                                {unit.status.replace("_", " ")}
                                            </Badge>
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">Monthly Rent</p>
                                                <p className="text-2xl font-bold">${unit.rent.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Unit Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Unit Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
                                                <div className="font-semibold">{unit.bedrooms}</div>
                                                <div className="text-sm text-muted-foreground">Bedrooms</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
                                                <div className="font-semibold">{unit.bathrooms}</div>
                                                <div className="text-sm text-muted-foreground">Bathrooms</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                                                <div className="font-semibold">{unit.area}</div>
                                                <div className="text-sm text-muted-foreground">Sq Ft</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
                                                <div className="font-semibold">{unit.floor || "N/A"}</div>
                                                <div className="text-sm text-muted-foreground">Floor</div>
                                            </div>
                                        </div>

                                        <Separator className="my-6" />

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold mb-2">Description</h4>
                                                <p className="text-muted-foreground">
                                                    {unit.description || "No description available."}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Amenities</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {unit.amenities.length > 0 ? (
                                                        unit.amenities.map((amenity, index) => (
                                                            <Badge key={index} variant="outline">
                                                                {amenity}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <p className="text-muted-foreground">No amenities listed.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Financial Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Financial Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Monthly Rent</span>
                                                    <span className="font-semibold">${unit.rent.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Security Deposit</span>
                                                    <span className="font-semibold">${unit.deposit.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Rent per Sq Ft</span>
                                                    <span className="font-semibold">${(unit.rent / unit.area).toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Annual Rent</span>
                                                    <span className="font-semibold">${(unit.rent * 12).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Total Deposit</span>
                                                    <span className="font-semibold">${unit.deposit.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">ROI (Est.)</span>
                                                    <span className="font-semibold text-green-600">
                                                        {((unit.rent * 12) / (unit.area * 200) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="tenant" className="space-y-6">
                                {tenant ? (
                                    <>
                                        {/* Current Tenant */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Current Tenant</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                                        <span className="text-primary-foreground font-semibold text-lg">
                                                            {tenant.name.split(" ").map((n) => n[0]).join("")}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-lg">{tenant.name}</h3>
                                                        <div className="space-y-2 mt-2">
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Mail className="h-4 w-4" />
                                                                <span>{tenant.email}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Phone className="h-4 w-4" />
                                                                <span>{tenant.phone}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/tenants/${tenant.id}`}>View Profile</Link>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Lease Information */}
                                        {lease && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Current Lease</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Lease Period</p>
                                                            <p className="font-semibold">
                                                                {format(new Date(lease.startDate), "MMM dd, yyyy")} - {format(new Date(lease.endDate), "MMM dd, yyyy")}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Monthly Rent</p>
                                                            <p className="font-semibold">${lease.rent.toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Security Deposit</p>
                                                            <p className="font-semibold">${lease.deposit.toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Status</p>
                                                            <Badge variant={lease.status === 'active' ? 'default' : 'secondary'}>
                                                                {lease.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <p className="text-sm text-muted-foreground">Terms</p>
                                                        <p className="text-sm">{lease.terms}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </>
                                ) : (
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                            <h3 className="text-lg font-semibold mb-2">No Current Tenant</h3>
                                            <p className="text-muted-foreground mb-4">
                                                This unit is currently available for rent.
                                            </p>
                                            <Button asChild>
                                                <Link href={`/properties/${property.id}/units`}>
                                                    Assign Tenant
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="maintenance" className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Maintenance Requests</h3>
                                    <Button size="sm" asChild>
                                        <Link href="/maintenance/create">New Request</Link>
                                    </Button>
                                </div>

                                {maintenanceRequests.length > 0 ? (
                                    <div className="space-y-4">
                                        {maintenanceRequests.map((request) => (
                                            <Card key={request.id}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h4 className="font-semibold">{request.title}</h4>
                                                                <Badge variant={
                                                                    request.priority === 'emergency' ? 'destructive' :
                                                                        request.priority === 'high' ? 'default' :
                                                                            request.priority === 'medium' ? 'secondary' : 'outline'
                                                                }>
                                                                    {request.priority}
                                                                </Badge>
                                                                <Badge variant={
                                                                    request.status === 'completed' ? 'default' :
                                                                        request.status === 'in_progress' ? 'secondary' :
                                                                            'outline'
                                                                }>
                                                                    {request.status.replace('_', ' ')}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mb-2">
                                                                {request.description}
                                                            </p>
                                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                                <span>Category: {request.category.replace('_', ' ')}</span>
                                                                <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                                                                {request.estimatedCost && (
                                                                    <span>Est. Cost: ${request.estimatedCost}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/maintenance/${request.id}`}>View Details</Link>
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                            <h3 className="text-lg font-semibold mb-2">No Maintenance Requests</h3>
                                            <p className="text-muted-foreground">
                                                No maintenance requests have been submitted for this unit.
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="documents" className="space-y-6">
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold mb-2">No Documents</h3>
                                        <p className="text-muted-foreground">
                                            No documents have been uploaded for this unit yet.
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Property Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">{property.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {property.address.street}, {property.address.city}, {property.address.state}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Property Type</span>
                                        <span className="font-medium capitalize">{property.type}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Total Units</span>
                                        <span className="font-medium">{property.totalUnits}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Occupancy Rate</span>
                                        <span className="font-medium">
                                            {Math.round((property.occupiedUnits / property.totalUnits) * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <Button variant="outline" asChild className="w-full">
                                    <Link href={`/property/${property.id}`}>View Property</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
} 