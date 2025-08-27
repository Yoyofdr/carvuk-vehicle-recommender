import { NextRequest, NextResponse } from 'next/server'
import { autoPressService } from '@/lib/services/AutoPressService'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const plate = searchParams.get('patente')
    const date = searchParams.get('fecha') || new Date().toISOString().split('T')[0]
    
    if (!plate) {
      return NextResponse.json(
        { error: 'License plate (patente) is required' },
        { status: 400 }
      )
    }

    // Get complete vehicle information
    const { versions, valuations } = await autoPressService.getVehicleInfo(plate, date)
    
    // Transform data for better frontend consumption
    const vehicleData = versions.map(version => {
      const valuation = valuations.get(version.id_version)
      
      return {
        ...version,
        valuation: valuation ? {
          ...valuation,
          formatted: {
            commercial: autoPressService.formatCurrency(valuation.valor_comercial),
            minimum: autoPressService.formatCurrency(valuation.valor_minimo),
            maximum: autoPressService.formatCurrency(valuation.valor_maximo)
          },
          // Calculate projected values
          projections: {
            oneYear: autoPressService.calculateDepreciation(valuation.valor_comercial, 0.15, 1),
            twoYears: autoPressService.calculateDepreciation(valuation.valor_comercial, 0.15, 2),
            threeYears: autoPressService.calculateDepreciation(valuation.valor_comercial, 0.15, 3)
          }
        } : null
      }
    })

    return NextResponse.json({
      success: true,
      plate: plate.toUpperCase(),
      date,
      vehicleData,
      count: vehicleData.length,
      hasValuations: valuations.size > 0
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch vehicle information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}