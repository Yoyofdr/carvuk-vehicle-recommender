// Mock data for vehicle discovery - for static deployment
export interface MockVehicle {
  id: string
  brand: string
  model: string
  version: string
  price: number
  monthlyPayment: number
  year: number
  bodyType: string
  fuelType: string
  transmission: string
  features: {
    economy: boolean
    space: boolean
    performance: boolean
    safety: boolean
    technology: boolean
    comfort: boolean
    resale: boolean
    highway: boolean
    cargo: boolean
    maintenance: boolean
  }
}

export const mockVehicles: MockVehicle[] = [
  // SUVs
  {
    id: "1",
    brand: "Toyota",
    model: "RAV4",
    version: "2.0 CVT",
    price: 28000000,
    monthlyPayment: 450000,
    year: 2023,
    bodyType: "suv",
    fuelType: "gasoline",
    transmission: "CVT",
    features: {
      economy: true,
      space: true,
      performance: false,
      safety: true,
      technology: true,
      comfort: true,
      resale: true,
      highway: true,
      cargo: true,
      maintenance: true
    }
  },
  {
    id: "2",
    brand: "Hyundai",
    model: "Tucson",
    version: "2.0 GLS",
    price: 32000000,
    monthlyPayment: 520000,
    year: 2023,
    bodyType: "suv",
    fuelType: "gasoline",
    transmission: "Automática",
    features: {
      economy: true,
      space: true,
      performance: false,
      safety: true,
      technology: true,
      comfort: true,
      resale: true,
      highway: true,
      cargo: true,
      maintenance: true
    }
  },
  {
    id: "3",
    brand: "Mazda",
    model: "CX-5",
    version: "2.5 GT",
    price: 35000000,
    monthlyPayment: 580000,
    year: 2023,
    bodyType: "suv",
    fuelType: "gasoline",
    transmission: "Automática",
    features: {
      economy: false,
      space: true,
      performance: true,
      safety: true,
      technology: true,
      comfort: true,
      resale: true,
      highway: true,
      cargo: true,
      maintenance: false
    }
  },
  // Hatchbacks
  {
    id: "4",
    brand: "Toyota",
    model: "Yaris",
    version: "1.5 XS",
    price: 16000000,
    monthlyPayment: 280000,
    year: 2023,
    bodyType: "hatchback",
    fuelType: "gasoline",
    transmission: "CVT",
    features: {
      economy: true,
      space: false,
      performance: false,
      safety: true,
      technology: false,
      comfort: false,
      resale: true,
      highway: false,
      cargo: false,
      maintenance: true
    }
  },
  {
    id: "5",
    brand: "Volkswagen",
    model: "Polo",
    version: "1.6 Highline",
    price: 18500000,
    monthlyPayment: 320000,
    year: 2023,
    bodyType: "hatchback",
    fuelType: "gasoline",
    transmission: "Automática",
    features: {
      economy: true,
      space: false,
      performance: false,
      safety: true,
      technology: true,
      comfort: true,
      resale: true,
      highway: false,
      cargo: false,
      maintenance: false
    }
  },
  {
    id: "6",
    brand: "Honda",
    model: "Fit",
    version: "1.5 EX",
    price: 17800000,
    monthlyPayment: 310000,
    year: 2023,
    bodyType: "hatchback",
    fuelType: "gasoline",
    transmission: "CVT",
    features: {
      economy: true,
      space: true,
      performance: false,
      safety: true,
      technology: false,
      comfort: false,
      resale: true,
      highway: false,
      cargo: false,
      maintenance: true
    }
  },
  // Sedans
  {
    id: "7",
    brand: "Toyota",
    model: "Corolla",
    version: "1.8 GLi",
    price: 22000000,
    monthlyPayment: 380000,
    year: 2023,
    bodyType: "sedan",
    fuelType: "gasoline",
    transmission: "CVT",
    features: {
      economy: true,
      space: true,
      performance: false,
      safety: true,
      technology: true,
      comfort: true,
      resale: true,
      highway: true,
      cargo: false,
      maintenance: true
    }
  },
  {
    id: "8",
    brand: "Hyundai",
    model: "Elantra",
    version: "2.0 GLS",
    price: 24500000,
    monthlyPayment: 420000,
    year: 2023,
    bodyType: "sedan",
    fuelType: "gasoline",
    transmission: "Automática",
    features: {
      economy: true,
      space: true,
      performance: false,
      safety: true,
      technology: true,
      comfort: true,
      resale: true,
      highway: true,
      cargo: false,
      maintenance: true
    }
  },
  {
    id: "9",
    brand: "Nissan",
    model: "Sentra",
    version: "1.8 Advance",
    price: 23500000,
    monthlyPayment: 400000,
    year: 2023,
    bodyType: "sedan",
    fuelType: "gasoline",
    transmission: "CVT",
    features: {
      economy: true,
      space: true,
      performance: false,
      safety: true,
      technology: true,
      comfort: true,
      resale: false,
      highway: true,
      cargo: false,
      maintenance: true
    }
  },
  // Coupes
  {
    id: "10",
    brand: "Ford",
    model: "Mustang",
    version: "2.3 EcoBoost",
    price: 45000000,
    monthlyPayment: 750000,
    year: 2023,
    bodyType: "coupe",
    fuelType: "gasoline",
    transmission: "Automática",
    features: {
      economy: false,
      space: false,
      performance: true,
      safety: true,
      technology: true,
      comfort: true,
      resale: false,
      highway: true,
      cargo: false,
      maintenance: false
    }
  },
  {
    id: "11",
    brand: "Chevrolet",
    model: "Camaro",
    version: "2.0T LT",
    price: 42000000,
    monthlyPayment: 700000,
    year: 2023,
    bodyType: "coupe",
    fuelType: "gasoline",
    transmission: "Automática",
    features: {
      economy: false,
      space: false,
      performance: true,
      safety: true,
      technology: true,
      comfort: true,
      resale: false,
      highway: true,
      cargo: false,
      maintenance: false
    }
  },
  // Estate cars / Station wagons
  {
    id: "12",
    brand: "Subaru",
    model: "Outback",
    version: "2.5i CVT",
    price: 38000000,
    monthlyPayment: 630000,
    year: 2023,
    bodyType: "wagon",
    fuelType: "gasoline",
    transmission: "CVT",
    features: {
      economy: false,
      space: true,
      performance: false,
      safety: true,
      technology: true,
      comfort: true,
      resale: true,
      highway: true,
      cargo: true,
      maintenance: false
    }
  },
  // Minivans / People carriers
  {
    id: "13",
    brand: "Honda",
    model: "Odyssey",
    version: "3.5 EX-L",
    price: 48000000,
    monthlyPayment: 800000,
    year: 2023,
    bodyType: "minivan",
    fuelType: "gasoline",
    transmission: "Automática",
    features: {
      economy: false,
      space: true,
      performance: false,
      safety: true,
      technology: true,
      comfort: true,
      resale: false,
      highway: true,
      cargo: true,
      maintenance: false
    }
  },
  {
    id: "14",
    brand: "Toyota",
    model: "Sienna",
    version: "3.5 LE",
    price: 46000000,
    monthlyPayment: 760000,
    year: 2023,
    bodyType: "minivan",
    fuelType: "gasoline",
    transmission: "Automática",
    features: {
      economy: false,
      space: true,
      performance: false,
      safety: true,
      technology: true,
      comfort: true,
      resale: true,
      highway: true,
      cargo: true,
      maintenance: true
    }
  },
  // Sports cars
  {
    id: "15",
    brand: "BMW",
    model: "M2",
    version: "3.0 Competition",
    price: 68000000,
    monthlyPayment: 1100000,
    year: 2023,
    bodyType: "sports",
    fuelType: "gasoline",
    transmission: "Manual",
    features: {
      economy: false,
      space: false,
      performance: true,
      safety: true,
      technology: true,
      comfort: true,
      resale: false,
      highway: true,
      cargo: false,
      maintenance: false
    }
  },
  {
    id: "16",
    brand: "Porsche",
    model: "Cayman",
    version: "2.0T",
    price: 72000000,
    monthlyPayment: 1200000,
    year: 2023,
    bodyType: "sports",
    fuelType: "gasoline",
    transmission: "PDK",
    features: {
      economy: false,
      space: false,
      performance: true,
      safety: true,
      technology: true,
      comfort: true,
      resale: true,
      highway: true,
      cargo: false,
      maintenance: false
    }
  },
  // Convertibles
  {
    id: "17",
    brand: "BMW",
    model: "Z4",
    version: "2.0 sDrive20i",
    price: 58000000,
    monthlyPayment: 950000,
    year: 2023,
    bodyType: "convertible",
    fuelType: "gasoline",
    transmission: "Automática",
    features: {
      economy: false,
      space: false,
      performance: true,
      safety: true,
      technology: true,
      comfort: true,
      resale: false,
      highway: true,
      cargo: false,
      maintenance: false
    }
  },
  {
    id: "18",
    brand: "Mercedes-Benz",
    model: "SLK",
    version: "2.0 200",
    price: 55000000,
    monthlyPayment: 900000,
    year: 2023,
    bodyType: "convertible",
    fuelType: "gasoline",
    transmission: "Automática",
    features: {
      economy: false,
      space: false,
      performance: true,
      safety: true,
      technology: true,
      comfort: true,
      resale: true,
      highway: true,
      cargo: false,
      maintenance: false
    }
  }
]

export function filterVehicles(filters: {
  minPrice?: number
  maxPrice?: number
  bodyTypes?: string[]
  fuelTypes?: string[]
  brands?: string[]
  features?: string[]
  paymentMode?: 'monthly' | 'cash'
}): MockVehicle[] {
  return mockVehicles.filter(vehicle => {
    // Price filtering
    if (filters.minPrice || filters.maxPrice) {
      const price = filters.paymentMode === 'monthly' ? vehicle.monthlyPayment : vehicle.price
      if (filters.minPrice && price < filters.minPrice) return false
      if (filters.maxPrice && price > filters.maxPrice) return false
    }

    // Body type filtering
    if (filters.bodyTypes && filters.bodyTypes.length > 0) {
      if (!filters.bodyTypes.includes(vehicle.bodyType)) return false
    }

    // Fuel type filtering
    if (filters.fuelTypes && filters.fuelTypes.length > 0) {
      if (!filters.fuelTypes.includes(vehicle.fuelType)) return false
    }

    // Brand filtering
    if (filters.brands && filters.brands.length > 0) {
      if (!filters.brands.includes(vehicle.brand)) return false
    }

    // Feature filtering - vehicle should have at least one of the requested features
    if (filters.features && filters.features.length > 0) {
      const hasMatchingFeature = filters.features.some(feature => 
        vehicle.features[feature as keyof typeof vehicle.features]
      )
      if (!hasMatchingFeature) return false
    }

    return true
  })
}