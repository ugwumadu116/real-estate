"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, MapPin, Building, Users, Home, Phone, Mail, Heart, Edit } from "lucide-react"
import Link from "next/link"
import { mockProperties, mockUsers } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function PropertyDetailsPage() {
  const params = useParams()
  const propertyId = params.id as string
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  const property = mockProperties.find((p) => p.id === propertyId)
  const propertyManager = property ? mockUsers.find(u => u.id === property.propertyManagerId) : null

  if (!property) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground">The property you're looking for doesn't exist.</p>
        </div>
      </DashboardLayout>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Carousel */}
          <div className="relative mb-6">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={property.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${property.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Property Info */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">{property.name}</h1>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Badge className="capitalize">{property.type}</Badge>
                  <Badge variant={property.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                    {property.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary mb-2">
                  {Math.round((property.occupiedUnits / property.totalUnits) * 100)}% Occupancy
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={isFavorited ? "text-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                  {isFavorited ? "Favorited" : "Add to Favorites"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Building className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{property.totalUnits}</div>
                <div className="text-sm text-muted-foreground">Total Units</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{property.occupiedUnits}</div>
                <div className="text-sm text-muted-foreground">Occupied</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{property.totalUnits - property.occupiedUnits}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mb-6">
              <Button asChild>
                <Link href={`/properties/${property.id}/units`}>
                  <Building className="h-4 w-4 mr-2" />
                  Manage Units
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/properties/${property.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Property
                </Link>
              </Button>
            </div>
          </div>

          {/* Description */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Interactive Map</p>
                  <p className="text-sm text-muted-foreground">
                    Lat: {property.coordinates.lat}, Lng: {property.coordinates.lng}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Property Manager</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {propertyManager ? (
                <>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary-foreground font-semibold text-lg">
                        {propertyManager.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <h3 className="font-semibold">{propertyManager.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{propertyManager.role.replace('_', ' ')}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{propertyManager.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{propertyManager.email}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Button className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Manager
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center">No property manager assigned</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
