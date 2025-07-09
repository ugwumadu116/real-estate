"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    ArrowLeft,
    Edit,
    Save,
    AlertTriangle,
    Clock,
    CheckCircle,
    Wrench,
    Calendar,
    DollarSign,
    User,
    Building,
    Home,
    MessageSquare,
    Phone,
    Mail
} from "lucide-react"
import { mockMaintenanceRequests, mockVendors, mockProperties, mockUsers } from "@/lib/mock-data"
import { MaintenanceRequest, MaintenanceStatus, MaintenancePriority, MaintenanceCategory } from "@/lib/types"
import Link from "next/link"

export default function MaintenanceDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Get maintenance request
    const request = mockMaintenanceRequests.find(r => r.id === params.id)

    if (!request) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/maintenance">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Maintenance
                            </Button>
                        </Link>
                    </div>
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>Maintenance request not found.</AlertDescription>
                    </Alert>
                </div>
            </DashboardLayout>
        )
    }

    // Get related data
    const vendor = request.assignedVendorId ? mockVendors.find(v => v.id === request.assignedVendorId) : null
    const tenant = mockUsers.find(u => u.id === request.tenantId)
    const property = mockProperties.find(p => p.id === request.propertyId)
    const unit = property?.units.find(u => u.id === request.unitId)

    // Form state for editing
    const [formData, setFormData] = useState({
        status: request.status,
        assignedVendorId: request.assignedVendorId || "",
        estimatedCost: request.estimatedCost?.toString() || "",
        actualCost: request.actualCost?.toString() || "",
        scheduledDate: request.scheduledDate?.toISOString().split('T')[0] || "",
        vendorNotes: request.vendorNotes || ""
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        setError("")
        setSuccess("")

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // In a real app, you would update the request via API
            console.log("Updated maintenance request:", {
                id: request.id,
                ...formData,
                estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
                actualCost: formData.actualCost ? parseFloat(formData.actualCost) : undefined,
                scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined
            })

            setSuccess("Maintenance request updated successfully!")
            setIsEditing(false)
        } catch (err) {
            setError("Failed to update maintenance request. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    const getStatusBadge = (status: MaintenanceStatus) => {
        const statusConfig = {
            open: { variant: "secondary" as const, text: "Open", icon: Clock },
            assigned: { variant: "default" as const, text: "Assigned", icon: Wrench },
            in_progress: { variant: "default" as const, text: "In Progress", icon: Wrench },
            completed: { variant: "default" as const, text: "Completed", icon: CheckCircle },
            cancelled: { variant: "destructive" as const, text: "Cancelled", icon: AlertTriangle }
        }
        const config = statusConfig[status]
        const Icon = config.icon
        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {config.text}
            </Badge>
        )
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

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/maintenance">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Maintenance
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{request.title}</h1>
                            <p className="text-muted-foreground">
                                Maintenance Request #{request.id}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusBadge(request.status)}
                        {getPriorityBadge(request.priority)}
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Request Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Request Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                    <p className="mt-1">{request.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span>{getCategoryIcon(request.category)}</span>
                                            <span className="capitalize">{request.category.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Calendar className="w-3 h-3 text-muted-foreground" />
                                            {request.createdAt.toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {request.tenantNotes && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Tenant Notes</Label>
                                        <p className="mt-1 text-sm bg-muted p-3 rounded-md">{request.tenantNotes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Assignment & Scheduling */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Assignment & Scheduling</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        {isEditing ? 'Cancel' : 'Edit'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Status</Label>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value) => handleInputChange("status", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="open">Open</SelectItem>
                                                    <SelectItem value="assigned">Assigned</SelectItem>
                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Assign Vendor</Label>
                                            <Select
                                                value={formData.assignedVendorId}
                                                onValueChange={(value) => handleInputChange("assignedVendorId", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select vendor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">Unassigned</SelectItem>
                                                    {mockVendors.map(vendor => (
                                                        <SelectItem key={vendor.id} value={vendor.id}>
                                                            {vendor.name} ({vendor.specialties.join(', ')})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Estimated Cost</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={formData.estimatedCost}
                                                        onChange={(e) => handleInputChange("estimatedCost", e.target.value)}
                                                        className="pl-8"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Actual Cost</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={formData.actualCost}
                                                        onChange={(e) => handleInputChange("actualCost", e.target.value)}
                                                        className="pl-8"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Scheduled Date</Label>
                                            <Input
                                                type="date"
                                                value={formData.scheduledDate}
                                                onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Vendor Notes</Label>
                                            <Textarea
                                                placeholder="Add notes from vendor..."
                                                value={formData.vendorNotes}
                                                onChange={(e) => handleInputChange("vendorNotes", e.target.value)}
                                                rows={3}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSave}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Assigned Vendor</Label>
                                                <p className="mt-1">{vendor?.name || "Unassigned"}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Scheduled Date</Label>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                                    {request.scheduledDate ? request.scheduledDate.toLocaleDateString() : "Not scheduled"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Estimated Cost</Label>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <DollarSign className="w-3 h-3 text-muted-foreground" />
                                                    {request.estimatedCost || "Not estimated"}
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Actual Cost</Label>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <DollarSign className="w-3 h-3 text-muted-foreground" />
                                                    {request.actualCost || "Not completed"}
                                                </div>
                                            </div>
                                        </div>

                                        {request.vendorNotes && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Vendor Notes</Label>
                                                <p className="mt-1 text-sm bg-muted p-3 rounded-md">{request.vendorNotes}</p>
                                            </div>
                                        )}

                                        {request.completedDate && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Completed Date</Label>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <CheckCircle className="w-3 h-3 text-muted-foreground" />
                                                    {request.completedDate.toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Property Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    Property
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Property</Label>
                                    <p className="mt-1">{property?.name}</p>
                                </div>
                                {unit && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Unit</Label>
                                        <p className="mt-1">Unit {unit.number} - {unit.type}</p>
                                    </div>
                                )}
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                                    <p className="mt-1 text-sm">
                                        {property?.address.street}<br />
                                        {property?.address.city}, {property?.address.state} {property?.address.zipCode}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tenant Information */}
                        {tenant && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Tenant
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                                        <p className="mt-1">{tenant.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-sm">{tenant.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-sm">{tenant.phone}</span>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Send Message
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Vendor Information */}
                        {vendor && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Wrench className="w-4 h-4" />
                                        Assigned Vendor
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                                        <p className="mt-1">{vendor.name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Specialties</Label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {vendor.specialties.map(specialty => (
                                                <Badge key={specialty} variant="secondary" className="text-xs">
                                                    {specialty.replace('_', ' ')}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-sm">{vendor.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-sm">{vendor.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Rating: {vendor.rating}/5 ({vendor.totalJobs} jobs)</span>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Contact Vendor
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
} 