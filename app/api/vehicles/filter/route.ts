import { NextRequest, NextResponse } from 'next/server'
import { vehicleFilterService, VehicleFilterCriteria } from '@/lib/services/VehicleFilterService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Parse the filter criteria from request
    const criteria: VehicleFilterCriteria = {
      minPrice: body.minPrice,
      maxPrice: body.maxPrice,
      bodyTypes: body.bodyTypes || [],
      fuelTypes: body.fuelTypes || [],
      transmission: body.transmission || [],
      brands: body.brands || [],
      features: body.features || [],
      paymentMode: body.paymentMode || 'cash',
      monthlyBudget: body.monthlyBudget
    }
    
    console.log('Received filter request:', criteria)
    
    // Get filtered vehicles
    const vehicles = await vehicleFilterService.filterVehicles(criteria)
    
    // Limit results for performance
    const limitedVehicles = vehicles.slice(0, 50)
    
    return NextResponse.json({
      success: true,
      count: limitedVehicles.length,
      totalFound: vehicles.length,
      vehicles: limitedVehicles
    })
  } catch (error) {
    console.error('Error in vehicle filter API:', error)
    
    // Return mock data in case of error (for development/demo)
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: false,
        count: 0,
        vehicles: [],
        error: 'Failed to filter vehicles',
        usingMockData: true
      })
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to filter vehicles'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get recommendations based on a feature
    const feature = searchParams.get('feature')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    if (feature) {
      const vehicles = await vehicleFilterService.getVehiclesByFeature(feature, limit)
      
      return NextResponse.json({
        success: true,
        feature,
        count: vehicles.length,
        vehicles
      })
    }
    
    // Get general recommendations
    const defaultCriteria: VehicleFilterCriteria = {
      bodyTypes: ['suv', 'sedan', 'hatchback'],
      fuelTypes: ['gasoline', 'hybrid'],
      transmission: ['automatic']
    }
    
    const vehicles = await vehicleFilterService.getRecommendations(defaultCriteria, limit)
    
    return NextResponse.json({
      success: true,
      count: vehicles.length,
      vehicles
    })
  } catch (error) {
    console.error('Error getting vehicle recommendations:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get recommendations'
      },
      { status: 500 }
    )
  }
}