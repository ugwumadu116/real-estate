"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    FileText,
    Home,
    Key,
    CreditCard,
    Wrench,
    Zap,
    Calendar,
    User,
    Save,
    Send
} from "lucide-react"
import { mockTenants, mockUnits, mockProperties, mockMoveInChecklists, getMoveInChecklistByTenantId } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ChecklistStatus, ChecklistItem } from "@/lib/types"
import Link from "next/link"

export default function MoveInChecklistPage() {
    const params = useParams()
    const router = useRouter()
    const tenantId = params.id as string

    const [checklist, setChecklist] = useState<any>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [notes, setNotes] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const tenant = mockTenants.find((t) => t.id === tenantId)
    const unit = mockUnits.find((u) => u.id === tenant?.currentUnitId)
    const property = mockProperties.find((p) => p.id === unit?.propertyId)

    useEffect(() => {
        const existingChecklist = getMoveInChecklistByTenantId(tenantId)
        if (existingChecklist) {
            setChecklist(existingChecklist)
            setNotes(existingChecklist.notes || "")
        } else {
            // Create new checklist if none exists
            const newChecklist = {
                id: `checklist-${Date.now()}`,
                tenantId,
                unitId: tenant?.currentUnitId,
                propertyId: unit?.propertyId,
                items: [
                    {
                        id: "item-1",
                        category: "keys",
                        title: "Unit Keys Handover",
                        description: "Receive keys to the unit and mailbox",
                        status: "pending" as ChecklistStatus,
                        required: true
                    },
                    {
                        id: "item-2",
                        category: "utilities",
                        title: "Utility Account Setup",
                        description: "Set up electricity, water, and internet accounts",
                        status: "pending" as ChecklistStatus,
                        required: true
                    },
                    {
                        id: "item-3",
                        category: "inspection",
                        title: "Unit Walkthrough",
                        description: "Complete initial unit inspection with photos",
                        status: "pending" as ChecklistStatus,
                        required: true
                    },
                    {
                        id: "item-4",
                        category: "documentation",
                        title: "Lease Agreement Review",
                        description: "Review and sign lease agreement",
                        status: "pending" as ChecklistStatus,
                        required: true
                    },
                    {
                        id: "item-5",
                        category: "payment",
                        title: "Security Deposit Payment",
                        description: "Pay security deposit and first month's rent",
                        status: "pending" as ChecklistStatus,
                        required: true
                    }
                ],
                completedBy: "",
                notes: "",
                createdAt: new Date(),
                updatedAt: new Date()
            }
            setChecklist(newChecklist)
        }
    }, [tenantId, tenant, unit])

    const handleItemStatusChange = (itemId: string, status: ChecklistStatus) => {
        if (!checklist) return

        setChecklist({
            ...checklist,
            items: checklist.items.map((item: ChecklistItem) =>
                item.id === itemId
                    ? {
                        ...item,
                        status,
                        completedAt: status === "completed" ? new Date() : undefined,
                        completedBy: status === "completed" ? "user-2" : undefined
                    }
                    : item
            )
        })
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "keys": return <Key className="h-4 w-4" />
            case "utilities": return <Zap className="h-4 w-4" />
            case "inspection": return <Wrench className="h-4 w-4" />
            case "documentation": return <FileText className="h-4 w-4" />
            case "payment": return <CreditCard className="h-4 w-4" />
            default: return <CheckCircle className="h-4 w-4" />
        }
    }

    const getStatusColor = (status: ChecklistStatus) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-800"
            case "pending": return "bg-yellow-100 text-yellow-800"
            case "skipped": return "bg-gray-100 text-gray-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusIcon = (status: ChecklistStatus) => {
        switch (status) {
            case "completed": return <CheckCircle className="h-4 w-4" />
            case "pending": return <Clock className="h-4 w-4" />
            case "skipped": return <FileText className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    const completedItems = checklist?.items.filter((item: ChecklistItem) => item.status === "completed").length || 0
    const totalItems = checklist?.items.length || 0
    const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

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

    if (!tenant || !unit || !property || !checklist) {
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
                            <h1 className="text-2xl font-bold">Move-in Checklist</h1>
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
                                Edit Checklist
                            </Button>
                        )}
                    </div>
                </div>

                {/* Progress Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Home className="h-5 w-5" />
                            <span>Move-in Progress</span>
                        </CardTitle>
                        <CardDescription>
                            Track the completion of move-in tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{completedItems}</div>
                                <div className="text-sm text-muted-foreground">Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">{totalItems - completedItems}</div>
                                <div className="text-sm text-muted-foreground">Pending</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{Math.round(progressPercentage)}%</div>
                                <div className="text-sm text-muted-foreground">Complete</div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Checklist Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Checklist Items</CardTitle>
                        <CardDescription>
                            Mark items as completed as you go through the move-in process
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {checklist.items.map((item: ChecklistItem) => (
                                <div key={item.id} className="border rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex items-center space-x-2">
                                            {isEditing ? (
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleItemStatusChange(item.id, e.target.value as ChecklistStatus)}
                                                    className="text-sm border rounded px-2 py-1"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="skipped">Skipped</option>
                                                </select>
                                            ) : (
                                                <Checkbox
                                                    checked={item.status === "completed"}
                                                    onCheckedChange={(checked) =>
                                                        handleItemStatusChange(item.id, checked ? "completed" : "pending")
                                                    }
                                                    disabled={!isEditing}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                {getCategoryIcon(item.category)}
                                                <h3 className="font-medium">{item.title}</h3>
                                                <Badge className={getStatusColor(item.status)}>
                                                    {getStatusIcon(item.status)}
                                                    <span className="ml-1">{item.status}</span>
                                                </Badge>
                                                {item.required && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Required
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                            {item.status === "completed" && item.completedAt && (
                                                <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Completed on {new Date(item.completedAt).toLocaleDateString()}</span>
                                                    {item.completedBy && (
                                                        <>
                                                            <User className="h-3 w-3" />
                                                            <span>by {item.completedBy}</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Notes Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                        <CardDescription>
                            Add any additional notes or observations about the move-in process
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Add notes about the move-in process..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
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
                        <Button onClick={handleComplete} disabled={isLoading || progressPercentage < 100}>
                            <Send className="h-4 w-4 mr-2" />
                            Complete Move-in
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
} 