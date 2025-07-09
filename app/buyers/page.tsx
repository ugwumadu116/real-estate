'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Search,
    Plus,
    Filter,
    User,
    Mail,
    Phone,
    DollarSign,
    MapPin,
    Home,
    Calendar,
    Star,
    Edit
} from 'lucide-react'
import { mockBuyers, mockPropertyListings, mockProperties } from '@/lib/mock-data'
import { BuyerStatus, PropertyType } from '@/lib/types'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ProtectedRoute } from '@/lib/auth-context'

export default function BuyersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<BuyerStatus | 'all'>('all')
    const [budgetFilter, setBudgetFilter] = useState<string>('all')
    const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all')

    // Filter buyers based on search and filters
    const filteredBuyers = mockBuyers.filter(buyer => {
        const matchesSearch = buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            buyer.phone.includes(searchTerm)

        const matchesStatus = statusFilter === 'all' || buyer.status === statusFilter
        const matchesType = typeFilter === 'all' || buyer.preferences.propertyTypes.includes(typeFilter as PropertyType)

        let matchesBudget = true
        if (budgetFilter !== 'all') {
            const [min, max] = budgetFilter.split('-').map(Number)
            if (max) {
                matchesBudget = buyer.budget.max >= min && buyer.budget.min <= max
            } else {
                matchesBudget = buyer.budget.max >= min
            }
        }

        return matchesSearch && matchesStatus && matchesType && matchesBudget
    })

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

    const getProspects = () => filteredBuyers.filter(b => b.status === 'prospect')
    const getInterested = () => filteredBuyers.filter(b => b.status === 'interested')
    const getQualified = () => filteredBuyers.filter(b => b.status === 'qualified')
    const getUnderContract = () => filteredBuyers.filter(b => b.status === 'under_contract')
    const getClosed = () => filteredBuyers.filter(b => b.status === 'closed')

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="container mx-auto p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Buyers</h1>
                            <p className="text-muted-foreground">Manage buyer profiles and track their preferences</p>
                        </div>
                        <Button asChild>
                            <Link href="/buyers/add">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Buyer
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
                                        placeholder="Search buyers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BuyerStatus | 'all')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="prospect">Prospect</SelectItem>
                                        <SelectItem value="interested">Interested</SelectItem>
                                        <SelectItem value="qualified">Qualified</SelectItem>
                                        <SelectItem value="under_contract">Under Contract</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                        <SelectItem value="lost">Lost</SelectItem>
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

                                <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Budget Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Budgets</SelectItem>
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
                                    setBudgetFilter('all')
                                }}>
                                    Clear Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Prospects</p>
                                        <p className="text-2xl font-bold">{getProspects().length}</p>
                                    </div>
                                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-gray-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Interested</p>
                                        <p className="text-2xl font-bold">{getInterested().length}</p>
                                    </div>
                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Star className="h-4 w-4 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Qualified</p>
                                        <p className="text-2xl font-bold">{getQualified().length}</p>
                                    </div>
                                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Under Contract</p>
                                        <p className="text-2xl font-bold">{getUnderContract().length}</p>
                                    </div>
                                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Closed</p>
                                        <p className="text-2xl font-bold">{getClosed().length}</p>
                                    </div>
                                    <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Home className="h-4 w-4 text-emerald-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Buyers */}
                    <Tabs defaultValue="all" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="all">All ({filteredBuyers.length})</TabsTrigger>
                            <TabsTrigger value="prospect">Prospects ({getProspects().length})</TabsTrigger>
                            <TabsTrigger value="interested">Interested ({getInterested().length})</TabsTrigger>
                            <TabsTrigger value="qualified">Qualified ({getQualified().length})</TabsTrigger>
                            <TabsTrigger value="under_contract">Under Contract ({getUnderContract().length})</TabsTrigger>
                            <TabsTrigger value="closed">Closed ({getClosed().length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4">
                            <BuyersGrid buyers={filteredBuyers} />
                        </TabsContent>

                        <TabsContent value="prospect" className="space-y-4">
                            <BuyersGrid buyers={getProspects()} />
                        </TabsContent>

                        <TabsContent value="interested" className="space-y-4">
                            <BuyersGrid buyers={getInterested()} />
                        </TabsContent>

                        <TabsContent value="qualified" className="space-y-4">
                            <BuyersGrid buyers={getQualified()} />
                        </TabsContent>

                        <TabsContent value="under_contract" className="space-y-4">
                            <BuyersGrid buyers={getUnderContract()} />
                        </TabsContent>

                        <TabsContent value="closed" className="space-y-4">
                            <BuyersGrid buyers={getClosed()} />
                        </TabsContent>
                    </Tabs>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    )
}

function BuyersGrid({ buyers }: { buyers: any[] }) {
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

                if (buyers.length === 0) {
        return (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">No buyers found matching your criteria.</p>
                    </CardContent>
                </Card>
                )
    }

                return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buyers.map((buyer) => (
                        <Card key={buyer.id} className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src="/placeholder-user.jpg" />
                                            <AvatarFallback>{buyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{buyer.name}</CardTitle>
                                            <CardDescription className="text-sm">{buyer.email}</CardDescription>
                                        </div>
                                    </div>
                                    <Badge className={getStatusColor(buyer.status)}>
                                        {buyer.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0 space-y-4">
                                {/* Contact Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        {buyer.phone}
                                    </div>
                                </div>

                                {/* Budget */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Budget</h4>
                                    <div className="text-sm text-muted-foreground">
                                        {formatPrice(buyer.budget.min)} - {formatPrice(buyer.budget.max)}
                                    </div>
                                </div>

                                {/* Preferences */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Property Preferences</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {buyer.preferences.propertyTypes.slice(0, 3).map((type: string, index: number) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {type}
                                            </Badge>
                                        ))}
                                        {buyer.preferences.propertyTypes.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{buyer.preferences.propertyTypes.length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Locations */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Preferred Locations</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {buyer.preferences.locations.slice(0, 2).map((location: string, index: number) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {location}
                                            </Badge>
                                        ))}
                                        {buyer.preferences.locations.length > 2 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{buyer.preferences.locations.length - 2} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Financing */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Financing</h4>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={buyer.financing.preApproved ? "default" : "outline"} className="text-xs">
                                            {buyer.financing.preApproved ? 'Pre-Approved' : 'Not Pre-Approved'}
                                        </Badge>
                                        {buyer.financing.lender && (
                                            <span className="text-xs text-muted-foreground">{buyer.financing.lender}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                {buyer.notes && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm">Notes</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {buyer.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button asChild variant="outline" className="flex-1">
                                        <Link href={`/buyers/${buyer.id}`}>
                                            View Profile
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="icon">
                                        <Link href={`/buyers/${buyer.id}/edit`}>
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                )
} 