import { NextRequest, NextResponse } from 'next/server'
import { autoPressService } from '@/lib/services/AutoPressService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id_version, fecha_tasacion } = body
    
    if (!id_version) {
      return NextResponse.json(
        { error: 'Version ID is required' },
        { status: 400 }
      )
    }

    // Use current date if not provided
    const valuationDate = fecha_tasacion || new Date().toISOString().split('T')[0]
    
    const valuation = await autoPressService.getValuation(id_version, valuationDate)
    
    return NextResponse.json({
      success: true,
      id_version,
      fecha_tasacion: valuationDate,
      valuation,
      formatted_values: {
        commercial: autoPressService.formatCurrency(valuation.valor_comercial),
        minimum: autoPressService.formatCurrency(valuation.valor_minimo),
        maximum: autoPressService.formatCurrency(valuation.valor_maximo)
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch valuation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}