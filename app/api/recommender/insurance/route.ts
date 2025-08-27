import { NextRequest, NextResponse } from 'next/server'
import { insuranceAnswersSchema } from '@/lib/schemas/answers'
import { InsuranceRankingService } from '@/lib/services/InsuranceRankingService'
import { mockInsuranceProducts, mockInsurancePremiums } from '@/lib/data/mockInsurance'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate answers
    const validation = insuranceAnswersSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid answers', details: validation.error.errors },
        { status: 400 }
      )
    }

    const answers = validation.data

    // TODO: In production, fetch products and premiums from database
    // const products = await getInsuranceProducts()
    // const premiums = await getPremiumQuotes(vehicleId)
    const products = mockInsuranceProducts
    const premiums = mockInsurancePremiums

    // Filter products by budget first
    const filteredProducts = InsuranceRankingService.filterByBudget(
      products,
      premiums,
      answers.monthlyBudget
    )

    // Rank insurance products
    const recommendations = InsuranceRankingService.rank(
      filteredProducts,
      premiums,
      answers
    )

    // Return top 15 recommendations
    const topRecommendations = recommendations.slice(0, 15)

    return NextResponse.json({
      items: topRecommendations,
      total: topRecommendations.length
    })
  } catch (error) {
    console.error('Error in insurance recommender:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}