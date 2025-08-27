import { NextRequest, NextResponse } from 'next/server'
import { autoPressService } from '@/lib/services/AutoPressService'
import { formatCLP } from '@/lib/utils/currency'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
    const year = searchParams.get('year')
    
    if (!brand || !model || !year) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Brand, model, and year parameters are required' 
        },
        { status: 400 }
      )
    }
    
    const yearNum = parseInt(year)
    if (isNaN(yearNum)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Year must be a valid number' 
        },
        { status: 400 }
      )
    }
    
    // Get versions for the selected brand/model/year
    const versions = await autoPressService.getVersionsByFilters(brand, model, yearNum)
    
    if (versions.length === 0) {
      return NextResponse.json({
        success: true,
        brand,
        model,
        year: yearNum,
        vehicleData: []
      })
    }
    
    // Get valuations for each version
    const valuations = await autoPressService.getValuationsByVersions(versions)
    
    // Combine versions with valuations
    const vehicleData = versions.map(version => {
      const valuation = valuations.get(version.id_version)
      
      if (valuation) {
        // Calculate depreciation projections
        const projections = {
          oneYear: autoPressService.calculateDepreciation(valuation.valor_comercial, 0.15, 1),
          twoYears: autoPressService.calculateDepreciation(valuation.valor_comercial, 0.15, 2),
          threeYears: autoPressService.calculateDepreciation(valuation.valor_comercial, 0.15, 3)
        }
        
        return {
          ...version,
          valuation: {
            ...valuation,
            formatted: {
              commercial: formatCLP(valuation.valor_comercial),
              minimum: formatCLP(valuation.valor_minimo),
              maximum: formatCLP(valuation.valor_maximo)
            },
            projections
          }
        }
      }
      
      return version
    })
    
    return NextResponse.json({
      success: true,
      brand,
      model,
      year: yearNum,
      vehicleData
    })
  } catch (error) {
    console.error('Error fetching valuations:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch valuations' 
      },
      { status: 500 }
    )
  }
}