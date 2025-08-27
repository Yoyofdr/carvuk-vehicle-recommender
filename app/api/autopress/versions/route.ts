import { NextRequest, NextResponse } from 'next/server'
import { autoPressService } from '@/lib/services/AutoPressService'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const plate = searchParams.get('patente')
    
    if (!plate) {
      return NextResponse.json(
        { error: 'License plate (patente) is required' },
        { status: 400 }
      )
    }

    // Validate plate format (Chilean format)
    const plateRegex = /^[A-Z]{2}[A-Z]{2}\d{2}$|^[A-Z]{4}\d{2}$/
    if (!plateRegex.test(plate.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid license plate format' },
        { status: 400 }
      )
    }

    const versions = await autoPressService.getVersionsByPlate(plate)
    
    if (versions.length === 0) {
      return NextResponse.json(
        { error: 'No vehicle found with this license plate' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      plate: plate.toUpperCase(),
      versions,
      count: versions.length
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch vehicle versions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}