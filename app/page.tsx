import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Building, Users, Home } from "lucide-react"
import { mockProperties } from "@/lib/mock-data"
import { MainLayout } from "@/components/main-layout"

export default function HomePage() {
  const featuredProperties = mockProperties.slice(0, 3)

  return (
    <MainLayout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">PropEase Property Management</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Streamline your property management with our comprehensive platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/dashboard">
                  <Search className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/properties">View Properties</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">{mockProperties.length}</h3>
                <p className="text-muted-foreground">Properties Managed</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">
                  {mockProperties.reduce((total, prop) => total + prop.totalUnits, 0)}
                </h3>
                <p className="text-muted-foreground">Total Units</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">
                  {mockProperties.reduce((total, prop) => total + prop.occupiedUnits, 0)}
                </h3>
                <p className="text-muted-foreground">Occupied Units</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our managed properties with comprehensive unit information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.name}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary capitalize">{property.type}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {property.address.street}, {property.address.city}, {property.address.state}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{property.description}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        <span>{property.totalUnits} units</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{property.occupiedUnits} occupied</span>
                      </div>
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        <span>{Math.round((property.occupiedUnits / property.totalUnits) * 100)}% occupancy</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={property.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                        {property.status}
                      </Badge>
                      <Button asChild size="sm">
                        <Link href={`/property/${property.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg">
                <Link href="/properties">View All Properties</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Property Management?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join property managers who trust PropEase for comprehensive property management solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
