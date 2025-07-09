"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    ArrowLeft,
    Save,
    Upload,
    AlertTriangle,
    Clock,
    CheckCircle,
    Wrench
} from "lucide-react"
import { mockProperties, mockUsers, mockVendors } from "@/lib/mock-data"
import { MaintenancePriority, MaintenanceCategory, MaintenanceStatus } from "@/lib/types"
import Link from "next/link"

export default function CreateMaintenancePage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "" as MaintenanceCategory | "",
        priority: "medium" as MaintenancePriority,
        propertyId: "",
        unitId: "",
        tenantId: "",
        estimatedCost: "",
        scheduledDate: "",
        tenantNotes: ""
    })

    // Get available properties and units
    const availableProperties = mockProperties.filter(p => p.status === "active")
    const selectedProperty = availableProperties.find(p => p.id === formData.propertyId)
    const availableUnits = selectedProperty?.units || []
    const availableTenants = mockUsers.filter(u => u.role === "tenant" && u.isActive)

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // Reset dependent fields when property changes
        if (field === "propertyId") {
            setFormData(prev => ({
                ...prev,
                propertyId: value,
                unitId: "",
                tenantId: ""
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        // Basic validation
        if (!formData.title || !formData.description || !formData.category || !formData.propertyId) {
            setError("Please fill in all required fields")
            setIsSubmitting(false)
            return
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // In a real app, you would send this to your API
            const newRequest = {
                id: `maint-${Date.now()}`,
                ...formData,
                status: "open" as MaintenanceStatus,
                estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
                scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
                images: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }

            console.log("New maintenance request:", newRequest)

            // Redirect to maintenance dashboard
            router.push("/maintenance")
        } catch (err) {
            setError("Failed to create maintenance request. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
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

    const getPriorityConfig = (priority: MaintenancePriority) => {
        const config = {
            low: { color: "bg-gray-100 text-gray-800", icon: Clock, text: "Low Priority" },
            medium: { color: "bg-blue-100 text-blue-800", icon: Wrench, text: "Medium Priority" },
            high: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle, text: "High Priority" },
            emergency: { color: "bg-red-100 text-red-800", icon: AlertTriangle, text: "Emergency" }
        }
        return config[priority]
    }

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
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Maintenance Request</h1>
                        <p className="text-muted-foreground">
                            Submit a new maintenance request for a property
                        </p>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Provide details about the maintenance issue
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Brief description of the issue"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Detailed description of the problem..."
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleInputChange("category", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="plumbing">
                                                <span className="flex items-center gap-2">
                                                    <span>{getCategoryIcon("plumbing")}</span>
                                                    Plumbing
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="electrical">
                                                <span className="flex items-center gap-2">
                                                    <span>{getCategoryIcon("electrical")}</span>
                                                    Electrical
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="hvac">
                                                <span className="flex items-center gap-2">
                                                    <span>{getCategoryIcon("hvac")}</span>
                                                    HVAC
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="appliance">
                                                <span className="flex items-center gap-2">
                                                    <span>{getCategoryIcon("appliance")}</span>
                                                    Appliance
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="structural">
                                                <span className="flex items-center gap-2">
                                                    <span>{getCategoryIcon("structural")}</span>
                                                    Structural
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="pest_control">
                                                <span className="flex items-center gap-2">
                                                    <span>{getCategoryIcon("pest_control")}</span>
                                                    Pest Control
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="cleaning">
                                                <span className="flex items-center gap-2">
                                                    <span>{getCategoryIcon("cleaning")}</span>
                                                    Cleaning
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="other">
                                                <span className="flex items-center gap-2">
                                                    <span>{getCategoryIcon("other")}</span>
                                                    Other
                                                </span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(value) => handleInputChange("priority", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="emergency">Emergency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center gap-2 mt-2">
                                        {(() => {
                                            const config = getPriorityConfig(formData.priority)
                                            const Icon = config.icon
                                            return (
                                                <Badge className={config.color}>
                                                    <Icon className="w-3 h-3 mr-1" />
                                                    {config.text}
                                                </Badge>
                                            )
                                        })()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Property & Unit Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Property & Unit</CardTitle>
                                <CardDescription>
                                    Select the property and unit for this request
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="property">Property *</Label>
                                    <Select
                                        value={formData.propertyId}
                                        onValueChange={(value) => handleInputChange("propertyId", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select property" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableProperties.map(property => (
                                                <SelectItem key={property.id} value={property.id}>
                                                    {property.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Select
                                        value={formData.unitId}
                                        onValueChange={(value) => handleInputChange("unitId", value)}
                                        disabled={!formData.propertyId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select unit (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableUnits.map(unit => (
                                                <SelectItem key={unit.id} value={unit.id}>
                                                    Unit {unit.number} - {unit.type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tenant">Tenant</Label>
                                    <Select
                                        value={formData.tenantId}
                                        onValueChange={(value) => handleInputChange("tenantId", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select tenant (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableTenants.map(tenant => (
                                                <SelectItem key={tenant.id} value={tenant.id}>
                                                    {tenant.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="scheduledDate">Preferred Date</Label>
                                    <Input
                                        id="scheduledDate"
                                        type="date"
                                        value={formData.scheduledDate}
                                        onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                            <CardDescription>
                                Optional details and cost estimates
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="estimatedCost">Estimated Cost</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input
                                            id="estimatedCost"
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.estimatedCost}
                                            onChange={(e) => handleInputChange("estimatedCost", e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tenantNotes">Additional Notes</Label>
                                    <Textarea
                                        id="tenantNotes"
                                        placeholder="Any additional information or special instructions..."
                                        value={formData.tenantNotes}
                                        onChange={(e) => handleInputChange("tenantNotes", e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Photos (Optional)</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Click to upload photos or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        PNG, JPG up to 10MB
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Link href="/maintenance">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Create Request
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
} 