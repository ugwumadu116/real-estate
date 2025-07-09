'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    DollarSign,
    MapPin,
    Home,
    Calendar,
    Star,
    Eye,
    MessageSquare,
    FileText,
    Edit,
    Share2,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { mockBuyers, mockPropertyListings, mockProperties, mockPropertyInquiries, mockPropertyShowings, mockPropertyOffers } from '@/lib/mock-data'
import { BuyerStatus } from '@/lib/types'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ProtectedRoute } from '@/lib/auth-context'

export default function BuyerDetailPage() {
    const params = useParams()
    const buyerId = params.id as string

    const buyer = mockBuyers.find(b => b.id === buyerId)
    const buyerInquiries = mockPropertyInquiries.filter(i => i.buyerId === buyerId)
    const buyerShowings = mockPropertyShowings.filter(s => s.buyerId === buyerId)
    const buyerOffers = mockPropertyOffers.filter(o => o.buyerId === buyerId)

    const getStatusColor = (status: BuyerStatus) => {
        switch (status) {
            case 'prospect': return 'bg-gray-100 text-gray-800'
            case 'interested': return 'bg-blue-100 text-blue-800'
            case 'qualified': return 'bg-green-100 text-green-800'
            case 'under_contract': return 'bg-purple-100 text-purple-800'
            case 'closed': return 'bg-emerald-100 text-emerald-800'
            case 'lost': return 'bg-red-100 text-red-800'
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

    if (!buyer) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="container mx-auto p-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Buyer not found</h1>
                            <p className="text-muted-foreground">The buyer you're looking for doesn't exist.</p>
                            <Button asChild className="mt-4">
                                <Link href="/buyers">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Buyers
                                </Link>
                            </Button>
                        </div>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="container mx-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button asChild variant="outline" size="icon">
                                <Link href="/buyers">
                                    <ArrowLeft className="w-4 h-4" />
                                </Link>
                            </Button>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src="/placeholder-user.jpg" />
                                    <AvatarFallback className="text-lg">
                                        {buyer.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-3xl font-bold">{buyer.name}</h1>
                                    <p className="text-muted-foreground">{buyer.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="outline">
                                <Link href={`/buyers/${buyer.id}/edit`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
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
                            {/* Status and Quick Info */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Badge className={getStatusColor(buyer.status)}>
                                            {buyer.status.replace('_', ' ')}
                                        </Badge>
                                        <div className="text-sm text-muted-foreground">
                                            Added {formatDate(buyer.createdAt)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{buyerInquiries.length}</div>
                                            <div className="text-sm text-muted-foreground">Inquiries</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">{buyerShowings.length}</div>
                                            <div className="text-sm text-muted-foreground">Showings</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">{buyerOffers.length}</div>
                                            <div className="text-sm text-muted-foreground">Offers</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {buyerOffers.filter(o => o.status === 'accepted').length}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Accepted</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tabs */}
                            <Tabs defaultValue="overview" className="space-y-4">
                                <TabsList>
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="activity">Activity</TabsTrigger>
                                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                                    <TabsTrigger value="financing">Financing</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-4">
                                    {/* Contact Information */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="w-5 h-5" />
                                                Contact Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">Email</div>
                                                        <div className="text-sm text-muted-foreground">{buyer.email}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">Phone</div>
                                                        <div className="text-sm text-muted-foreground">{buyer.phone}</div>
                                                    </div>
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
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-primary">
                                                {formatPrice(buyer.budget.min)} - {formatPrice(buyer.budget.max)}
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
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Timeframe</div>
                                                    <div className="font-medium">3-6 months</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Urgency</div>
                                                    <div className="font-medium">Medium</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="activity" className="space-y-4">
                                    {/* Recent Inquiries */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <MessageSquare className="w-5 h-5" />
                                                Recent Inquiries
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {buyerInquiries.length === 0 ? (
                                                <p className="text-muted-foreground text-center py-4">No inquiries yet</p>
                                            ) : (
                                                buyerInquiries.slice(0, 5).map((inquiry) => {
                                                    const listing = mockPropertyListings.find(l => l.id === inquiry.listingId)
                                                    return (
                                                        <div key={inquiry.id} className="border rounded-lg p-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h4 className="font-semibold">{listing?.title}</h4>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {listing?.title}
                                                                    </p>
                                                                </div>
                                                                <Badge variant="outline">{inquiry.status}</Badge>
                                                            </div>
                                                            <p className="text-sm mb-2">{inquiry.message}</p>
                                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                                <span>Contact: {inquiry.preferredContactMethod}</span>
                                                                <span>Time: {inquiry.preferredTime}</span>
                                                                <span>{formatDate(inquiry.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Recent Showings */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Eye className="w-5 h-5" />
                                                Recent Showings
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {buyerShowings.length === 0 ? (
                                                <p className="text-muted-foreground text-center py-4">No showings scheduled</p>
                                            ) : (
                                                buyerShowings.slice(0, 5).map((showing) => {
                                                    const listing = mockPropertyListings.find(l => l.id === showing.listingId)
                                                    return (
                                                        <div key={showing.id} className="border rounded-lg p-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h4 className="font-semibold">{listing?.title}</h4>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {formatDate(showing.scheduledDate)} • {showing.duration} min
                                                                    </p>
                                                                </div>
                                                                <Badge variant="outline">{showing.status}</Badge>
                                                            </div>
                                                            {showing.feedback && (
                                                                <div className="mt-2 p-3 bg-muted rounded-md">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                        <span className="text-sm font-medium">{showing.feedback.rating}/5</span>
                                                                    </div>
                                                                    <p className="text-sm">{showing.feedback.comments}</p>
                                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                                        <span>Interested: {showing.feedback.interested ? 'Yes' : 'No'}</span>
                                                                        <span>Offer Likelihood: {showing.feedback.offerLikelihood}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Recent Offers */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                Recent Offers
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {buyerOffers.length === 0 ? (
                                                <p className="text-muted-foreground text-center py-4">No offers made</p>
                                            ) : (
                                                buyerOffers.slice(0, 5).map((offer) => {
                                                    const listing = mockPropertyListings.find(l => l.id === offer.listingId)
                                                    return (
                                                        <div key={offer.id} className="border rounded-lg p-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h4 className="font-semibold">{listing?.title}</h4>
                                                                    <p className="text-lg font-bold text-primary">
                                                                        {formatPrice(offer.amount)}
                                                                    </p>
                                                                </div>
                                                                <Badge variant="outline">{offer.status}</Badge>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                                                                <div>
                                                                    <span className="text-muted-foreground">Earnest Money:</span>
                                                                    <span className="ml-2 font-medium">{formatPrice(offer.earnestMoney)}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-muted-foreground">Financing:</span>
                                                                    <span className="ml-2 font-medium">{offer.financing.type}</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {formatDate(offer.createdAt)}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="preferences" className="space-y-4">
                                    {/* Property Types */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Property Types</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {buyer.preferences.propertyTypes.map((type) => (
                                                    <Badge key={type} variant="outline">
                                                        {type}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Locations */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Preferred Locations</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {buyer.preferences.locations.map((location) => (
                                                    <Badge key={location} variant="secondary">
                                                        {location}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Bedrooms and Bathrooms */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Size Requirements</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Bedrooms</div>
                                                    <div className="font-medium">
                                                        {buyer.preferences.bedrooms || 'Any'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Bathrooms</div>
                                                    <div className="font-medium">
                                                        {buyer.preferences.bathrooms || 'Any'}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Features */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Desired Features</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="outline">Move-in Ready</Badge>
                                                <Badge variant="outline">Good Schools</Badge>
                                                <Badge variant="outline">Parking</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="financing" className="space-y-4">
                                    {/* Pre-approval Status */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Pre-approval Status</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-2">
                                                {buyer.financing.preApproved ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                                                )}
                                                <span className="font-medium">
                                                    {buyer.financing.preApproved ? 'Pre-approved' : 'Not pre-approved'}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Lender Information */}
                                    {buyer.financing.lender && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Lender Information</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    <div>
                                                        <div className="text-sm font-medium text-muted-foreground">Lender</div>
                                                        <div className="font-medium">{buyer.financing.lender}</div>
                                                    </div>
                                                    {buyer.financing.preApprovalAmount && (
                                                        <div>
                                                            <div className="text-sm font-medium text-muted-foreground">Pre-approval Amount</div>
                                                            <div className="font-medium">{formatPrice(buyer.financing.preApprovalAmount)}</div>
                                                        </div>
                                                    )}
                                                    {buyer.financing.downPayment && (
                                                        <div>
                                                            <div className="text-sm font-medium text-muted-foreground">Down Payment</div>
                                                            <div className="font-medium">{formatPrice(buyer.financing.downPayment)}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
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
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Send Message
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Schedule Showing
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Generate Report
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Notes */}
                            {buyer.notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {buyer.notes}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Buyer Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Buyer Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge className={getStatusColor(buyer.status)}>
                                            {buyer.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created:</span>
                                        <span>{formatDate(buyer.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Contact:</span>
                                        <span>{formatDate(buyer.updatedAt)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    )
} 