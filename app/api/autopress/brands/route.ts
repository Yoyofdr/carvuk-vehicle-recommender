import { NextResponse } from 'next/server'
import { autoPressService } from '@/lib/services/AutoPressService'

export async function GET() {
  try {
    const brands = autoPressService.getAvailableBrands()
    
    return NextResponse.json({
      success: true,
      brands
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch brands' 
      },
      { status: 500 }
    )
  }
}