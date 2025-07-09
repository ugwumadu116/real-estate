'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
    ArrowLeft,
    Home,
    User,
    DollarSign,
    Calendar,
    FileText,
    Edit,
    Share2,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    MapPin,
    Phone,
    Mail
} from 'lucide-react'
import { mockPropertySales, mockProperties, mockBuyers, mockPropertyListings } from '@/lib/mock-data'
import { SaleStatus } from '@/lib/types'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ProtectedRoute } from '@/lib/auth-context'

export default function SaleDetailPage() {
    const params = useParams()
    const saleId = params.id as string

    const sale = mockPropertySales.find(s => s.id === saleId)
    const property = sale ? mockProperties.find(p => p.id === sale.propertyId) : null
    const buyer = sale ? mockBuyers.find(b => b.id === sale.buyerId) : null
    const listing = sale ? mockPropertyListings.find(l => l.id === sale.listingId) : null

    const getStatusColor = (status: SaleStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'under_contract': return 'bg-blue-100 text-blue-800'
            case 'closing': return 'bg-purple-100 text-purple-800'
            case 'completed': return 'bg-green-100 text-green-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date))
    }

    const getTimelineProgress = (timeline: any[]) => {
        const completed = timeline.filter(item => item.status === 'completed').length
        return (completed / timeline.length) * 100
    }

    const getDaysToClose = () => {
        if (!sale?.closingDate) return null
        const closingDate = new Date(sale.closingDate)
        const today = new Date()
        const diffTime = closingDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    if (!sale || !property || !buyer) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="container mx-auto p-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Sale not found</h1>
                            <p className="text-muted-foreground">The sale you're looking for doesn't exist.</p>
                            <Button asChild className="mt-4">
                                <Link href="/sales">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Sales
                                </Link>
                            </Button>
                        </div>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        )
    }

    const daysToClose = getDaysToClose()

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="container mx-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button asChild variant="outline" size="icon">
                                <Link href="/sales">
                                    <ArrowLeft className="w-4 h-4" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold">Sale Details</h1>
                                <p className="text-muted-foreground">
                                    {property.name} - {buyer.name}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="outline">
                                <Link href={`/sales/${sale.id}/edit`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Sale
                                </Link>
                            </Button>
                            <Button variant="outline" size="icon">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Status and Progress */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Badge className={getStatusColor(sale.status)}>
                                            {sale.status.replace('_', ' ')}
                                        </Badge>
                                        {daysToClose !== null && (
                                            <div className="text-sm text-muted-foreground">
                                                {daysToClose > 0 ? `${daysToClose} days to close` : 'Closing overdue'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Closing Progress</span>
                                            <span className="text-sm text-muted-foreground">
                                                {sale.timeline.filter((item: any) => item.status === 'completed').length}/{sale.timeline.length} completed
                                            </span>
                                        </div>
                                        <Progress value={getTimelineProgress(sale.timeline)} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tabs */}
                            <Tabs defaultValue="overview" className="space-y-4">
                                <TabsList>
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                                    <TabsTrigger value="financials">Financials</TabsTrigger>
                                    <TabsTrigger value="documents">Documents</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-4">
                                    {/* Property Information */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Home className="w-5 h-5" />
                                                Property Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Property Name</div>
                                                    <div className="font-medium">{property.name}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Property Type</div>
                                                    <div className="font-medium">{property.type}</div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <div className="text-sm font-medium text-muted-foreground">Address</div>
                                                    <div className="font-medium">
                                                        {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Buyer Information */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="w-5 h-5" />
                                                Buyer Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Buyer Name</div>
                                                    <div className="font-medium">{buyer.name}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Buyer Status</div>
                                                    <div className="font-medium">{buyer.status}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                                                    <div className="font-medium">{buyer.email}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Phone</div>
                                                    <div className="font-medium">{buyer.phone}</div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <div className="text-sm font-medium text-muted-foreground">Budget Range</div>
                                                    <div className="font-medium">
                                                        {formatPrice(buyer.budget.min)} - {formatPrice(buyer.budget.max)}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Sale Details */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <DollarSign className="w-5 h-5" />
                                                Sale Details
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Offer Price</div>
                                                    <div className="font-medium">{formatPrice(sale.offerPrice)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Accepted Price</div>
                                                    <div className="font-medium text-primary">{formatPrice(sale.acceptedPrice)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Earnest Money</div>
                                                    <div className="font-medium">{formatPrice(sale.earnestMoney)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Expected Closing</div>
                                                    <div className="font-medium">{formatDate(sale.closingDate)}</div>
                                                </div>
                                                {sale.actualClosingDate && (
                                                    <div>
                                                        <div className="text-sm font-medium text-muted-foreground">Actual Closing</div>
                                                        <div className="font-medium">{formatDate(sale.actualClosingDate)}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="timeline" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Sale Timeline</CardTitle>
                                            <CardDescription>Track the progress of the sale through key milestones</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {sale.timeline.map((item: any, index: number) => (
                                                <div key={index} className="flex items-center gap-4">
                                                    <div className="flex items-center gap-3">
                                                        {item.status === 'completed' ? (
                                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                                        ) : item.status === 'pending' ? (
                                                            <Clock className="w-5 h-5 text-blue-600" />
                                                        ) : (
                                                            <AlertCircle className="w-5 h-5 text-gray-400" />
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="font-medium">{item.title}</div>
                                                            {item.date && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    {formatDate(new Date(item.date))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Badge variant={item.status === 'completed' ? 'default' : 'outline'}>
                                                        {item.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="financials" className="space-y-4">
                                    {/* Commission Breakdown */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Commission Breakdown</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="text-center p-4 bg-muted rounded-lg">
                                                    <div className="text-2xl font-bold text-primary">
                                                        {formatPrice(sale.commission.totalCommission)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Total Commission</div>
                                                </div>
                                                <div className="text-center p-4 bg-muted rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {formatPrice(sale.commission.agentCommission)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Agent Commission</div>
                                                </div>
                                                <div className="text-center p-4 bg-muted rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {formatPrice(sale.commission.brokerCommission)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Broker Commission</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Financing Details */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Financing Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Financing Type</div>
                                                    <div className="font-medium">{sale.financing.type}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Lender</div>
                                                    <div className="font-medium">{sale.financing.lender || 'Not specified'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Down Payment</div>
                                                    <div className="font-medium">{formatPrice(sale.financing.downPayment)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Loan Amount</div>
                                                    <div className="font-medium">{formatPrice(sale.financing.loanAmount)}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {sale.financing.preApproved ? (
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                                                )}
                                                <span className="text-sm">
                                                    {sale.financing.preApproved ? 'Pre-approved for financing' : 'Not pre-approved'}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="documents" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Sale Documents</CardTitle>
                                            <CardDescription>Manage documents related to this sale</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center py-8">
                                                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                <p className="text-muted-foreground">No documents uploaded yet</p>
                                                <Button className="mt-4" variant="outline">
                                                    Upload Document
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full" variant="outline">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Schedule Closing
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Generate Contract
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share Details
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Sale Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sale Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Sale ID:</span>
                                        <span className="font-mono">{sale.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge className={getStatusColor(sale.status)}>
                                            {sale.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created:</span>
                                        <span>{formatDate(sale.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Updated:</span>
                                        <span>{formatDate(sale.updatedAt)}</span>
                                    </div>
                                    {listing && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Listing:</span>
                                            <span>{listing.title}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{buyer.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{buyer.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{buyer.phone}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notes */}
                            {sale.notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {sale.notes}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    )
} 