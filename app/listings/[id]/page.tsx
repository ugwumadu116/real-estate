'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    Eye,
    MessageSquare,
    Calendar,
    MapPin,
    Home,
    DollarSign,
    Star,
    Phone,
    Mail,
    Clock,
    Users,
    FileText,
    Edit,
    Share2
} from 'lucide-react'
import {
    mockPropertyListings,
    mockProperties,
    mockBuyers,
    mockPropertyInquiries,
    mockPropertyShowings,
    mockPropertyOffers,
    getPropertyInquiriesByListingId,
    getPropertyShowingsByListingId,
    getPropertyOffersByListingId
} from '@/lib/mock-data'
import { ListingStatus } from '@/lib/types'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ProtectedRoute } from '@/lib/auth-context'

export default function ListingDetailPage() {
    const params = useParams()
    const listingId = params.id as string
    const [activeImage, setActiveImage] = useState(0)

    const listing = mockPropertyListings.find(l => l.id === listingId)
    const property = listing ? mockProperties.find(p => p.id === listing.propertyId) : null
    const inquiries = getPropertyInquiriesByListingId(listingId)
    const showings = getPropertyShowingsByListingId(listingId)
    const offers = getPropertyOffersByListingId(listingId)

    if (!listing || !property) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="container mx-auto p-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Listing not found</h1>
                            <p className="text-muted-foreground">The listing you're looking for doesn't exist.</p>
                            <Button asChild className="mt-4">
                                <Link href="/listings">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Listings
                                </Link>
                            </Button>
                        </div>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        )
    }

    const getStatusColor = (status: ListingStatus) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'under_contract': return 'bg-blue-100 text-blue-800'
            case 'sold': return 'bg-purple-100 text-purple-800'
            case 'expired': return 'bg-red-100 text-red-800'
            case 'cancelled': return 'bg-gray-100 text-gray-800'
            case 'draft': return 'bg-gray-100 text-gray-800'
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
            month: 'long',
            day: 'numeric'
        }).format(new Date(date))
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="container mx-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button asChild variant="outline" size="icon">
                                <Link href="/listings">
                                    <ArrowLeft className="w-4 h-4" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold">{listing.title}</h1>
                                <p className="text-muted-foreground">
                                    {property.address.street}, {property.address.city}, {property.address.state}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon">
                                <Share2 className="w-4 h-4" />
                            </Button>
                            <Button asChild>
                                <Link href={`/listings/${listing.id}/edit`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Listing
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Images */}
                            <Card>
                                <CardContent className="p-0">
                                    <div className="aspect-video relative">
                                        <img
                                            src={listing.images[activeImage] || '/placeholder.jpg'}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className={getStatusColor(listing.status)}>
                                                {listing.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        {listing.featured && (
                                            <div className="absolute top-4 right-4">
                                                <Badge variant="secondary">Featured</Badge>
                                            </div>
                                        )}
                                    </div>
                                    {listing.images.length > 1 && (
                                        <div className="p-4">
                                            <div className="flex gap-2 overflow-x-auto">
                                                {listing.images.map((image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setActiveImage(index)}
                                                        className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-primary' : 'border-transparent'
                                                            }`}
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={`${listing.title} ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Description */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {listing.description}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Property Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Property Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{property.totalUnits}</div>
                                            <div className="text-sm text-muted-foreground">Units</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{property.yearBuilt}</div>
                                            <div className="text-sm text-muted-foreground">Year Built</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{property.type}</div>
                                            <div className="text-sm text-muted-foreground">Type</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{property.amenities.length}</div>
                                            <div className="text-sm text-muted-foreground">Amenities</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Features & Highlights */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Features</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {listing.features.map((feature, index) => (
                                                <Badge key={index} variant="outline">
                                                    {feature}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Property Highlights</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {listing.propertyHighlights.map((highlight, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {highlight}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Activity Tabs */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="inquiries" className="w-full">
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="inquiries">Inquiries ({inquiries.length})</TabsTrigger>
                                            <TabsTrigger value="showings">Showings ({showings.length})</TabsTrigger>
                                            <TabsTrigger value="offers">Offers ({offers.length})</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="inquiries" className="space-y-4">
                                            {inquiries.length === 0 ? (
                                                <p className="text-muted-foreground text-center py-8">No inquiries yet</p>
                                            ) : (
                                                inquiries.map((inquiry) => {
                                                    const buyer = mockBuyers.find(b => b.id === inquiry.buyerId)
                                                    return (
                                                        <div key={inquiry.id} className="border rounded-lg p-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h4 className="font-semibold">{buyer?.name}</h4>
                                                                    <p className="text-sm text-muted-foreground">{buyer?.email}</p>
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
                                        </TabsContent>

                                        <TabsContent value="showings" className="space-y-4">
                                            {showings.length === 0 ? (
                                                <p className="text-muted-foreground text-center py-8">No showings scheduled</p>
                                            ) : (
                                                showings.map((showing) => {
                                                    const buyer = mockBuyers.find(b => b.id === showing.buyerId)
                                                    return (
                                                        <div key={showing.id} className="border rounded-lg p-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h4 className="font-semibold">{buyer?.name}</h4>
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
                                        </TabsContent>

                                        <TabsContent value="offers" className="space-y-4">
                                            {offers.length === 0 ? (
                                                <p className="text-muted-foreground text-center py-8">No offers received</p>
                                            ) : (
                                                offers.map((offer) => {
                                                    const buyer = mockBuyers.find(b => b.id === offer.buyerId)
                                                    return (
                                                        <div key={offer.id} className="border rounded-lg p-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h4 className="font-semibold">{buyer?.name}</h4>
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
                                                                <div>
                                                                    <span className="text-muted-foreground">Down Payment:</span>
                                                                    <span className="ml-2 font-medium">{formatPrice(offer.financing.downPayment)}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-muted-foreground">Closing Date:</span>
                                                                    <span className="ml-2 font-medium">{formatDate(offer.closingDate)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {formatDate(offer.createdAt)}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Price Card */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-primary mb-2">
                                            {formatPrice(listing.listingPrice)}
                                        </div>
                                        {listing.originalPrice && listing.originalPrice > listing.listingPrice && (
                                            <div className="text-sm text-muted-foreground line-through">
                                                {formatPrice(listing.originalPrice)}
                                            </div>
                                        )}
                                        <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                {listing.views} views
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="w-4 h-4" />
                                                {listing.inquiries} inquiries
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full" variant="outline">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Schedule Showing
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Contact Buyer
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Generate Report
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Showing Instructions */}
                            {listing.showingInstructions && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Showing Instructions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {listing.showingInstructions}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Listing Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Listing Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Listed:</span>
                                        <span>{formatDate(listing.listingDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Agent:</span>
                                        <span>Sarah Johnson</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge className={getStatusColor(listing.status)}>
                                            {listing.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    {listing.expiryDate && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Expires:</span>
                                            <span>{formatDate(listing.expiryDate)}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    )
} 