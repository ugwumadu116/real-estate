"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Square, Phone, Mail, Heart } from "lucide-react"
import { mockProperties } from "@/lib/mock-data"

export default function PropertyDetailsPage() {
  const params = useParams()
  const propertyId = params.id as string
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  const property = mockProperties.find((p) => p.id === propertyId)

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Carousel */}
          <div className="relative mb-6">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={property.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
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
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.location}</span>
                </div>
                <Badge className="capitalize">{property.type}</Badge>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary mb-2">${property.price.toLocaleString()}</div>
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
                <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{property.bedrooms}</div>
                <div className="text-sm text-muted-foreground">Bedrooms</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{property.bathrooms}</div>
                <div className="text-sm text-muted-foreground">Bathrooms</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{property.area}</div>
                <div className="text-sm text-muted-foreground">Sq Ft</div>
              </div>
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
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span className="text-sm">{feature}</span>
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
              <CardTitle>Contact Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-foreground font-semibold text-lg">
                    {property.agent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="font-semibold">{property.agent.name}</h3>
                <p className="text-sm text-muted-foreground">Real Estate Agent</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  {property.agent.phone}
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Agent
                </Button>
              </div>

              <Separator />

              <div className="text-center text-sm text-muted-foreground">
                <p>Available for viewing</p>
                <p className="font-semibold">Mon - Fri: 9AM - 6PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
