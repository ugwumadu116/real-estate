'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
    Search,
    Plus,
    Filter,
    DollarSign,
    Calendar,
    User,
    Home,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Edit
} from 'lucide-react'
import { mockPropertySales, mockProperties, mockBuyers, mockPropertyListings } from '@/lib/mock-data'
import { SaleStatus } from '@/lib/types'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ProtectedRoute } from '@/lib/auth-context'

export default function SalesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<SaleStatus | 'all'>('all')
    const [priceRange, setPriceRange] = useState<string>('all')

    // Get property and buyer details for each sale
    const salesWithDetails = mockPropertySales.map(sale => {
        const property = mockProperties.find(p => p.id === sale.propertyId)
        const buyer = mockBuyers.find(b => b.id === sale.buyerId)
        const listing = mockPropertyListings.find(l => l.id === sale.listingId)
        return {
            ...sale,
            property,
            buyer,
            listing
        }
    })

    // Filter sales based on search and filters
    const filteredSales = salesWithDetails.filter(sale => {
        const matchesSearch = sale.property?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.buyer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.property?.address.city.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || sale.status === statusFilter

        let matchesPrice = true
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number)
            if (max) {
                matchesPrice = sale.acceptedPrice >= min && sale.acceptedPrice <= max
            } else {
                matchesPrice = sale.acceptedPrice >= min
            }
        }

        return matchesSearch && matchesStatus && matchesPrice
    })

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

    const getPendingSales = () => filteredSales.filter(s => s.status === 'pending')
    const getUnderContractSales = () => filteredSales.filter(s => s.status === 'under_contract')
    const getClosingSales = () => filteredSales.filter(s => s.status === 'closing')
    const getCompletedSales = () => filteredSales.filter(s => s.status === 'completed')

    const totalSalesValue = filteredSales.reduce((sum, sale) => sum + sale.acceptedPrice, 0)
    const totalCommission = filteredSales.reduce((sum, sale) => sum + sale.commission.totalCommission, 0)
    const averageDaysToClose = 45 // Mock calculation

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="container mx-auto p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Property Sales</h1>
                            <p className="text-muted-foreground">Track property sales and manage closing processes</p>
                        </div>
                        <Button asChild>
                            <Link href="/sales/create">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Sale
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search sales..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SaleStatus | 'all')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="under_contract">Under Contract</SelectItem>
                                        <SelectItem value="closing">Closing</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
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
                                        <p className="text-sm font-medium text-muted-foreground">Total Sales Value</p>
                                        <p className="text-2xl font-bold">{formatPrice(totalSalesValue)}</p>
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
                                        <p className="text-sm font-medium text-muted-foreground">Total Commission</p>
                                        <p className="text-2xl font-bold">{formatPrice(totalCommission)}</p>
                                    </div>
                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <TrendingUp className="h-4 w-4 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Active Sales</p>
                                        <p className="text-2xl font-bold">
                                            {getPendingSales().length + getUnderContractSales().length + getClosingSales().length}
                                        </p>
                                    </div>
                                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Clock className="h-4 w-4 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Avg Days to Close</p>
                                        <p className="text-2xl font-bold">{averageDaysToClose}</p>
                                    </div>
                                    <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-orange-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sales */}
                    <Tabs defaultValue="all" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="all">All ({filteredSales.length})</TabsTrigger>
                            <TabsTrigger value="pending">Pending ({getPendingSales().length})</TabsTrigger>
                            <TabsTrigger value="under_contract">Under Contract ({getUnderContractSales().length})</TabsTrigger>
                            <TabsTrigger value="closing">Closing ({getClosingSales().length})</TabsTrigger>
                            <TabsTrigger value="completed">Completed ({getCompletedSales().length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4">
                            <SalesGrid sales={filteredSales} />
                        </TabsContent>

                        <TabsContent value="pending" className="space-y-4">
                            <SalesGrid sales={getPendingSales()} />
                        </TabsContent>

                        <TabsContent value="under_contract" className="space-y-4">
                            <SalesGrid sales={getUnderContractSales()} />
                        </TabsContent>

                        <TabsContent value="closing" className="space-y-4">
                            <SalesGrid sales={getClosingSales()} />
                        </TabsContent>

                        <TabsContent value="completed" className="space-y-4">
                            <SalesGrid sales={getCompletedSales()} />
                        </TabsContent>
                    </Tabs>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    )
}

function SalesGrid({ sales }: { sales: any[] }) {
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

    if (sales.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No sales found matching your criteria.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sales.map((sale) => (
                <Card key={sale.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg">{sale.property?.name}</CardTitle>
                                <CardDescription className="text-sm">
                                    {sale.property?.address.street}, {sale.property?.address.city}
                                </CardDescription>
                            </div>
                            <Badge className={getStatusColor(sale.status)}>
                                {sale.status.replace('_', ' ')}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                        {/* Buyer Info */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Buyer</h4>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{sale.buyer?.name}</span>
                            </div>
                        </div>

                        {/* Price Info */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Sale Details</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Offer Price:</span>
                                    <div className="font-medium">{formatPrice(sale.offerPrice)}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Accepted Price:</span>
                                    <div className="font-medium text-primary">{formatPrice(sale.acceptedPrice)}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Earnest Money:</span>
                                    <div className="font-medium">{formatPrice(sale.earnestMoney)}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Commission:</span>
                                    <div className="font-medium">{formatPrice(sale.commission.totalCommission)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium text-sm">Closing Progress</h4>
                                <span className="text-xs text-muted-foreground">
                                    {sale.timeline.filter((item: any) => item.status === 'completed').length}/{sale.timeline.length} completed
                                </span>
                            </div>
                            <Progress value={getTimelineProgress(sale.timeline)} className="h-2" />
                        </div>

                        {/* Key Dates */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Key Dates</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Closing Date:</span>
                                    <span>{formatDate(sale.closingDate)}</span>
                                </div>
                                {sale.actualClosingDate && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Actual Closing:</span>
                                        <span>{formatDate(sale.actualClosingDate)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                            <Button asChild variant="outline" className="flex-1">
                                <Link href={`/sales/${sale.id}`}>
                                    View Details
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="icon">
                                <Link href={`/sales/${sale.id}/edit`}>
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