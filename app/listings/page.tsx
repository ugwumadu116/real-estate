'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Plus, Filter, Eye, MessageSquare, Calendar } from 'lucide-react'
import { mockPropertyListings, mockProperties, mockBuyers } from '@/lib/mock-data'
import { ListingStatus, PropertyType } from '@/lib/types'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ProtectedRoute } from '@/lib/auth-context'

export default function ListingsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<ListingStatus | 'all'>('all')
    const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all')
    const [priceRange, setPriceRange] = useState<string>('all')

    // Get property details for each listing
    const listingsWithDetails = mockPropertyListings.map(listing => {
        const property = mockProperties.find(p => p.id === listing.propertyId)
        return {
            ...listing,
            property
        }
    })

    // Filter listings based on search and filters
    const filteredListings = listingsWithDetails.filter(listing => {
        const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.property?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.property?.address.city.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
        const matchesType = typeFilter === 'all' || listing.property?.type === typeFilter

        let matchesPrice = true
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number)
            if (max) {
                matchesPrice = listing.listingPrice >= min && listing.listingPrice <= max
            } else {
                matchesPrice = listing.listingPrice >= min
            }
        }

        return matchesSearch && matchesStatus && matchesType && matchesPrice
    })

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

    const getActiveListings = () => filteredListings.filter(l => l.status === 'active')
    const getPendingListings = () => filteredListings.filter(l => l.status === 'pending')
    const getUnderContractListings = () => filteredListings.filter(l => l.status === 'under_contract')
    const getSoldListings = () => filteredListings.filter(l => l.status === 'sold')

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="container mx-auto p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Property Listings</h1>
                            <p className="text-muted-foreground">Manage your property listings and track buyer interest</p>
                        </div>
                        <Button asChild>
                            <Link href="/listings/create">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Listing
                            </Link>
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search listings..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ListingStatus | 'all')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="under_contract">Under Contract</SelectItem>
                                        <SelectItem value="sold">Sold</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as PropertyType | 'all')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Property Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="house">House</SelectItem>
                                        <SelectItem value="condo">Condo</SelectItem>
                                        <SelectItem value="apartment">Apartment</SelectItem>
                                        <SelectItem value="townhouse">Townhouse</SelectItem>
                                        <SelectItem value="commercial">Commercial</SelectItem>
                                        <SelectItem value="apartment_block">Multi-Unit</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={priceRange} onValueChange={setPriceRange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Price Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Prices</SelectItem>
                                        <SelectItem value="0-500000">Under $500K</SelectItem>
                                        <SelectItem value="500000-750000">$500K - $750K</SelectItem>
                                        <SelectItem value="750000-1000000">$750K - $1M</SelectItem>
                                        <SelectItem value="1000000-">$1M+</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button variant="outline" onClick={() => {
                                    setSearchTerm('')
                                    setStatusFilter('all')
                                    setTypeFilter('all')
                                    setPriceRange('all')
                                }}>
                                    Clear Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                                        <p className="text-2xl font-bold">{getActiveListings().length}</p>
                                    </div>
                                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Eye className="h-4 w-4 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Under Contract</p>
                                        <p className="text-2xl font-bold">{getUnderContractListings().length}</p>
                                    </div>
                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                                        <p className="text-2xl font-bold">
                                            {filteredListings.reduce((sum, listing) => sum + listing.views, 0)}
                                        </p>
                                    </div>
                                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Eye className="h-4 w-4 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total Inquiries</p>
                                        <p className="text-2xl font-bold">
                                            {filteredListings.reduce((sum, listing) => sum + listing.inquiries, 0)}
                                        </p>
                                    </div>
                                    <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                                        <MessageSquare className="h-4 w-4 text-orange-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Listings */}
                    <Tabs defaultValue="all" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="all">All ({filteredListings.length})</TabsTrigger>
                            <TabsTrigger value="active">Active ({getActiveListings().length})</TabsTrigger>
                            <TabsTrigger value="pending">Pending ({getPendingListings().length})</TabsTrigger>
                            <TabsTrigger value="under_contract">Under Contract ({getUnderContractListings().length})</TabsTrigger>
                            <TabsTrigger value="sold">Sold ({getSoldListings().length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4">
                            <ListingsGrid listings={filteredListings} />
                        </TabsContent>

                        <TabsContent value="active" className="space-y-4">
                            <ListingsGrid listings={getActiveListings()} />
                        </TabsContent>

                        <TabsContent value="pending" className="space-y-4">
                            <ListingsGrid listings={getPendingListings()} />
                        </TabsContent>

                        <TabsContent value="under_contract" className="space-y-4">
                            <ListingsGrid listings={getUnderContractListings()} />
                        </TabsContent>

                        <TabsContent value="sold" className="space-y-4">
                            <ListingsGrid listings={getSoldListings()} />
                        </TabsContent>
                    </Tabs>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    )
}

function ListingsGrid({ listings }: { listings: any[] }) {
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

    if (listings.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No listings found matching your criteria.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                        <img
                            src={listing.images[0] || '/placeholder.jpg'}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                            <Badge className={getStatusColor(listing.status)}>
                                {listing.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        {listing.featured && (
                            <div className="absolute top-2 right-2">
                                <Badge variant="secondary">Featured</Badge>
                            </div>
                        )}
                    </div>

                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg">{listing.title}</CardTitle>
                                <CardDescription className="text-sm">
                                    {listing.property?.address.street}, {listing.property?.address.city}
                                </CardDescription>
                            </div>
                            <p className="text-lg font-bold text-primary">
                                {formatPrice(listing.listingPrice)}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {listing.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-4">
                            {listing.features.slice(0, 3).map((feature: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                </Badge>
                            ))}
                            {listing.features.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{listing.features.length - 3} more
                                </Badge>
                            )}
                        </div>

                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {listing.views} views
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {listing.inquiries} inquiries
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button asChild variant="outline" className="flex-1">
                                <Link href={`/listings/${listing.id}`}>
                                    View Details
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="icon">
                                <Link href={`/listings/${listing.id}/edit`}>
                                    <Eye className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
} 