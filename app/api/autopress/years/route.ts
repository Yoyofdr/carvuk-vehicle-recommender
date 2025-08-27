import { NextRequest, NextResponse } from 'next/server'
import { autoPressService } from '@/lib/services/AutoPressService'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
    
    if (!brand || !model) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Brand and model parameters are required' 
        },
        { status: 400 }
      )
    }
    
    const years = autoPressService.getYearsByModel(brand, model)
    
    return NextResponse.json({
      success: true,
      brand,
      model,
      years
    })
  } catch (error) {
    console.error('Error fetching years:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch years' 
      },
      { status: 500 }
    )
  }
}