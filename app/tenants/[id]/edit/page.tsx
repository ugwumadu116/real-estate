"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, User, Phone, Mail, Calendar, Shield, AlertTriangle } from "lucide-react"
import { mockProperties, mockUnits, mockTenants, getTenantById } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import Link from "next/link"

export default function EditTenantPage() {
    const params = useParams()
    const router = useRouter()
    const tenantId = params.id as string

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        isActive: true,
        moveInDate: "",
        currentUnitId: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const [tenant, setTenant] = useState<any>(null)
    const [notFound, setNotFound] = useState(false)

    // Get all units (including occupied ones for editing)
    const allUnits = mockUnits

    useEffect(() => {
        const foundTenant = getTenantById(tenantId)
        if (!foundTenant) {
            setNotFound(true)
            return
        }

        setTenant(foundTenant)

        // Pre-populate form with existing tenant data
        setFormData({
            name: foundTenant.name || "",
            email: foundTenant.email || "",
            phone: foundTenant.phone || "",
            dateOfBirth: foundTenant.dateOfBirth ?
                new Date(foundTenant.dateOfBirth).toISOString().split('T')[0] : "",
            isActive: foundTenant.isActive ?? true,
            moveInDate: foundTenant.moveInDate ?
                new Date(foundTenant.moveInDate).toISOString().split('T')[0] : "",
            currentUnitId: foundTenant.currentUnitId || "none",
            emergencyContactName: foundTenant.emergencyContact?.name || "",
            emergencyContactPhone: foundTenant.emergencyContact?.phone || "",
            emergencyContactRelationship: foundTenant.emergencyContact?.relationship || "",
        })
    }, [tenantId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSelectChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            isActive: !!checked,
        }))
    }

    const validateForm = () => {
        if (!formData.name.trim()) return "Name is required"
        if (!formData.email.trim()) return "Email is required"
        if (!formData.phone.trim()) return "Phone is required"
        if (!formData.email.includes("@")) return "Please enter a valid email"
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        setIsLoading(true)

        // Map 'none' to empty string for currentUnitId before 'saving'
        const processedFormData = {
            ...formData,
            currentUnitId: formData.currentUnitId === "none" ? "" : formData.currentUnitId,
        }

        // Simulate API call
        setTimeout(() => {
            setSuccess(true)
            setIsLoading(false)
        }, 2000)
    }

    if (notFound) {
        return (
            <DashboardLayout>
                <div className="max-w-md mx-auto">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                            <h2 className="text-2xl font-bold mb-2">Tenant Not Found</h2>
                            <p className="text-muted-foreground mb-4">
                                The tenant you're looking for doesn't exist or has been removed.
                            </p>
                            <Button asChild>
                                <Link href="/tenants">Back to Tenants</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        )
    }

    if (success) {
        return (
            <DashboardLayout>
                <div className="max-w-md mx-auto">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="text-green-600 text-6xl mb-4">✓</div>
                            <h2 className="text-2xl font-bold mb-2">Tenant Updated!</h2>
                            <p className="text-muted-foreground mb-4">
                                The tenant information has been successfully updated.
                            </p>
                            <div className="flex gap-2 justify-center">
                                <Button asChild>
                                    <Link href={`/tenants/${tenantId}`}>View Tenant</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/tenants">Back to Tenants</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        )
    }

    if (!tenant) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading tenant information...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/tenants/${tenantId}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Tenant</h1>
                        <p className="text-muted-foreground">
                            Update tenant information and profile details
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>
                                Update the tenant's basic personal information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="e.g., John Doe"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="e.g., john.doe@email.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="e.g., (555) 123-4567"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={handleCheckboxChange}
                                />
                                <Label htmlFor="isActive">Active tenant</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Unit Assignment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Unit Assignment
                            </CardTitle>
                            <CardDescription>
                                Update the tenant's unit assignment
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="currentUnitId">Assign to Unit</Label>
                                <Select value={formData.currentUnitId || "none"} onValueChange={(value) => handleSelectChange("currentUnitId", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a unit (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No unit assignment</SelectItem>
                                        {allUnits.map((unit) => {
                                            const property = mockProperties.find(p => p.id === unit.propertyId)
                                            const isOccupied = !!(unit.currentTenantId && unit.currentTenantId !== tenantId)
                                            return (
                                                <SelectItem
                                                    key={unit.id}
                                                    value={unit.id}
                                                    disabled={isOccupied}
                                                >
                                                    {unit.number} - {property?.name} (${unit.rent}/month)
                                                    {isOccupied && " - Occupied"}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="moveInDate">Move-in Date</Label>
                                <Input
                                    id="moveInDate"
                                    name="moveInDate"
                                    type="date"
                                    value={formData.moveInDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Emergency Contact */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Emergency Contact
                            </CardTitle>
                            <CardDescription>
                                Update emergency contact information (optional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContactName">Contact Name</Label>
                                    <Input
                                        id="emergencyContactName"
                                        name="emergencyContactName"
                                        placeholder="e.g., Jane Doe"
                                        value={formData.emergencyContactName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                                    <Input
                                        id="emergencyContactPhone"
                                        name="emergencyContactPhone"
                                        placeholder="e.g., (555) 987-6543"
                                        value={formData.emergencyContactPhone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                                <Select
                                    value={formData.emergencyContactRelationship}
                                    onValueChange={(value) => handleSelectChange("emergencyContactRelationship", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select relationship" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="spouse">Spouse</SelectItem>
                                        <SelectItem value="parent">Parent</SelectItem>
                                        <SelectItem value="sibling">Sibling</SelectItem>
                                        <SelectItem value="child">Child</SelectItem>
                                        <SelectItem value="friend">Friend</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Button variant="outline" asChild>
                            <Link href={`/tenants/${tenantId}`}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? "Updating Tenant..." : "Update Tenant"}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
} 