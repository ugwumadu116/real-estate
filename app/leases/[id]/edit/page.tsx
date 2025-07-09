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
import { ArrowLeft, Save, FileText, Users, Home, DollarSign, Calendar, AlertTriangle } from "lucide-react"
import { mockTenants, mockUnits, mockProperties, mockLeases, updateLease } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import { LeaseType, LeaseStatus } from "@/lib/types"
import Link from "next/link"

export default function EditLeasePage() {
    const params = useParams()
    const router = useRouter()
    const leaseId = params.id as string

    const [formData, setFormData] = useState({
        tenantId: "",
        unitId: "",
        startDate: "",
        endDate: "",
        rent: "",
        deposit: "",
        status: "pending" as LeaseStatus,
        type: "yearly" as LeaseType,
        terms: "",
        lateFee: "",
        gracePeriod: "5",
        autoRenew: true,
        renewalTerms: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const [lease, setLease] = useState<any>(null)
    const [isLoadingLease, setIsLoadingLease] = useState(true)

    // Load lease data on component mount
    useEffect(() => {
        const loadLease = () => {
            const foundLease = mockLeases.find(l => l.id === leaseId)
            if (!foundLease) {
                setError("Lease not found")
                setIsLoadingLease(false)
                return
            }

            setLease(foundLease)
            setFormData({
                tenantId: foundLease.tenantId,
                unitId: foundLease.unitId,
                startDate: foundLease.startDate.toISOString().split('T')[0],
                endDate: foundLease.endDate.toISOString().split('T')[0],
                rent: foundLease.rent.toString(),
                deposit: foundLease.deposit.toString(),
                status: foundLease.status,
                type: foundLease.type,
                terms: foundLease.terms,
                lateFee: foundLease.lateFee.toString(),
                gracePeriod: foundLease.gracePeriod.toString(),
                autoRenew: foundLease.autoRenew,
                renewalTerms: foundLease.renewalTerms || "",
            })
            setIsLoadingLease(false)
        }

        loadLease()
    }, [leaseId])

    const availableTenants = mockTenants
    const availableUnits = mockUnits

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
            autoRenew: checked,
        }))
    }

    const getSelectedUnit = () => {
        return mockUnits.find(u => u.id === formData.unitId)
    }

    const getSelectedTenant = () => {
        return mockTenants.find(t => t.id === formData.tenantId)
    }

    const validateForm = () => {
        if (!formData.tenantId) return "Please select a tenant"
        if (!formData.unitId) return "Please select a unit"
        if (!formData.startDate) return "Start date is required"
        if (!formData.endDate) return "End date is required"
        if (!formData.rent) return "Monthly rent is required"
        if (!formData.deposit) return "Security deposit is required"
        if (!formData.terms) return "Lease terms are required"
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            return "End date must be after start date"
        }
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

        try {
            // Update the lease in mock data
            const updatedLease = updateLease(leaseId, {
                tenantId: formData.tenantId,
                unitId: formData.unitId,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
                rent: parseFloat(formData.rent),
                deposit: parseFloat(formData.deposit),
                status: formData.status,
                type: formData.type,
                terms: formData.terms,
                lateFee: parseFloat(formData.lateFee) || 0,
                gracePeriod: parseInt(formData.gracePeriod),
                autoRenew: formData.autoRenew,
                renewalTerms: formData.renewalTerms,
            })

            if (!updatedLease) {
                throw new Error("Failed to update lease")
            }

            setSuccess(true)
        } catch (err) {
            setError("Failed to update lease. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoadingLease) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading lease data...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (error && !lease) {
        return (
            <DashboardLayout>
                <div className="max-w-md mx-auto">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                            <h2 className="text-2xl font-bold mb-2">Lease Not Found</h2>
                            <p className="text-muted-foreground mb-4">
                                The lease you're looking for doesn't exist or has been removed.
                            </p>
                            <Button asChild>
                                <Link href="/leases">Back to Leases</Link>
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
                            <h2 className="text-2xl font-bold mb-2">Lease Updated!</h2>
                            <p className="text-muted-foreground mb-4">
                                The lease agreement has been successfully updated.
                            </p>
                            <div className="flex gap-2 justify-center">
                                <Button asChild>
                                    <Link href={`/leases/${leaseId}`}>View Lease</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/leases">Back to Leases</Link>
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
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/leases/${leaseId}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Lease</h1>
                        <p className="text-muted-foreground">
                            Update lease agreement details and terms
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Parties Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Parties Information
                            </CardTitle>
                            <CardDescription>
                                Update the tenant and unit for this lease agreement
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="tenantId">Tenant *</Label>
                                    <Select value={formData.tenantId} onValueChange={(value) => handleSelectChange("tenantId", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a tenant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableTenants.map((tenant) => (
                                                <SelectItem key={tenant.id} value={tenant.id}>
                                                    {tenant.name} ({tenant.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unitId">Unit *</Label>
                                    <Select value={formData.unitId} onValueChange={(value) => handleSelectChange("unitId", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a unit" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                            </div>

                            {/* Selected Unit Details */}
                            {getSelectedUnit() && (
                                <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-semibold mb-2">Selected Unit Details</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Unit Number:</span>
                                            <div className="font-medium">{getSelectedUnit()?.number}</div>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Property:</span>
                                            <div className="font-medium">
                                                {mockProperties.find(p => p.id === getSelectedUnit()?.propertyId)?.name}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Type:</span>
                                            <div className="font-medium">
                                                {getSelectedUnit()?.bedrooms}BR, {getSelectedUnit()?.bathrooms}BA
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Area:</span>
                                            <div className="font-medium">{getSelectedUnit()?.area} sq ft</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Lease Terms */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Lease Terms
                            </CardTitle>
                            <CardDescription>
                                Update the lease period and basic terms
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date *</Label>
                                    <Input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date *</Label>
                                    <Input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Lease Type *</Label>
                                    <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select lease type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="quarterly">Quarterly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                            <SelectItem value="custom">Custom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Lease Status</Label>
                                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                        <SelectItem value="terminated">Terminated</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Terms */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Financial Terms
                            </CardTitle>
                            <CardDescription>
                                Update the rent, deposit, and payment terms
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rent">Monthly Rent ($) *</Label>
                                    <Input
                                        id="rent"
                                        name="rent"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="e.g., 2000"
                                        value={formData.rent}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="deposit">Security Deposit ($) *</Label>
                                    <Input
                                        id="deposit"
                                        name="deposit"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="e.g., 2000"
                                        value={formData.deposit}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lateFee">Late Fee ($)</Label>
                                    <Input
                                        id="lateFee"
                                        name="lateFee"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="e.g., 50"
                                        value={formData.lateFee}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gracePeriod">Grace Period (days)</Label>
                                <Input
                                    id="gracePeriod"
                                    name="gracePeriod"
                                    type="number"
                                    min="0"
                                    placeholder="e.g., 5"
                                    value={formData.gracePeriod}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="autoRenew"
                                    checked={formData.autoRenew}
                                    onCheckedChange={handleCheckboxChange}
                                />
                                <Label htmlFor="autoRenew">Auto-renew lease after expiration</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lease Terms and Conditions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Terms and Conditions
                            </CardTitle>
                            <CardDescription>
                                Update the lease terms and conditions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="terms">Lease Terms *</Label>
                                <Textarea
                                    id="terms"
                                    name="terms"
                                    placeholder="Enter the lease terms and conditions..."
                                    rows={6}
                                    value={formData.terms}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="renewalTerms">Renewal Terms</Label>
                                <Textarea
                                    id="renewalTerms"
                                    name="renewalTerms"
                                    placeholder="Enter renewal terms (optional)..."
                                    rows={3}
                                    value={formData.renewalTerms}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Update Lease
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
} 