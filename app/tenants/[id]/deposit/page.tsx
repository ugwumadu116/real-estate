"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeft,
    DollarSign,
    Calendar,
    FileText,
    Home,
    User,
    AlertTriangle,
    CheckCircle,
    Clock,
    Plus,
    Save,
    Send,
    Download
} from "lucide-react"
import { mockTenants, mockUnits, mockProperties, mockSecurityDeposits, getSecurityDepositByTenantId } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DepositStatus, DepositDeduction } from "@/lib/types"
import Link from "next/link"

export default function SecurityDepositPage() {
    const params = useParams()
    const router = useRouter()
    const tenantId = params.id as string

    const [deposit, setDeposit] = useState<any>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [newDeduction, setNewDeduction] = useState({
        amount: 0,
        reason: "",
        category: "",
        description: ""
    })

    const tenant = mockTenants.find((t) => t.id === tenantId)
    const unit = mockUnits.find((u) => u.id === tenant?.currentUnitId)
    const property = mockProperties.find((p) => p.id === unit?.propertyId)

    useEffect(() => {
        const existingDeposit = getSecurityDepositByTenantId(tenantId)
        if (existingDeposit) {
            setDeposit(existingDeposit)
        } else {
            // Create new deposit if none exists
            const newDeposit = {
                id: `deposit-${Date.now()}`,
                tenantId,
                leaseId: tenant?.currentLeaseId,
                unitId: tenant?.currentUnitId,
                propertyId: unit?.propertyId,
                amount: unit?.deposit || 0,
                status: "held" as DepositStatus,
                heldDate: new Date(),
                deductions: [],
                notes: "",
                createdAt: new Date(),
                updatedAt: new Date()
            }
            setDeposit(newDeposit)
        }
    }, [tenantId, tenant, unit])

    const handleStatusChange = (status: DepositStatus) => {
        if (!deposit) return

        setDeposit({
            ...deposit,
            status,
            refundedDate: status === "refunded" ? new Date() : undefined,
            refundedAmount: status === "refunded" ? deposit.amount - deposit.totalDeductions : undefined
        })
    }

    const addDeduction = () => {
        if (!deposit || !newDeduction.reason || !newDeduction.category || newDeduction.amount <= 0) return

        const deduction: DepositDeduction = {
            id: `deduction-${Date.now()}`,
            amount: newDeduction.amount,
            reason: newDeduction.reason,
            category: newDeduction.category as any,
            description: newDeduction.description,
            supportingDocuments: [],
            appliedDate: new Date(),
            appliedBy: "user-2"
        }

        setDeposit({
            ...deposit,
            deductions: [...deposit.deductions, deduction],
            totalDeductions: deposit.totalDeductions + deduction.amount
        })

        setNewDeduction({
            amount: 0,
            reason: "",
            category: "",
            description: ""
        })
    }

    const removeDeduction = (deductionId: string) => {
        if (!deposit) return

        const deductionToRemove = deposit.deductions.find((d: DepositDeduction) => d.id === deductionId)
        const amount = deductionToRemove?.amount || 0

        setDeposit({
            ...deposit,
            deductions: deposit.deductions.filter((d: DepositDeduction) => d.id !== deductionId),
            totalDeductions: deposit.totalDeductions - amount
        })
    }

    const getStatusColor = (status: DepositStatus) => {
        switch (status) {
            case "held": return "bg-blue-100 text-blue-800"
            case "refunded": return "bg-green-100 text-green-800"
            case "deducted": return "bg-orange-100 text-orange-800"
            case "pending_refund": return "bg-yellow-100 text-yellow-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusIcon = (status: DepositStatus) => {
        switch (status) {
            case "held": return <Clock className="h-4 w-4" />
            case "refunded": return <CheckCircle className="h-4 w-4" />
            case "deducted": return <AlertTriangle className="h-4 w-4" />
            case "pending_refund": return <FileText className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "damage": return "bg-red-100 text-red-800"
            case "cleaning": return "bg-orange-100 text-orange-800"
            case "unpaid_rent": return "bg-purple-100 text-purple-800"
            case "utilities": return "bg-blue-100 text-blue-800"
            case "other": return "bg-gray-100 text-gray-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const totalDeductions = deposit?.deductions.reduce((sum: number, d: DepositDeduction) => sum + d.amount, 0) || 0
    const refundAmount = deposit ? deposit.amount - totalDeductions : 0

    const handleSave = async () => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setIsEditing(false)
        }, 1000)
    }

    const handleRefund = async () => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            handleStatusChange("refunded")
        }, 1000)
    }

    if (!tenant || !unit || !property || !deposit) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-lg font-semibold">Loading...</div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={`/tenants/${tenantId}`}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Tenant
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Security Deposit</h1>
                            <p className="text-muted-foreground">
                                {tenant.name} - {unit.number} at {property.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={isLoading}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Edit Deposit
                            </Button>
                        )}
                    </div>
                </div>

                {/* Deposit Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5" />
                            <span>Deposit Overview</span>
                        </CardTitle>
                        <CardDescription>
                            Security deposit details and current status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    ${deposit.amount.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">Original Amount</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    ${totalDeductions.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Deductions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    ${refundAmount.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">Refund Amount</div>
                            </div>
                            <div className="text-center">
                                <Badge className={getStatusColor(deposit.status)}>
                                    {getStatusIcon(deposit.status)}
                                    <span className="ml-1">{deposit.status.replace('_', ' ')}</span>
                                </Badge>
                                <div className="text-sm text-muted-foreground mt-1">Status</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="details" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="details">Deposit Details</TabsTrigger>
                        <TabsTrigger value="deductions">Deductions</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Deposit Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Held Date</Label>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{new Date(deposit.heldDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Status</Label>
                                        {isEditing ? (
                                            <Select value={deposit.status} onValueChange={handleStatusChange}>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="held">Held</SelectItem>
                                                    <SelectItem value="pending_refund">Pending Refund</SelectItem>
                                                    <SelectItem value="refunded">Refunded</SelectItem>
                                                    <SelectItem value="deducted">Deducted</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="mt-1">
                                                <Badge className={getStatusColor(deposit.status)}>
                                                    {deposit.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    {deposit.refundedDate && (
                                        <div>
                                            <Label>Refunded Date</Label>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{new Date(deposit.refundedDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )}
                                    {deposit.refundedAmount && (
                                        <div>
                                            <Label>Refunded Amount</Label>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                <span>${deposit.refundedAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="deductions" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Deductions</CardTitle>
                                <CardDescription>
                                    Track deductions from the security deposit
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {deposit.deductions.map((deduction: DepositDeduction) => (
                                        <div key={deduction.id} className="border rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-medium">{deduction.reason}</h3>
                                                        <Badge className={getCategoryColor(deduction.category)}>
                                                            {deduction.category.replace('_', ' ')}
                                                        </Badge>
                                                        <Badge variant="destructive">
                                                            <DollarSign className="h-3 w-3 mr-1" />
                                                            ${deduction.amount}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">{deduction.description}</p>
                                                    <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Applied on {new Date(deduction.appliedDate).toLocaleDateString()}</span>
                                                        <User className="h-3 w-3" />
                                                        <span>by {deduction.appliedBy}</span>
                                                    </div>
                                                </div>
                                                {isEditing && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeDeduction(deduction.id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add New Deduction Form */}
                                    {isEditing && (
                                        <div className="border rounded-lg p-4 bg-gray-50">
                                            <h3 className="font-medium mb-4">Add Deduction</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="category">Category</Label>
                                                    <Select value={newDeduction.category} onValueChange={(value) => setNewDeduction({ ...newDeduction, category: value })}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="damage">Damage</SelectItem>
                                                            <SelectItem value="cleaning">Cleaning</SelectItem>
                                                            <SelectItem value="unpaid_rent">Unpaid Rent</SelectItem>
                                                            <SelectItem value="utilities">Utilities</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="amount">Amount ($)</Label>
                                                    <Input
                                                        id="amount"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={newDeduction.amount}
                                                        onChange={(e) => setNewDeduction({ ...newDeduction, amount: parseFloat(e.target.value) || 0 })}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="reason">Reason</Label>
                                                    <Input
                                                        id="reason"
                                                        value={newDeduction.reason}
                                                        onChange={(e) => setNewDeduction({ ...newDeduction, reason: e.target.value })}
                                                        placeholder="Deduction reason"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="description">Description</Label>
                                                    <Input
                                                        id="description"
                                                        value={newDeduction.description}
                                                        onChange={(e) => setNewDeduction({ ...newDeduction, description: e.target.value })}
                                                        placeholder="Detailed description"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Button onClick={addDeduction} disabled={!newDeduction.reason || !newDeduction.category || newDeduction.amount <= 0}>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Deduction
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Deposit History</CardTitle>
                                <CardDescription>
                                    Complete timeline of deposit activities
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="font-medium">Deposit Received</div>
                                            <div className="text-sm text-muted-foreground">
                                                ${deposit.amount.toLocaleString()} received on {new Date(deposit.heldDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    {deposit.deductions.map((deduction: DepositDeduction) => (
                                        <div key={deduction.id} className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="font-medium">Deduction Applied</div>
                                                <div className="text-sm text-muted-foreground">
                                                    ${deduction.amount} for {deduction.reason} on {new Date(deduction.appliedDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {deposit.refundedDate && (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="font-medium">Deposit Refunded</div>
                                                <div className="text-sm text-muted-foreground">
                                                    ${deposit.refundedAmount?.toLocaleString()} refunded on {new Date(deposit.refundedDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Notes Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                        <CardDescription>
                            Add any additional notes about the security deposit
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Add notes about the security deposit..."
                            value={deposit.notes}
                            onChange={(e) => setDeposit({ ...deposit, notes: e.target.value })}
                            disabled={!isEditing}
                            rows={4}
                        />
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        {deposit.status === "held" && (
                            <Button onClick={handleRefund} disabled={isLoading}>
                                <Send className="h-4 w-4 mr-2" />
                                Process Refund
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
} 