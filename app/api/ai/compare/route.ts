import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/services/AIService'
import { mockVehicles } from '@/lib/data/mockVehicles'
import { Vehicle } from '@/lib/entities/Vehicle'

const aiService = new AIService()

export async function POST(request: NextRequest) {
  // Check if AI is enabled
  if (process.env.ENABLE_AI_RECOMMENDATIONS !== 'true') {
    return NextResponse.json(
      { error: 'AI features are disabled' },
      { status: 503 }
    )
  }

  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { vehicleIds } = body

    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 vehicle IDs are required for comparison' },
        { status: 400 }
      )
    }

    if (vehicleIds.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 vehicles can be compared at once' },
        { status: 400 }
      )
    }

    // Find vehicles
    const vehicles = vehicleIds
      .map(id => mockVehicles.find(v => v.id === id))
      .filter((vehicle): vehicle is Vehicle => vehicle !== undefined)

    if (vehicles.length < 2) {
      return NextResponse.json(
        { error: 'Not enough valid vehicles found' },
        { status: 404 }
      )
    }

    // Generate AI comparison
    const comparison = await aiService.compareVehicles(vehicles)

    return NextResponse.json({
      success: true,
      vehicleIds,
      comparison,
      vehiclesCompared: vehicles.length
    })

  } catch (error) {
    console.error('AI Comparison API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate comparison',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}