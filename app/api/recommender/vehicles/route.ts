import { NextRequest, NextResponse } from 'next/server'
import { vehicleAnswersSchema } from '@/lib/schemas/answers'
import { VehicleRankingService } from '@/lib/services/VehicleRankingService'
import { mockVehicles } from '@/lib/data/mockVehicles'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate answers
    const validation = vehicleAnswersSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid answers', details: validation.error.errors },
        { status: 400 }
      )
    }

    const answers = validation.data

    // TODO: In production, fetch vehicles from database
    // const vehicles = await getVehicles()
    let vehicles = mockVehicles

    // Filter by condition first if specified
    if (answers.vehicleCondition) {
      vehicles = VehicleRankingService.filterByCondition(vehicles, answers.vehicleCondition)
    }

    // Filter vehicles by budget for performance
    const filteredVehicles = VehicleRankingService.filterByBudget(
      vehicles,
      answers.monthlyBudget,
      answers.downPayment
    )

    // Rank vehicles
    const recommendations = VehicleRankingService.rank(filteredVehicles, answers)

    // Return top 20 recommendations
    const topRecommendations = recommendations.slice(0, 20)

    return NextResponse.json({
      items: topRecommendations,
      total: topRecommendations.length
    })
  } catch (error) {
    console.error('Error in vehicle recommender:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}