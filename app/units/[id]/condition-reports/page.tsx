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
    FileText,
    Home,
    User,
    Calendar,
    Camera,
    Plus,
    Save,
    Download,
    Eye,
    Edit,
    Trash2,
    Star,
    AlertTriangle,
    CheckCircle,
    Clock
} from "lucide-react"
import { mockUnits, mockProperties, mockUnitConditionReports, getUnitConditionReportsByUnitId } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UnitConditionReport, ConditionArea } from "@/lib/types"
import Link from "next/link"

export default function UnitConditionReportsPage() {
    const params = useParams()
    const router = useRouter()
    const unitId = params.id as string

    const [reports, setReports] = useState<UnitConditionReport[]>([])
    const [selectedReport, setSelectedReport] = useState<UnitConditionReport | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [newReport, setNewReport] = useState({
        reportType: "",
        overallCondition: "",
        notes: ""
    })
    const [newArea, setNewArea] = useState({
        name: "",
        category: "",
        condition: "",
        description: "",
        estimatedRepairCost: 0
    })

    const unit = mockUnits.find((u) => u.id === unitId)
    const property = mockProperties.find((p) => p.id === unit?.propertyId)

    useEffect(() => {
        const unitReports = getUnitConditionReportsByUnitId(unitId)
        setReports(unitReports)
    }, [unitId])

    const handleCreateReport = () => {
        if (!newReport.reportType || !newReport.overallCondition) return

        const report: UnitConditionReport = {
            id: `report-${Date.now()}`,
            unitId,
            propertyId: unit?.propertyId || "",
            reportType: newReport.reportType as any,
            inspectorId: "user-2",
            inspectionDate: new Date(),
            areas: [],
            overallCondition: newReport.overallCondition as any,
            notes: newReport.notes,
            photos: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }

        setReports([...reports, report])
        setSelectedReport(report)
        setNewReport({ reportType: "", overallCondition: "", notes: "" })
        setIsCreating(false)
        setIsEditing(true)
    }

    const addArea = () => {
        if (!selectedReport || !newArea.name || !newArea.category || !newArea.condition) return

        const area: ConditionArea = {
            id: `area-${Date.now()}`,
            name: newArea.name,
            category: newArea.category as any,
            condition: newArea.condition as any,
            description: newArea.description,
            issues: [],
            photos: [],
            estimatedRepairCost: newArea.estimatedRepairCost || undefined
        }

        setSelectedReport({
            ...selectedReport,
            areas: [...selectedReport.areas, area]
        })

        setNewArea({
            name: "",
            category: "",
            condition: "",
            description: "",
            estimatedRepairCost: 0
        })
    }

    const removeArea = (areaId: string) => {
        if (!selectedReport) return

        setSelectedReport({
            ...selectedReport,
            areas: selectedReport.areas.filter(area => area.id !== areaId)
        })
    }

    const getReportTypeColor = (type: string) => {
        switch (type) {
            case "move_in": return "bg-green-100 text-green-800"
            case "move_out": return "bg-red-100 text-red-800"
            case "periodic": return "bg-blue-100 text-blue-800"
            default: return "bg-gray-100 text-gray-800"
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

    const getConditionIcon = (condition: string) => {
        switch (condition) {
            case "excellent": return <Star className="h-4 w-4" />
            case "good": return <CheckCircle className="h-4 w-4" />
            case "fair": return <Clock className="h-4 w-4" />
            case "poor": return <AlertTriangle className="h-4 w-4" />
            case "damaged": return <AlertTriangle className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
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

    if (!unit || !property) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-lg font-semibold">Unit not found</div>
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
                        <Link href={`/units/${unitId}`}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Unit
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Condition Reports</h1>
                            <p className="text-muted-foreground">
                                {unit.number} at {property.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {!isCreating && (
                            <Button onClick={() => setIsCreating(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                New Report
                            </Button>
                        )}
                    </div>
                </div>

                {/* Reports Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="h-5 w-5" />
                            <span>Reports Overview</span>
                        </CardTitle>
                        <CardDescription>
                            All condition reports for this unit
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
                                <div className="text-sm text-muted-foreground">Total Reports</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {reports.filter(r => r.reportType === "move_in").length}
                                </div>
                                <div className="text-sm text-muted-foreground">Move-in Reports</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {reports.filter(r => r.reportType === "move_out").length}
                                </div>
                                <div className="text-sm text-muted-foreground">Move-out Reports</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {reports.filter(r => r.reportType === "periodic").length}
                                </div>
                                <div className="text-sm text-muted-foreground">Periodic Reports</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Create New Report */}
                {isCreating && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Condition Report</CardTitle>
                            <CardDescription>
                                Start a new condition assessment
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="reportType">Report Type</Label>
                                    <Select value={newReport.reportType} onValueChange={(value) => setNewReport({ ...newReport, reportType: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select report type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="move_in">Move-in Inspection</SelectItem>
                                            <SelectItem value="move_out">Move-out Inspection</SelectItem>
                                            <SelectItem value="periodic">Periodic Inspection</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="overallCondition">Overall Condition</Label>
                                    <Select value={newReport.overallCondition} onValueChange={(value) => setNewReport({ ...newReport, overallCondition: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="excellent">Excellent</SelectItem>
                                            <SelectItem value="good">Good</SelectItem>
                                            <SelectItem value="fair">Fair</SelectItem>
                                            <SelectItem value="poor">Poor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={newReport.notes}
                                        onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
                                        placeholder="General notes about the inspection"
                                        rows={3}
                                    />
                                </div>
                                <div className="md:col-span-2 flex space-x-2">
                                    <Button onClick={handleCreateReport} disabled={!newReport.reportType || !newReport.overallCondition}>
                                        Create Report
                                    </Button>
                                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Reports List */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Reports</CardTitle>
                        <CardDescription>
                            View and manage condition reports
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {reports.map((report) => (
                                <div key={report.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-2">
                                                <Badge className={getReportTypeColor(report.reportType)}>
                                                    {report.reportType.replace('_', ' ')}
                                                </Badge>
                                                <Badge className={getConditionColor(report.overallCondition)}>
                                                    {getConditionIcon(report.overallCondition)}
                                                    <span className="ml-1">{report.overallCondition}</span>
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(report.inspectionDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedReport(report)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedReport(report)
                                                    setIsEditing(true)
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {reports.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No condition reports found. Create your first report.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Selected Report Details */}
                {selectedReport && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Report Details</span>
                                <div className="flex space-x-2">
                                    {isEditing && (
                                        <>
                                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleSave} disabled={isLoading}>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardTitle>
                            <CardDescription>
                                {selectedReport.reportType.replace('_', ' ')} inspection on {new Date(selectedReport.inspectionDate).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="overview" className="space-y-6">
                                <TabsList>
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="areas">Areas</TabsTrigger>
                                    <TabsTrigger value="photos">Photos</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Report Type</Label>
                                            <div className="mt-1">
                                                <Badge className={getReportTypeColor(selectedReport.reportType)}>
                                                    {selectedReport.reportType.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Overall Condition</Label>
                                            <div className="mt-1">
                                                <Badge className={getConditionColor(selectedReport.overallCondition)}>
                                                    {getConditionIcon(selectedReport.overallCondition)}
                                                    <span className="ml-1">{selectedReport.overallCondition}</span>
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Inspection Date</Label>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{new Date(selectedReport.inspectionDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Inspector</Label>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span>Inspector ID: {selectedReport.inspectorId}</span>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>Notes</Label>
                                            <Textarea
                                                value={selectedReport.notes}
                                                onChange={(e) => setSelectedReport({ ...selectedReport, notes: e.target.value })}
                                                disabled={!isEditing}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="areas" className="space-y-6">
                                    <div className="space-y-4">
                                        {selectedReport.areas.map((area) => (
                                            <div key={area.id} className="border rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <h3 className="font-medium">{area.name}</h3>
                                                            <Badge className={getConditionColor(area.condition)}>
                                                                {getConditionIcon(area.condition)}
                                                                <span className="ml-1">{area.condition}</span>
                                                            </Badge>
                                                            {area.estimatedRepairCost && area.estimatedRepairCost > 0 && (
                                                                <Badge variant="destructive">
                                                                    ${area.estimatedRepairCost}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">{area.description}</p>
                                                        {area.issues.length > 0 && (
                                                            <div className="mt-2">
                                                                <Label className="text-sm">Issues:</Label>
                                                                <ul className="text-sm text-muted-foreground mt-1">
                                                                    {area.issues.map((issue, index) => (
                                                                        <li key={index}>• {issue}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isEditing && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeArea(area.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add New Area Form */}
                                        {isEditing && (
                                            <div className="border rounded-lg p-4 bg-gray-50">
                                                <h3 className="font-medium mb-4">Add Area</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="areaName">Area Name</Label>
                                                        <Input
                                                            id="areaName"
                                                            value={newArea.name}
                                                            onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                                                            placeholder="e.g., Living Room"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="areaCategory">Category</Label>
                                                        <Select value={newArea.category} onValueChange={(value) => setNewArea({ ...newArea, category: value })}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="living_room">Living Room</SelectItem>
                                                                <SelectItem value="bedroom">Bedroom</SelectItem>
                                                                <SelectItem value="kitchen">Kitchen</SelectItem>
                                                                <SelectItem value="bathroom">Bathroom</SelectItem>
                                                                <SelectItem value="hallway">Hallway</SelectItem>
                                                                <SelectItem value="balcony">Balcony</SelectItem>
                                                                <SelectItem value="storage">Storage</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="areaCondition">Condition</Label>
                                                        <Select value={newArea.condition} onValueChange={(value) => setNewArea({ ...newArea, condition: value })}>
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
                                                        <Label htmlFor="repairCost">Estimated Repair Cost ($)</Label>
                                                        <Input
                                                            id="repairCost"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={newArea.estimatedRepairCost}
                                                            onChange={(e) => setNewArea({ ...newArea, estimatedRepairCost: parseFloat(e.target.value) || 0 })}
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Label htmlFor="areaDescription">Description</Label>
                                                        <Textarea
                                                            id="areaDescription"
                                                            value={newArea.description}
                                                            onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                                                            placeholder="Describe the area condition"
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Button onClick={addArea} disabled={!newArea.name || !newArea.category || !newArea.condition}>
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Area
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="photos" className="space-y-6">
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Photo upload functionality will be implemented in future updates</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    )
} 