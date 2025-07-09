"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CalendarIcon, DollarSign, User, Building, Home } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { mockTenants, mockUnits, mockProperties, mockLeases } from "@/lib/mock-data"
import { PaymentType, PaymentStatus } from "@/lib/types"
import { PAYMENT_TYPES, PAYMENT_METHODS } from "@/lib/constants"
import { formatCurrency } from "@/lib/utils"

export default function CreatePaymentPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        tenantId: "",
        leaseId: "",
        amount: "",
        type: "rent" as PaymentType,
        dueDate: new Date(),
        paidDate: new Date(),
        method: "online" as "cash" | "check" | "bank_transfer" | "credit_card" | "online",
        reference: "",
        notes: "",
        status: "paid" as PaymentStatus
    })

    const [selectedTenant, setSelectedTenant] = useState<any>(null)
    const [selectedLease, setSelectedLease] = useState<any>(null)
    const [selectedUnit, setSelectedUnit] = useState<any>(null)
    const [selectedProperty, setSelectedProperty] = useState<any>(null)

    // Get active tenants with leases
    const activeTenants = mockTenants.filter(tenant =>
        tenant.currentLeaseId && tenant.currentUnitId
    )

    // Get available leases for selected tenant
    const availableLeases = selectedTenant
        ? mockLeases.filter(lease => lease.tenantId === selectedTenant.id)
        : []

    // Update related data when tenant changes
    useEffect(() => {
        if (formData.tenantId) {
            const tenant = mockTenants.find(t => t.id === formData.tenantId)
            setSelectedTenant(tenant || null)

            if (tenant?.currentUnitId) {
                const unit = mockUnits.find(u => u.id === tenant.currentUnitId)
                setSelectedUnit(unit || null)

                if (unit) {
                    const property = mockProperties.find(p => p.id === unit.propertyId)
                    setSelectedProperty(property || null)
                }
            }
        }
    }, [formData.tenantId])

    // Update lease when leaseId changes
    useEffect(() => {
        if (formData.leaseId) {
            const lease = mockLeases.find(l => l.id === formData.leaseId)
            setSelectedLease(lease || null)

            // Auto-fill amount based on lease rent
            if (lease && formData.type === 'rent') {
                setFormData(prev => ({ ...prev, amount: lease.rent.toString() }))
            }
        }
    }, [formData.leaseId, formData.type])

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Here you would typically save the payment to your backend
        console.log("Creating payment:", formData)

        // For now, just redirect back to payments page
        router.push("/payments")
    }

    const getTotalAmount = () => {
        const baseAmount = parseFloat(formData.amount) || 0
        return baseAmount
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Record Payment</h1>
                        <p className="text-muted-foreground">
                            Record a new payment for a tenant
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tenant and Lease Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Tenant & Lease Information
                            </CardTitle>
                            <CardDescription>
                                Select the tenant and lease for this payment
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tenant">Tenant *</Label>
                                    <Select
                                        value={formData.tenantId}
                                        onValueChange={(value) => handleInputChange("tenantId", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a tenant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {activeTenants.map(tenant => (
                                                <SelectItem key={tenant.id} value={tenant.id}>
                                                    {tenant.name} - {tenant.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lease">Lease *</Label>
                                    <Select
                                        value={formData.leaseId}
                                        onValueChange={(value) => handleInputChange("leaseId", value)}
                                        disabled={!formData.tenantId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a lease" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableLeases.map(lease => (
                                                <SelectItem key={lease.id} value={lease.id}>
                                                    {lease.startDate.toLocaleDateString()} - {lease.endDate.toLocaleDateString()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Property and Unit Info */}
                            {selectedProperty && selectedUnit && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">{selectedProperty.name}</div>
                                            <div className="text-sm text-muted-foreground">{selectedProperty.address}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Home className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Unit {selectedUnit.number}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {selectedUnit.bedrooms} bed, {selectedUnit.bathrooms} bath
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Payment Details
                            </CardTitle>
                            <CardDescription>
                                Enter the payment amount and details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Payment Type *</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => handleInputChange("type", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PAYMENT_TYPES.map(type => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount ($) *</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => handleInputChange("amount", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleInputChange("status", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="late">Late</SelectItem>
                                            <SelectItem value="overdue">Overdue</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Due Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !formData.dueDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.dueDate}
                                                onSelect={(date) => date && handleInputChange("dueDate", date)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label>Paid Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !formData.paidDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.paidDate ? format(formData.paidDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.paidDate}
                                                onSelect={(date) => date && handleInputChange("paidDate", date)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="method">Payment Method</Label>
                                    <Select
                                        value={formData.method}
                                        onValueChange={(value) => handleInputChange("method", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PAYMENT_METHODS.map(method => (
                                                <SelectItem key={method.value} value={method.value}>
                                                    {method.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reference">Reference Number</Label>
                                    <Input
                                        id="reference"
                                        placeholder="Transaction ID, check number, etc."
                                        value={formData.reference}
                                        onChange={(e) => handleInputChange("reference", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Additional notes about this payment..."
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange("notes", e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Base Amount</span>
                                    <span className="font-medium">{formatCurrency(parseFloat(formData.amount) || 0)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>Total Amount</span>
                                    <span>{formatCurrency(getTotalAmount())}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Record Payment
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
} 