"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    ArrowLeft,
    Plus,
    Edit,
    Eye,
    Users,
    Home,
    DollarSign,
    Calendar,
    Search,
    Filter
} from "lucide-react"
import { mockProperties, mockUnits, mockTenants } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UnitType, UnitStatus } from "@/lib/types"
import Link from "next/link"

export default function PropertyUnitsPage() {
    const params = useParams()
    const router = useRouter()
    const propertyId = params.id as string

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedUnit, setSelectedUnit] = useState<any>(null)
    const [formData, setFormData] = useState({
        number: "",
        type: "" as UnitType,
        bedrooms: "",
        bathrooms: "",
        area: "",
        rent: "",
        deposit: "",
        status: "" as UnitStatus,
        floor: "",
        description: "",
        amenities: [] as string[],
    })
    const [newAmenity, setNewAmenity] = useState("")

    const property = mockProperties.find((p) => p.id === propertyId)
    const propertyUnits = mockUnits.filter((u) => u.propertyId === propertyId)

    const filteredUnits = propertyUnits.filter((unit) => {
        const matchesSearch = unit.number.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || unit.status === statusFilter
        const matchesType = typeFilter === "all" || unit.type === typeFilter
        return matchesSearch && matchesStatus && matchesType
    })

    const getStatusColor = (status: UnitStatus) => {
        switch (status) {
            case "available": return "bg-green-100 text-green-800"
            case "occupied": return "bg-blue-100 text-blue-800"
            case "under_maintenance": return "bg-yellow-100 text-yellow-800"
            case "reserved": return "bg-purple-100 text-purple-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getTenantName = (tenantId?: string) => {
        if (!tenantId) return "Vacant"
        const tenant = mockTenants.find(t => t.id === tenantId)
        return tenant ? tenant.name : "Unknown"
    }

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

    const addAmenity = () => {
        if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
            setFormData((prev) => ({
                ...prev,
                amenities: [...prev.amenities, newAmenity.trim()],
            }))
            setNewAmenity("")
        }
    }

    const removeAmenity = (amenity: string) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.filter((a) => a !== amenity),
        }))
    }

    const openEditDialog = (unit: any) => {
        setSelectedUnit(unit)
        setFormData({
            number: unit.number,
            type: unit.type,
            bedrooms: unit.bedrooms.toString(),
            bathrooms: unit.bathrooms.toString(),
            area: unit.area.toString(),
            rent: unit.rent.toString(),
            deposit: unit.deposit.toString(),
            status: unit.status,
            floor: unit.floor?.toString() || "",
            description: unit.description || "",
            amenities: unit.amenities,
        })
        setIsEditDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate API call
        setTimeout(() => {
            setIsAddDialogOpen(false)
            setIsEditDialogOpen(false)
            setFormData({
                number: "",
                type: "" as UnitType,
                bedrooms: "",
                bathrooms: "",
                area: "",
                rent: "",
                deposit: "",
                status: "" as UnitStatus,
                floor: "",
                description: "",
                amenities: [],
            })
        }, 1000)
    }

    if (!property) {
        return (
            <DashboardLayout>
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
                    <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
                    <Button asChild>
                        <Link href="/properties">Back to Properties</Link>
                    </Button>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={`/property/${propertyId}`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Units - {property.name}</h1>
                            <p className="text-muted-foreground">
                                Manage units and their status for this property
                            </p>
                        </div>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Unit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Add New Unit</DialogTitle>
                                <DialogDescription>
                                    Create a new unit for this property
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="number">Unit Number</Label>
                                        <Input
                                            id="number"
                                            name="number"
                                            placeholder="e.g., 101"
                                            value={formData.number}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Unit Type</Label>
                                        <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="studio">Studio</SelectItem>
                                                <SelectItem value="1br">1 Bedroom</SelectItem>
                                                <SelectItem value="2br">2 Bedrooms</SelectItem>
                                                <SelectItem value="3br">3 Bedrooms</SelectItem>
                                                <SelectItem value="4br">4 Bedrooms</SelectItem>
                                                <SelectItem value="penthouse">Penthouse</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="bedrooms">Bedrooms</Label>
                                        <Input
                                            id="bedrooms"
                                            name="bedrooms"
                                            type="number"
                                            min="0"
                                            value={formData.bedrooms}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bathrooms">Bathrooms</Label>
                                        <Input
                                            id="bathrooms"
                                            name="bathrooms"
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            value={formData.bathrooms}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="area">Area (sq ft)</Label>
                                        <Input
                                            id="area"
                                            name="area"
                                            type="number"
                                            min="0"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="floor">Floor</Label>
                                        <Input
                                            id="floor"
                                            name="floor"
                                            type="number"
                                            min="0"
                                            value={formData.floor}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rent">Monthly Rent ($)</Label>
                                        <Input
                                            id="rent"
                                            name="rent"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.rent}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deposit">Security Deposit ($)</Label>
                                        <Input
                                            id="deposit"
                                            name="deposit"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.deposit}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="occupied">Occupied</SelectItem>
                                            <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                                            <SelectItem value="reserved">Reserved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe the unit..."
                                        rows={3}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add amenity..."
                                        value={newAmenity}
                                        onChange={(e) => setNewAmenity(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                                    />
                                    <Button type="button" onClick={addAmenity} disabled={!newAmenity.trim()}>
                                        Add
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {formData.amenities.map((amenity, index) => (
                                        <Badge key={index} variant="secondary">
                                            {amenity}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex gap-2 justify-end">
                                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Add Unit</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Home className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Total Units</p>
                                    <p className="text-2xl font-bold">{propertyUnits.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Occupied</p>
                                    <p className="text-2xl font-bold">
                                        {propertyUnits.filter(u => u.status === "occupied").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Monthly Rent</p>
                                    <p className="text-2xl font-bold">
                                        ${propertyUnits.reduce((sum, u) => sum + u.rent, 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Occupancy Rate</p>
                                    <p className="text-2xl font-bold">
                                        {propertyUnits.length > 0
                                            ? Math.round((propertyUnits.filter(u => u.status === "occupied").length / propertyUnits.length) * 100)
                                            : 0}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search units..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="occupied">Occupied</SelectItem>
                                    <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                                    <SelectItem value="reserved">Reserved</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="studio">Studio</SelectItem>
                                    <SelectItem value="1br">1 Bedroom</SelectItem>
                                    <SelectItem value="2br">2 Bedrooms</SelectItem>
                                    <SelectItem value="3br">3 Bedrooms</SelectItem>
                                    <SelectItem value="4br">4 Bedrooms</SelectItem>
                                    <SelectItem value="penthouse">Penthouse</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("")
                                    setStatusFilter("all")
                                    setTypeFilter("all")
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Units Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Units</CardTitle>
                        <CardDescription>
                            Showing {filteredUnits.length} of {propertyUnits.length} units
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tenant</TableHead>
                                    <TableHead>Rent</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUnits.map((unit) => (
                                    <TableRow key={unit.id}>
                                        <TableCell className="font-medium">{unit.number}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {unit.bedrooms}BR, {unit.bathrooms}BA
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(unit.status)}>
                                                {unit.status.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{getTenantName(unit.currentTenantId)}</TableCell>
                                        <TableCell>${unit.rent.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/units/${unit.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditDialog(unit)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredUnits.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No units found matching your criteria.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Edit Unit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Unit {selectedUnit?.number}</DialogTitle>
                        <DialogDescription>
                            Update unit information and details
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Same form fields as Add Unit dialog */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-number">Unit Number</Label>
                                <Input
                                    id="edit-number"
                                    name="number"
                                    placeholder="e.g., 101"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-type">Unit Type</Label>
                                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="studio">Studio</SelectItem>
                                        <SelectItem value="1br">1 Bedroom</SelectItem>
                                        <SelectItem value="2br">2 Bedrooms</SelectItem>
                                        <SelectItem value="3br">3 Bedrooms</SelectItem>
                                        <SelectItem value="4br">4 Bedrooms</SelectItem>
                                        <SelectItem value="penthouse">Penthouse</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                                <Input
                                    id="edit-bedrooms"
                                    name="bedrooms"
                                    type="number"
                                    min="0"
                                    value={formData.bedrooms}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                                <Input
                                    id="edit-bathrooms"
                                    name="bathrooms"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={formData.bathrooms}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-area">Area (sq ft)</Label>
                                <Input
                                    id="edit-area"
                                    name="area"
                                    type="number"
                                    min="0"
                                    value={formData.area}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-floor">Floor</Label>
                                <Input
                                    id="edit-floor"
                                    name="floor"
                                    type="number"
                                    min="0"
                                    value={formData.floor}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-rent">Monthly Rent ($)</Label>
                                <Input
                                    id="edit-rent"
                                    name="rent"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.rent}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-deposit">Security Deposit ($)</Label>
                                <Input
                                    id="edit-deposit"
                                    name="deposit"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.deposit}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="occupied">Occupied</SelectItem>
                                    <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                                    <SelectItem value="reserved">Reserved</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                name="description"
                                placeholder="Describe the unit..."
                                rows={3}
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Add amenity..."
                                value={newAmenity}
                                onChange={(e) => setNewAmenity(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                            />
                            <Button type="button" onClick={addAmenity} disabled={!newAmenity.trim()}>
                                Add
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {formData.amenities.map((amenity, index) => (
                                <Badge key={index} variant="secondary">
                                    {amenity}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Update Unit</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
} 