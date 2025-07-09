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
    CheckCircle,
    AlertTriangle,
    DollarSign,
    FileText,
    Home,
    User,
    Calendar,
    Camera,
    Save,
    Send,
    Wrench,
    Key,
    Zap
} from "lucide-react"
import { mockTenants, mockUnits, mockProperties, mockMoveOutInspections, getMoveOutInspectionByTenantId } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import { InspectionStatus, InspectionItem } from "@/lib/types"
import Link from "next/link"

export default function MoveOutInspectionPage() {
    const params = useParams()
    const router = useRouter()
    const tenantId = params.id as string

    const [inspection, setInspection] = useState<any>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [newItem, setNewItem] = useState({
        category: "",
        title: "",
        description: "",
        condition: "",
        deductionAmount: 0,
        notes: ""
    })

    const tenant = mockTenants.find((t) => t.id === tenantId)
    const unit = mockUnits.find((u) => u.id === tenant?.currentUnitId)
    const property = mockProperties.find((p) => p.id === unit?.propertyId)

    useEffect(() => {
        const existingInspection = getMoveOutInspectionByTenantId(tenantId)
        if (existingInspection) {
            setInspection(existingInspection)
        } else {
            // Create new inspection if none exists
            const newInspection = {
                id: `inspection-${Date.now()}`,
                tenantId,
                unitId: tenant?.currentUnitId,
                propertyId: unit?.propertyId,
                inspectorId: "user-2",
                inspectionDate: new Date(),
                status: "pending" as InspectionStatus,
                items: [],
                totalDeductions: 0,
                notes: "",
                createdAt: new Date(),
                updatedAt: new Date()
            }
            setInspection(newInspection)
        }
    }, [tenantId, tenant, unit])

    const handleItemChange = (itemId: string, field: string, value: any) => {
        if (!inspection) return

        setInspection({
            ...inspection,
            items: inspection.items.map((item: InspectionItem) =>
                item.id === itemId ? { ...item, [field]: value } : item
            )
        })
    }

    const addInspectionItem = () => {
        if (!inspection || !newItem.title || !newItem.category) return

        const item: InspectionItem = {
            id: `item-${Date.now()}`,
            category: newItem.category as any,
            title: newItem.title,
            description: newItem.description,
            condition: newItem.condition as any,
            deductionAmount: parseFloat(newItem.deductionAmount.toString()) || 0,
            notes: newItem.notes,
            photos: []
        }

        setInspection({
            ...inspection,
            items: [...inspection.items, item],
            totalDeductions: inspection.totalDeductions + item.deductionAmount
        })

        setNewItem({
            category: "",
            title: "",
            description: "",
            condition: "",
            deductionAmount: 0,
            notes: ""
        })
    }

    const removeInspectionItem = (itemId: string) => {
        if (!inspection) return

        const itemToRemove = inspection.items.find((item: InspectionItem) => item.id === itemId)
        const deductionAmount = itemToRemove?.deductionAmount || 0

        setInspection({
            ...inspection,
            items: inspection.items.filter((item: InspectionItem) => item.id !== itemId),
            totalDeductions: inspection.totalDeductions - deductionAmount
        })
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "cleaning": return <Home className="h-4 w-4" />
            case "damage": return <AlertTriangle className="h-4 w-4" />
            case "maintenance": return <Wrench className="h-4 w-4" />
            case "keys": return <Key className="h-4 w-4" />
            case "utilities": return <Zap className="h-4 w-4" />
            default: return <FileText className="h-4 w-4" />
        }
    }

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case "excellent": return "bg-green-100 text-green-800"
            case "good": return "bg-blue-100 text-blue-800"
            case "fair": return "bg-yellow-100 text-yellow-800"
            case "poor": return "bg-orange-100 text-orange-800"
            case "damaged": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusColor = (status: InspectionStatus) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-800"
            case "in_progress": return "bg-blue-100 text-blue-800"
            case "approved": return "bg-purple-100 text-purple-800"
            case "pending": return "bg-yellow-100 text-yellow-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setIsEditing(false)
        }, 1000)
    }

    const handleComplete = async () => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            router.push(`/tenants/${tenantId}`)
        }, 1000)
    }

    if (!tenant || !unit || !property || !inspection) {
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
                            <h1 className="text-2xl font-bold">Move-out Inspection</h1>
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
                                Edit Inspection
                            </Button>
                        )}
                    </div>
                </div>

                {/* Inspection Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Home className="h-5 w-5" />
                            <span>Inspection Overview</span>
                        </CardTitle>
                        <CardDescription>
                            Move-out inspection details and deductions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{inspection.items.length}</div>
                                <div className="text-sm text-muted-foreground">Items Inspected</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    ${inspection.totalDeductions.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Deductions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {inspection.items.filter((item: InspectionItem) => item.deductionAmount > 0).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Items with Deductions</div>
                            </div>
                            <div className="text-center">
                                <Badge className={getStatusColor(inspection.status)}>
                                    {inspection.status.replace('_', ' ')}
                                </Badge>
                                <div className="text-sm text-muted-foreground mt-1">Status</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Inspection Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Inspection Items</CardTitle>
                        <CardDescription>
                            Review and document the condition of each area
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {inspection.items.map((item: InspectionItem) => (
                                <div key={item.id} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            {getCategoryIcon(item.category)}
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-medium">{item.title}</h3>
                                                    <Badge className={getConditionColor(item.condition)}>
                                                        {item.condition}
                                                    </Badge>
                                                    {item.deductionAmount > 0 && (
                                                        <Badge variant="destructive">
                                                            <DollarSign className="h-3 w-3 mr-1" />
                                                            ${item.deductionAmount}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                                {item.notes && (
                                                    <p className="text-sm text-muted-foreground mt-2">{item.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                        {isEditing && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeInspectionItem(item.id)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Add New Item Form */}
                            {isEditing && (
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <h3 className="font-medium mb-4">Add Inspection Item</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="category">Category</Label>
                                            <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cleaning">Cleaning</SelectItem>
                                                    <SelectItem value="damage">Damage</SelectItem>
                                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                                    <SelectItem value="keys">Keys</SelectItem>
                                                    <SelectItem value="utilities">Utilities</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="condition">Condition</Label>
                                            <Select value={newItem.condition} onValueChange={(value) => setNewItem({ ...newItem, condition: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select condition" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="excellent">Excellent</SelectItem>
                                                    <SelectItem value="good">Good</SelectItem>
                                                    <SelectItem value="fair">Fair</SelectItem>
                                                    <SelectItem value="poor">Poor</SelectItem>
                                                    <SelectItem value="damaged">Damaged</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                value={newItem.title}
                                                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                                placeholder="Item title"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="deductionAmount">Deduction Amount ($)</Label>
                                            <Input
                                                id="deductionAmount"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={newItem.deductionAmount}
                                                onChange={(e) => setNewItem({ ...newItem, deductionAmount: parseFloat(e.target.value) || 0 })}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Input
                                                id="description"
                                                value={newItem.description}
                                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                                placeholder="Item description"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="notes">Notes</Label>
                                            <Textarea
                                                id="notes"
                                                value={newItem.notes}
                                                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                                                placeholder="Additional notes"
                                                rows={2}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Button onClick={addInspectionItem} disabled={!newItem.title || !newItem.category}>
                                                Add Item
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Notes Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Inspection Notes</CardTitle>
                        <CardDescription>
                            Add any additional notes or observations about the inspection
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Add notes about the move-out inspection..."
                            value={inspection.notes}
                            onChange={(e) => setInspection({ ...inspection, notes: e.target.value })}
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
                        <Button onClick={handleComplete} disabled={isLoading}>
                            <Send className="h-4 w-4 mr-2" />
                            Complete Inspection
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
} 