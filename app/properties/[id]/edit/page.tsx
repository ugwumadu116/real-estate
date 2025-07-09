"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, X, ArrowLeft, Save, Trash2 } from "lucide-react"
import { mockProperties } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PropertyType, PropertyStatus } from "@/lib/types"
import Link from "next/link"

export default function EditPropertyPage() {
    const params = useParams()
    const router = useRouter()
    const propertyId = params.id as string

    const [formData, setFormData] = useState({
        name: "",
        type: "" as PropertyType,
        status: "" as PropertyStatus,
        description: "",
        yearBuilt: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        amenities: [] as string[],
    })
    const [images, setImages] = useState<string[]>([])
    const [newAmenity, setNewAmenity] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const property = mockProperties.find((p) => p.id === propertyId)

    useEffect(() => {
        if (property) {
            setFormData({
                name: property.name,
                type: property.type,
                status: property.status,
                description: property.description,
                yearBuilt: property.yearBuilt?.toString() || "",
                street: property.address.street,
                city: property.address.city,
                state: property.address.state,
                zipCode: property.address.zipCode,
                country: property.address.country,
                amenities: property.amenities,
            })
            setImages(property.images)
        }
    }, [property])

    if (!property) {
        return (
            <DashboardLayout>
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
                    <p className="text-muted-foreground mb-4">The property you're trying to edit doesn't exist.</p>
                    <Button asChild>
                        <Link href="/properties">Back to Properties</Link>
                    </Button>
                </div>
            </DashboardLayout>
        )
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const newImages = Array.from(files).map(
                (_, index) => `/placeholder.svg?height=400&width=600&text=Property+Image+${images.length + index + 1}`,
            )
            setImages((prev) => [...prev, ...newImages])
        }
    }

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        // Simulate API call
        setTimeout(() => {
            setSuccess(true)
            setIsLoading(false)
        }, 2000)
    }

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
            setIsLoading(true)
            // Simulate API call
            setTimeout(() => {
                router.push("/properties")
            }, 1000)
        }
    }

    if (success) {
        return (
            <DashboardLayout>
                <div className="max-w-md mx-auto">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="text-green-600 text-6xl mb-4">✓</div>
                            <h2 className="text-2xl font-bold mb-2">Property Updated!</h2>
                            <p className="text-muted-foreground mb-4">Your property has been successfully updated.</p>
                            <div className="flex gap-2 justify-center">
                                <Button asChild>
                                    <Link href={`/property/${propertyId}`}>View Property</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/properties">Back to Properties</Link>
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
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={`/property/${propertyId}`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
                            <p className="text-muted-foreground">Update property information and details</p>
                        </div>
                    </div>
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Property
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Update the property's basic details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Property Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="e.g., Sunset Apartments"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Property Type</Label>
                                    <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select property type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="apartment">Apartment</SelectItem>
                                            <SelectItem value="house">House</SelectItem>
                                            <SelectItem value="condo">Condo</SelectItem>
                                            <SelectItem value="townhouse">Townhouse</SelectItem>
                                            <SelectItem value="commercial">Commercial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                            <SelectItem value="development">Development</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="yearBuilt">Year Built</Label>
                                    <Input
                                        id="yearBuilt"
                                        name="yearBuilt"
                                        type="number"
                                        placeholder="e.g., 2020"
                                        value={formData.yearBuilt}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe the property in detail..."
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Address Information</CardTitle>
                            <CardDescription>Update the property's address details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="street">Street Address</Label>
                                <Input
                                    id="street"
                                    name="street"
                                    placeholder="e.g., 123 Main Street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="e.g., New York"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        placeholder="e.g., NY"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zipCode">ZIP Code</Label>
                                    <Input
                                        id="zipCode"
                                        name="zipCode"
                                        placeholder="e.g., 10001"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    placeholder="e.g., United States"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Amenities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities & Features</CardTitle>
                            <CardDescription>Manage the property's amenities and features</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add new amenity..."
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
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {amenity}
                                        <button
                                            type="button"
                                            onClick={() => removeAmenity(amenity)}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Images</CardTitle>
                            <CardDescription>Manage property photos and images</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image}
                                            alt={`Property image ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </label>
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
                            <Link href={`/property/${propertyId}`}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
} 