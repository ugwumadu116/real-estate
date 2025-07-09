export interface Property {
  id: string
  title: string
  price: number
  location: string
  description: string
  shortDescription: string
  images: string[]
  bedrooms: number
  bathrooms: number
  area: number
  type: "house" | "apartment" | "condo" | "townhouse"
  features: string[]
  coordinates: {
    lat: number
    lng: number
  }
  agent: {
    name: string
    phone: string
    email: string
  }
}

export const mockProperties: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    price: 450000,
    location: "Downtown, New York",
    description:
      "Beautiful modern apartment in the heart of downtown with stunning city views. This spacious unit features high-end finishes, floor-to-ceiling windows, and access to premium building amenities including a rooftop terrace, fitness center, and concierge service.",
    shortDescription: "Modern apartment with city views and premium amenities",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    ],
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: "apartment",
    features: ["City Views", "Rooftop Terrace", "Fitness Center", "Concierge", "In-unit Laundry"],
    coordinates: { lat: 40.7128, lng: -74.006 },
    agent: {
      name: "Sarah Johnson",
      phone: "(555) 123-4567",
      email: "sarah@realestatepro.com",
    },
  },
  {
    id: "2",
    title: "Suburban Family Home",
    price: 650000,
    location: "Westfield, NJ",
    description:
      "Charming colonial home perfect for families. Features a large backyard, updated kitchen, and quiet neighborhood setting. The home boasts original hardwood floors, a cozy fireplace, and a finished basement perfect for entertaining.",
    shortDescription: "Spacious family home with large backyard in quiet neighborhood",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    ],
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    type: "house",
    features: ["Large Backyard", "Updated Kitchen", "Hardwood Floors", "Fireplace", "Finished Basement"],
    coordinates: { lat: 40.6589, lng: -74.3473 },
    agent: {
      name: "Mike Chen",
      phone: "(555) 987-6543",
      email: "mike@realestatepro.com",
    },
  },
  {
    id: "3",
    title: "Luxury Waterfront Condo",
    price: 850000,
    location: "Miami Beach, FL",
    description:
      "Stunning waterfront condominium with panoramic ocean views. This luxury unit features marble countertops, stainless steel appliances, and a private balcony overlooking the water. Building amenities include a pool, spa, and private beach access.",
    shortDescription: "Luxury condo with ocean views and private beach access",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    type: "condo",
    features: ["Ocean Views", "Private Balcony", "Pool", "Spa", "Beach Access", "Marble Countertops"],
    coordinates: { lat: 25.7617, lng: -80.1918 },
    agent: {
      name: "Elena Rodriguez",
      phone: "(555) 456-7890",
      email: "elena@realestatepro.com",
    },
  },
  {
    id: "4",
    title: "Cozy Studio Apartment",
    price: 280000,
    location: "Brooklyn, NY",
    description:
      "Perfect starter home or investment property. This well-designed studio maximizes space with clever storage solutions and modern fixtures. Located in a vibrant neighborhood with easy access to public transportation.",
    shortDescription: "Well-designed studio in vibrant Brooklyn neighborhood",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&h=400&fit=crop",
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    type: "apartment",
    features: ["Modern Fixtures", "Storage Solutions", "Public Transportation", "Vibrant Neighborhood"],
    coordinates: { lat: 40.6782, lng: -73.9442 },
    agent: {
      name: "David Kim",
      phone: "(555) 234-5678",
      email: "david@realestatepro.com",
    },
  },
  {
    id: "5",
    title: "Historic Townhouse",
    price: 750000,
    location: "Georgetown, DC",
    description:
      "Beautiful historic townhouse with original architectural details preserved. Features include exposed brick walls, original hardwood floors, and a private garden. Recently updated with modern amenities while maintaining historic charm.",
    shortDescription: "Historic townhouse with original details and modern updates",
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: 2000,
    type: "townhouse",
    features: ["Historic Details", "Exposed Brick", "Private Garden", "Original Hardwood", "Modern Updates"],
    coordinates: { lat: 38.9072, lng: -77.0369 },
    agent: {
      name: "Jennifer Walsh",
      phone: "(555) 345-6789",
      email: "jennifer@realestatepro.com",
    },
  },
  {
    id: "6",
    title: "Mountain View Retreat",
    price: 520000,
    location: "Aspen, CO",
    description:
      "Stunning mountain retreat with breathtaking views. This cabin-style home features vaulted ceilings, a stone fireplace, and large windows showcasing the natural beauty. Perfect for year-round living or as a vacation home.",
    shortDescription: "Mountain retreat with stunning views and rustic charm",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    type: "house",
    features: ["Mountain Views", "Stone Fireplace", "Vaulted Ceilings", "Large Windows", "Rustic Charm"],
    coordinates: { lat: 39.1911, lng: -106.8175 },
    agent: {
      name: "Robert Taylor",
      phone: "(555) 567-8901",
      email: "robert@realestatepro.com",
    },
  },
]
