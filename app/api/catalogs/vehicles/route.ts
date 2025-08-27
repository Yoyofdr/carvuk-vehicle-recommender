import { NextRequest, NextResponse } from 'next/server'
import { mockVehicles } from '@/lib/data/mockVehicles'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const bodyType = searchParams.get('bodyType')
    const fuelType = searchParams.get('fuelType')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    // TODO: In production, fetch from database with filters
    let vehicles = [...mockVehicles]

    // Apply filters
    if (bodyType) {
      vehicles = vehicles.filter(v => v.bodyType === bodyType)
    }
    if (fuelType) {
      vehicles = vehicles.filter(v => v.fuelType === fuelType)
    }
    if (minPrice) {
      vehicles = vehicles.filter(v => v.priceCLP >= parseInt(minPrice))
    }
    if (maxPrice) {
      vehicles = vehicles.filter(v => v.priceCLP <= parseInt(maxPrice))
    }

    return NextResponse.json({
      items: vehicles,
      total: vehicles.length
    })
  } catch (error) {
    console.error('Error fetching vehicles catalog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}