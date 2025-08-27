import { NextRequest, NextResponse } from 'next/server'
import { mockInsuranceProducts } from '@/lib/data/mockInsurance'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const provider = searchParams.get('provider')
    const minDeductible = searchParams.get('minDeductible')
    const maxDeductible = searchParams.get('maxDeductible')

    // TODO: In production, fetch from database with filters
    let products = [...mockInsuranceProducts]

    // Apply filters
    if (provider) {
      products = products.filter(p => p.provider.toLowerCase().includes(provider.toLowerCase()))
    }
    if (minDeductible) {
      products = products.filter(p => p.deductibleUF >= parseInt(minDeductible))
    }
    if (maxDeductible) {
      products = products.filter(p => p.deductibleUF <= parseInt(maxDeductible))
    }

    return NextResponse.json({
      items: products,
      total: products.length
    })
  } catch (error) {
    console.error('Error fetching insurance catalog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}