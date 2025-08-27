import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/services/AIService'

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
    const { query } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query string is required' },
        { status: 400 }
      )
    }

    // Parse natural language query with AI
    const parsedQuery = await aiService.generateNaturalLanguageQuery(query)

    if (!parsedQuery) {
      return NextResponse.json(
        { error: 'Could not parse the query' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      originalQuery: query,
      parsedQuery,
      filters: {
        bodyTypes: parsedQuery.bodyTypes || [],
        fuelTypes: parsedQuery.fuelTypes || [],
        transmission: parsedQuery.transmission,
        priceRange: parsedQuery.minPrice && parsedQuery.maxPrice ? [parsedQuery.minPrice, parsedQuery.maxPrice] : undefined,
        yearRange: parsedQuery.minYear && parsedQuery.maxYear ? [parsedQuery.minYear, parsedQuery.maxYear] : undefined,
        features: parsedQuery.features || []
      }
    })

  } catch (error) {
    console.error('AI Search API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to parse search query',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}