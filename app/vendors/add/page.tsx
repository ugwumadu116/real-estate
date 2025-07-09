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
import { Checkbox } from "@/components/ui/checkbox"
import {
    ArrowLeft,
    Save,
    AlertTriangle,
    X
} from "lucide-react"
import { MaintenanceCategory } from "@/lib/types"
import Link from "next/link"

export default function AddVendorPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        specialties: [] as MaintenanceCategory[],
        rating: "4.0",
        licenseNumber: "",
        insuranceInfo: ""
    })

    const availableSpecialties: { value: MaintenanceCategory; label: string; icon: string }[] = [
        { value: "plumbing", label: "Plumbing", icon: "🚰" },
        { value: "electrical", label: "Electrical", icon: "⚡" },
        { value: "hvac", label: "HVAC", icon: "❄️" },
        { value: "appliance", label: "Appliance", icon: "🔌" },
        { value: "structural", label: "Structural", icon: "🏗️" },
        { value: "pest_control", label: "Pest Control", icon: "🐛" },
        { value: "cleaning", label: "Cleaning", icon: "🧹" },
        { value: "other", label: "Other", icon: "🔧" }
    ]

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSpecialtyToggle = (specialty: MaintenanceCategory) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        // Basic validation
        if (!formData.name || !formData.email || !formData.phone || formData.specialties.length === 0) {
            setError("Please fill in all required fields and select at least one specialty")
            setIsSubmitting(false)
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address")
            setIsSubmitting(false)
            return
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // In a real app, you would send this to your API
            const newVendor = {
                id: `vendor-${Date.now()}`,
                ...formData,
                rating: parseFloat(formData.rating),
                totalJobs: 0,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            console.log("New vendor:", newVendor)

            // Redirect to vendors dashboard
            router.push("/vendors")
        } catch (err) {
            setError("Failed to create vendor. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

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
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Add New Vendor</h1>
                        <p className="text-muted-foreground">
                            Add a new vendor to your network
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
                                    Vendor contact and business details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Company Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter company name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="vendor@example.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        placeholder="(555) 123-4567"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea
                                        id="address"
                                        placeholder="Enter business address"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Business Details</CardTitle>
                                <CardDescription>
                                    Licenses, insurance, and ratings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rating">Initial Rating</Label>
                                    <Select
                                        value={formData.rating}
                                        onValueChange={(value) => handleInputChange("rating", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3.0">3.0 - New Vendor</SelectItem>
                                            <SelectItem value="3.5">3.5 - Some Experience</SelectItem>
                                            <SelectItem value="4.0">4.0 - Good Reputation</SelectItem>
                                            <SelectItem value="4.5">4.5 - Excellent Reputation</SelectItem>
                                            <SelectItem value="5.0">5.0 - Outstanding</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="licenseNumber">License Number</Label>
                                    <Input
                                        id="licenseNumber"
                                        placeholder="Enter license number"
                                        value={formData.licenseNumber}
                                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="insuranceInfo">Insurance Information</Label>
                                    <Textarea
                                        id="insuranceInfo"
                                        placeholder="Enter insurance details"
                                        value={formData.insuranceInfo}
                                        onChange={(e) => handleInputChange("insuranceInfo", e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Specialties */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Specialties *</CardTitle>
                            <CardDescription>
                                Select the maintenance categories this vendor specializes in
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                {availableSpecialties.map((specialty) => (
                                    <div key={specialty.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={specialty.value}
                                            checked={formData.specialties.includes(specialty.value)}
                                            onCheckedChange={() => handleSpecialtyToggle(specialty.value)}
                                        />
                                        <Label
                                            htmlFor={specialty.value}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <span>{specialty.icon}</span>
                                            {specialty.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>

                            {formData.specialties.length > 0 && (
                                <div className="mt-4">
                                    <Label className="text-sm font-medium text-muted-foreground">Selected Specialties:</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.specialties.map(specialty => {
                                            const specialtyInfo = availableSpecialties.find(s => s.value === specialty)
                                            return (
                                                <Badge key={specialty} variant="secondary">
                                                    <span className="mr-1">{specialtyInfo?.icon}</span>
                                                    {specialtyInfo?.label}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSpecialtyToggle(specialty)}
                                                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Link href="/vendors">
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
                                    Create Vendor
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
} 