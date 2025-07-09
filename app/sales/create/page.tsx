'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    Home,
    User,
    DollarSign,
    Calendar,
    FileText,
    Plus
} from 'lucide-react'
import { SaleStatus } from '@/lib/types'
import { mockProperties, mockBuyers, mockPropertyListings } from '@/lib/mock-data'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ProtectedRoute } from '@/lib/auth-context'

export default function CreateSalePage() {
    const [formData, setFormData] = useState({
        propertyId: '',
        listingId: '',
        buyerId: '',
        status: 'pending' as SaleStatus,
        offerPrice: '',
        acceptedPrice: '',
        earnestMoney: '',
        financing: {
            type: 'conventional',
            downPayment: '',
            loanAmount: '',
            lender: '',
            preApproved: false
        },
        closingDate: '',
        actualClosingDate: '',
        commission: {
            totalCommission: '',
            agentCommission: '',
            brokerCommission: ''
        },
        timeline: [
            { step: 'Offer Submitted', status: 'completed', date: new Date().toISOString() },
            { step: 'Offer Accepted', status: 'pending', date: '' },
            { step: 'Inspection', status: 'pending', date: '' },
            { step: 'Appraisal', status: 'pending', date: '' },
            { step: 'Loan Approval', status: 'pending', date: '' },
            { step: 'Closing', status: 'pending', date: '' }
        ],
        notes: ''
    })

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

    const handleTimelineChange = (index: number, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            timeline: prev.timeline.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const calculateCommission = () => {
        const acceptedPrice = Number(formData.acceptedPrice)
        if (acceptedPrice > 0) {
            const totalCommission = acceptedPrice * 0.06 // 6% commission
            const agentCommission = totalCommission * 0.7 // 70% to agent
            const brokerCommission = totalCommission * 0.3 // 30% to broker

            setFormData(prev => ({
                ...prev,
                commission: {
                    totalCommission: totalCommission.toString(),
                    agentCommission: agentCommission.toString(),
                    brokerCommission: brokerCommission.toString()
                }
            }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically save the sale data
        console.log('Sale data:', formData)
        // Redirect to sales page
        window.location.href = '/sales'
    }

    const selectedProperty = mockProperties.find(p => p.id === formData.propertyId)
    const selectedBuyer = mockBuyers.find(b => b.id === formData.buyerId)
    const selectedListing = mockPropertyListings.find(l => l.id === formData.listingId)

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="container mx-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Button asChild variant="outline" size="icon">
                            <Link href="/sales">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Create New Sale</h1>
                            <p className="text-muted-foreground">Create a new property sale record with buyer and transaction details</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Property and Buyer Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Home className="w-5 h-5" />
                                    Property & Buyer Selection
                                </CardTitle>
                                <CardDescription>Select the property and buyer for this sale</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="property">Property *</Label>
                                        <Select value={formData.propertyId} onValueChange={(value) => handleInputChange('propertyId', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select property" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mockProperties.filter(p => p.status === 'for_sale').map((property) => (
                                                    <SelectItem key={property.id} value={property.id}>
                                                        {property.name} - {property.address.street}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="listing">Listing</Label>
                                        <Select value={formData.listingId} onValueChange={(value) => handleInputChange('listingId', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select listing (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">No listing</SelectItem>
                                                {mockPropertyListings.filter(l => l.propertyId === formData.propertyId).map((listing) => (
                                                    <SelectItem key={listing.id} value={listing.id}>
                                                        {listing.title} - {listing.listingPrice}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="buyer">Buyer *</Label>
                                        <Select value={formData.buyerId} onValueChange={(value) => handleInputChange('buyerId', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select buyer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mockBuyers.map((buyer) => (
                                                    <SelectItem key={buyer.id} value={buyer.id}>
                                                        {buyer.name} - {buyer.email}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Sale Status</Label>
                                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="under_contract">Under Contract</SelectItem>
                                                <SelectItem value="closing">Closing</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Selected Property Info */}
                                {selectedProperty && (
                                    <div className="p-4 bg-muted rounded-lg">
                                        <h4 className="font-medium mb-2">Selected Property</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Name:</span>
                                                <span className="ml-2 font-medium">{selectedProperty.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Address:</span>
                                                <span className="ml-2 font-medium">
                                                    {selectedProperty.address.street}, {selectedProperty.address.city}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Type:</span>
                                                <span className="ml-2 font-medium">{selectedProperty.type}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Units:</span>
                                                <span className="ml-2 font-medium">{selectedProperty.units.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Selected Buyer Info */}
                                {selectedBuyer && (
                                    <div className="p-4 bg-muted rounded-lg">
                                        <h4 className="font-medium mb-2">Selected Buyer</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Name:</span>
                                                <span className="ml-2 font-medium">{selectedBuyer.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Email:</span>
                                                <span className="ml-2 font-medium">{selectedBuyer.email}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Budget:</span>
                                                <span className="ml-2 font-medium">
                                                    ${selectedBuyer.budget.min.toLocaleString()} - ${selectedBuyer.budget.max.toLocaleString()}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Status:</span>
                                                <span className="ml-2 font-medium">{selectedBuyer.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Financial Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Financial Details
                                </CardTitle>
                                <CardDescription>Enter the offer and sale financial information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="offerPrice">Offer Price *</Label>
                                        <Input
                                            id="offerPrice"
                                            type="number"
                                            value={formData.offerPrice}
                                            onChange={(e) => handleInputChange('offerPrice', e.target.value)}
                                            placeholder="Enter offer price"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="acceptedPrice">Accepted Price *</Label>
                                        <Input
                                            id="acceptedPrice"
                                            type="number"
                                            value={formData.acceptedPrice}
                                            onChange={(e) => {
                                                handleInputChange('acceptedPrice', e.target.value)
                                                if (e.target.value) {
                                                    setTimeout(calculateCommission, 100)
                                                }
                                            }}
                                            placeholder="Enter accepted price"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="earnestMoney">Earnest Money</Label>
                                        <Input
                                            id="earnestMoney"
                                            type="number"
                                            value={formData.earnestMoney}
                                            onChange={(e) => handleInputChange('earnestMoney', e.target.value)}
                                            placeholder="Enter earnest money"
                                        />
                                    </div>
                                </div>

                                <Separator />

                                {/* Commission */}
                                <div className="space-y-4">
                                    <h4 className="font-medium">Commission Breakdown</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="totalCommission">Total Commission</Label>
                                            <Input
                                                id="totalCommission"
                                                type="number"
                                                value={formData.commission.totalCommission}
                                                onChange={(e) => handleNestedChange('commission', 'totalCommission', e.target.value)}
                                                placeholder="Total commission"
                                                readOnly
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="agentCommission">Agent Commission</Label>
                                            <Input
                                                id="agentCommission"
                                                type="number"
                                                value={formData.commission.agentCommission}
                                                onChange={(e) => handleNestedChange('commission', 'agentCommission', e.target.value)}
                                                placeholder="Agent commission"
                                                readOnly
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="brokerCommission">Broker Commission</Label>
                                            <Input
                                                id="brokerCommission"
                                                type="number"
                                                value={formData.commission.brokerCommission}
                                                onChange={(e) => handleNestedChange('commission', 'brokerCommission', e.target.value)}
                                                placeholder="Broker commission"
                                                readOnly
                                            />
                                        </div>
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
                                <CardDescription>Enter the buyer's financing details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="financingType">Financing Type</Label>
                                        <Select value={formData.financing.type} onValueChange={(value) => handleNestedChange('financing', 'type', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="conventional">Conventional</SelectItem>
                                                <SelectItem value="fha">FHA</SelectItem>
                                                <SelectItem value="va">VA</SelectItem>
                                                <SelectItem value="usda">USDA</SelectItem>
                                                <SelectItem value="cash">Cash</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
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
                                        <Label htmlFor="downPayment">Down Payment</Label>
                                        <Input
                                            id="downPayment"
                                            type="number"
                                            value={formData.financing.downPayment}
                                            onChange={(e) => handleNestedChange('financing', 'downPayment', e.target.value)}
                                            placeholder="Enter down payment"
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
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="preApproved"
                                        checked={formData.financing.preApproved}
                                        onCheckedChange={(checked) => handleNestedChange('financing', 'preApproved', checked)}
                                    />
                                    <Label htmlFor="preApproved">Pre-approved for financing</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Sale Timeline
                                </CardTitle>
                                <CardDescription>Track the progress of the sale through key milestones</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.timeline.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="font-medium">{item.step}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={item.status}
                                                onValueChange={(value) => handleTimelineChange(index, 'status', value)}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="date"
                                                value={item.date ? new Date(item.date).toISOString().split('T')[0] : ''}
                                                onChange={(e) => handleTimelineChange(index, 'date', e.target.value)}
                                                className="w-40"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Closing Dates */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Closing Information
                                </CardTitle>
                                <CardDescription>Set the expected and actual closing dates</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="closingDate">Expected Closing Date *</Label>
                                        <Input
                                            id="closingDate"
                                            type="date"
                                            value={formData.closingDate}
                                            onChange={(e) => handleInputChange('closingDate', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="actualClosingDate">Actual Closing Date</Label>
                                        <Input
                                            id="actualClosingDate"
                                            type="date"
                                            value={formData.actualClosingDate}
                                            onChange={(e) => handleInputChange('actualClosingDate', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Notes</CardTitle>
                                <CardDescription>Add any additional information about the sale</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    placeholder="Enter any additional notes about the sale..."
                                    rows={4}
                                />
                            </CardContent>
                        </Card>

                        {/* Submit */}
                        <div className="flex justify-end gap-4">
                            <Button asChild variant="outline">
                                <Link href="/sales">Cancel</Link>
                            </Button>
                            <Button type="submit">Create Sale</Button>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    )
} 