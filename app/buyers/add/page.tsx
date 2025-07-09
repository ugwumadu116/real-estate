'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    DollarSign,
    MapPin,
    Home,
    Calendar,
    Plus,
    X
} from 'lucide-react'
import { BuyerStatus, PropertyType } from '@/lib/types'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ProtectedRoute } from '@/lib/auth-context'

export default function AddBuyerPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'prospect' as BuyerStatus,
        budget: {
            min: '',
            max: ''
        },
        preferences: {
            propertyTypes: [] as string[],
            locations: [] as string[],
            bedrooms: {
                min: '',
                max: ''
            },
            bathrooms: {
                min: '',
                max: ''
            },
            features: [] as string[]
        },
        financing: {
            preApproved: false,
            lender: '',
            loanAmount: '',
            downPayment: '',
            creditScore: ''
        },
        timeline: {
            timeframe: '',
            urgency: 'normal'
        },
        notes: ''
    })

    const [newLocation, setNewLocation] = useState('')
    const [newFeature, setNewFeature] = useState('')

    const propertyTypes = [
        'House', 'Condo', 'Apartment', 'Townhouse', 'Commercial', 'Multi-Unit'
    ]

    const commonFeatures = [
        'Garage', 'Pool', 'Garden', 'Balcony', 'Fireplace', 'Hardwood Floors',
        'Updated Kitchen', 'Updated Bathroom', 'Central AC', 'Basement'
    ]

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent as keyof typeof prev],
                [field]: value
            }
        }))
    }

    const handlePropertyTypeToggle = (type: string) => {
        setFormData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                propertyTypes: prev.preferences.propertyTypes.includes(type)
                    ? prev.preferences.propertyTypes.filter(t => t !== type)
                    : [...prev.preferences.propertyTypes, type]
            }
        }))
    }

    const handleFeatureToggle = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                features: prev.preferences.features.includes(feature)
                    ? prev.preferences.features.filter(f => f !== feature)
                    : [...prev.preferences.features, feature]
            }
        }))
    }

    const addLocation = () => {
        if (newLocation.trim() && !formData.preferences.locations.includes(newLocation.trim())) {
            setFormData(prev => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    locations: [...prev.preferences.locations, newLocation.trim()]
                }
            }))
            setNewLocation('')
        }
    }

    const removeLocation = (location: string) => {
        setFormData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                locations: prev.preferences.locations.filter(l => l !== location)
            }
        }))
    }

    const addCustomFeature = () => {
        if (newFeature.trim() && !formData.preferences.features.includes(newFeature.trim())) {
            setFormData(prev => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    features: [...prev.preferences.features, newFeature.trim()]
                }
            }))
            setNewFeature('')
        }
    }

    const removeFeature = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                features: prev.preferences.features.filter(f => f !== feature)
            }
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically save the buyer data
        console.log('Buyer data:', formData)
        // Redirect to buyers page
        window.location.href = '/buyers'
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="container mx-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Button asChild variant="outline" size="icon">
                            <Link href="/buyers">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Add New Buyer</h1>
                            <p className="text-muted-foreground">Create a new buyer profile with their preferences and requirements</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>Enter the buyer's contact and personal information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="Enter email address"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="Enter phone number"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="prospect">Prospect</SelectItem>
                                                <SelectItem value="interested">Interested</SelectItem>
                                                <SelectItem value="qualified">Qualified</SelectItem>
                                                <SelectItem value="under_contract">Under Contract</SelectItem>
                                                <SelectItem value="closed">Closed</SelectItem>
                                                <SelectItem value="lost">Lost</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Budget */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Budget Range
                                </CardTitle>
                                <CardDescription>Define the buyer's budget range for property purchase</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="minBudget">Minimum Budget</Label>
                                        <Input
                                            id="minBudget"
                                            type="number"
                                            value={formData.budget.min}
                                            onChange={(e) => handleNestedChange('budget', 'min', e.target.value)}
                                            placeholder="Enter minimum budget"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maxBudget">Maximum Budget</Label>
                                        <Input
                                            id="maxBudget"
                                            type="number"
                                            value={formData.budget.max}
                                            onChange={(e) => handleNestedChange('budget', 'max', e.target.value)}
                                            placeholder="Enter maximum budget"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Property Preferences */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Home className="w-5 h-5" />
                                    Property Preferences
                                </CardTitle>
                                <CardDescription>Specify the buyer's property preferences and requirements</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Property Types */}
                                <div className="space-y-3">
                                    <Label>Property Types</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {propertyTypes.map((type) => (
                                            <Badge
                                                key={type}
                                                variant={formData.preferences.propertyTypes.includes(type) ? "default" : "outline"}
                                                className="cursor-pointer"
                                                onClick={() => handlePropertyTypeToggle(type)}
                                            >
                                                {type}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Locations */}
                                <div className="space-y-3">
                                    <Label>Preferred Locations</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newLocation}
                                            onChange={(e) => setNewLocation(e.target.value)}
                                            placeholder="Add preferred location"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                                        />
                                        <Button type="button" onClick={addLocation} size="icon">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.preferences.locations.map((location) => (
                                            <Badge key={location} variant="secondary" className="flex items-center gap-1">
                                                {location}
                                                <X
                                                    className="w-3 h-3 cursor-pointer"
                                                    onClick={() => removeLocation(location)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Bedrooms and Bathrooms */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="minBedrooms">Min Bedrooms</Label>
                                        <Input
                                            id="minBedrooms"
                                            type="number"
                                            value={formData.preferences.bedrooms.min}
                                            onChange={(e) => handleNestedChange('preferences', 'bedrooms', {
                                                ...formData.preferences.bedrooms,
                                                min: e.target.value
                                            })}
                                            placeholder="Min"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maxBedrooms">Max Bedrooms</Label>
                                        <Input
                                            id="maxBedrooms"
                                            type="number"
                                            value={formData.preferences.bedrooms.max}
                                            onChange={(e) => handleNestedChange('preferences', 'bedrooms', {
                                                ...formData.preferences.bedrooms,
                                                max: e.target.value
                                            })}
                                            placeholder="Max"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="minBathrooms">Min Bathrooms</Label>
                                        <Input
                                            id="minBathrooms"
                                            type="number"
                                            value={formData.preferences.bathrooms.min}
                                            onChange={(e) => handleNestedChange('preferences', 'bathrooms', {
                                                ...formData.preferences.bathrooms,
                                                min: e.target.value
                                            })}
                                            placeholder="Min"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maxBathrooms">Max Bathrooms</Label>
                                        <Input
                                            id="maxBathrooms"
                                            type="number"
                                            value={formData.preferences.bathrooms.max}
                                            onChange={(e) => handleNestedChange('preferences', 'bathrooms', {
                                                ...formData.preferences.bathrooms,
                                                max: e.target.value
                                            })}
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>

                                <Separator />

                                {/* Features */}
                                <div className="space-y-3">
                                    <Label>Desired Features</Label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {commonFeatures.map((feature) => (
                                            <Badge
                                                key={feature}
                                                variant={formData.preferences.features.includes(feature) ? "default" : "outline"}
                                                className="cursor-pointer"
                                                onClick={() => handleFeatureToggle(feature)}
                                            >
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            placeholder="Add custom feature"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
                                        />
                                        <Button type="button" onClick={addCustomFeature} size="icon">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.preferences.features.filter(f => !commonFeatures.includes(f)).map((feature) => (
                                            <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                                                {feature}
                                                <X
                                                    className="w-3 h-3 cursor-pointer"
                                                    onClick={() => removeFeature(feature)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financing */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Financing Information
                                </CardTitle>
                                <CardDescription>Enter the buyer's financing details and pre-approval status</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="preApproved"
                                        checked={formData.financing.preApproved}
                                        onCheckedChange={(checked) => handleNestedChange('financing', 'preApproved', checked)}
                                    />
                                    <Label htmlFor="preApproved">Pre-approved for financing</Label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lender">Lender</Label>
                                        <Input
                                            id="lender"
                                            value={formData.financing.lender}
                                            onChange={(e) => handleNestedChange('financing', 'lender', e.target.value)}
                                            placeholder="Enter lender name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="loanAmount">Loan Amount</Label>
                                        <Input
                                            id="loanAmount"
                                            type="number"
                                            value={formData.financing.loanAmount}
                                            onChange={(e) => handleNestedChange('financing', 'loanAmount', e.target.value)}
                                            placeholder="Enter loan amount"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="downPayment">Down Payment</Label>
                                        <Input
                                            id="downPayment"
                                            type="number"
                                            value={formData.financing.downPayment}
                                            onChange={(e) => handleNestedChange('financing', 'downPayment', e.target.value)}
                                            placeholder="Enter down payment amount"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="creditScore">Credit Score</Label>
                                        <Input
                                            id="creditScore"
                                            type="number"
                                            value={formData.financing.creditScore}
                                            onChange={(e) => handleNestedChange('financing', 'creditScore', e.target.value)}
                                            placeholder="Enter credit score"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Timeline & Urgency
                                </CardTitle>
                                <CardDescription>Specify the buyer's timeline and urgency level</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="timeframe">Preferred Timeframe</Label>
                                        <Select value={formData.timeline.timeframe} onValueChange={(value) => handleNestedChange('timeline', 'timeframe', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select timeframe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="immediate">Immediate (0-30 days)</SelectItem>
                                                <SelectItem value="soon">Soon (1-3 months)</SelectItem>
                                                <SelectItem value="flexible">Flexible (3-6 months)</SelectItem>
                                                <SelectItem value="no_rush">No Rush (6+ months)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="urgency">Urgency Level</Label>
                                        <Select value={formData.timeline.urgency} onValueChange={(value) => handleNestedChange('timeline', 'urgency', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="normal">Normal</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="urgent">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Notes</CardTitle>
                                <CardDescription>Add any additional information about the buyer</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    placeholder="Enter any additional notes about the buyer..."
                                    rows={4}
                                />
                            </CardContent>
                        </Card>

                        {/* Submit */}
                        <div className="flex justify-end gap-4">
                            <Button asChild variant="outline">
                                <Link href="/buyers">Cancel</Link>
                            </Button>
                            <Button type="submit">Create Buyer</Button>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    )
} 