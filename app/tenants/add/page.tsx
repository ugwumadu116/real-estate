"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, User, Phone, Mail, Calendar, Shield } from "lucide-react"
import { mockProperties, mockUnits } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import Link from "next/link"

export default function AddTenantPage() {
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

    const availableUnits = mockUnits.filter(unit => unit.status === "available")

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
            isActive: checked,
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

        // Treat 'none' as no assignment
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

    if (success) {
        return (
            <DashboardLayout>
                <div className="max-w-md mx-auto">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="text-green-600 text-6xl mb-4">✓</div>
                            <h2 className="text-2xl font-bold mb-2">Tenant Added!</h2>
                            <p className="text-muted-foreground mb-4">
                                The tenant has been successfully added to the system.
                            </p>
                            <div className="flex gap-2 justify-center">
                                <Button
                                    onClick={() => {
                                        setSuccess(false)
                                        setFormData({
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
                                    }}
                                >
                                    Add Another Tenant
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

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/tenants">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Add New Tenant</h1>
                        <p className="text-muted-foreground">
                            Create a new tenant profile with all necessary information
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
                                Provide the tenant's basic personal information
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
                                Assign the tenant to a specific unit (optional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="currentUnitId">Assign to Unit</Label>
                                <Select value={formData.currentUnitId} onValueChange={(value) => handleSelectChange("currentUnitId", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a unit (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No unit assignment</SelectItem>
                                        {availableUnits.map((unit) => {
                                            const property = mockProperties.find(p => p.id === unit.propertyId)
                                            return (
                                                <SelectItem key={unit.id} value={unit.id}>
                                                    {unit.number} - {property?.name} (${unit.rent}/month)
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
                                Provide emergency contact information (optional)
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
                            <Link href="/tenants">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? "Adding Tenant..." : "Add Tenant"}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
} 