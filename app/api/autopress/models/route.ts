import { NextRequest, NextResponse } from 'next/server'
import { autoPressService } from '@/lib/services/AutoPressService'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const brand = searchParams.get('brand')
    
    if (!brand) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Brand parameter is required' 
        },
        { status: 400 }
      )
    }
    
    const models = autoPressService.getModelsByBrand(brand)
    
    return NextResponse.json({
      success: true,
      brand,
      models
    })
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch models' 
      },
      { status: 500 }
    )
  }
}