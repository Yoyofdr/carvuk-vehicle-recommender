import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/services/AIService'
import { mockVehicles } from '@/lib/data/mockVehicles'
import { mockInsuranceProducts } from '@/lib/data/mockInsurance'

const aiService = new AIService()

export async function POST(request: NextRequest) {
  // Check if AI is enabled
  if (process.env.ENABLE_AI_RECOMMENDATIONS !== 'true') {
    return NextResponse.json(
      { error: 'AI recommendations are disabled' },
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
    const { type, itemId, userAnswers } = body

    if (type === 'vehicle') {
      // Find vehicle
      const vehicle = mockVehicles.find(v => v.id === itemId)
      if (!vehicle) {
        return NextResponse.json(
          { error: 'Vehicle not found' },
          { status: 404 }
        )
      }

      // Generate AI recommendation
      const recommendation = await aiService.generateVehicleRecommendation(
        vehicle,
        userAnswers
      )

      return NextResponse.json({
        success: true,
        type: 'vehicle',
        itemId,
        recommendation
      })

    } else if (type === 'insurance') {
      // Find insurance product
      const insurance = mockInsuranceProducts.find(i => i.id === itemId)
      if (!insurance) {
        return NextResponse.json(
          { error: 'Insurance product not found' },
          { status: 404 }
        )
      }

      // Generate AI recommendation
      const recommendation = await aiService.generateInsuranceRecommendation(
        insurance,
        userAnswers
      )

      return NextResponse.json({
        success: true,
        type: 'insurance',
        itemId,
        recommendation
      })

    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "vehicle" or "insurance"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('AI Recommendation API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}