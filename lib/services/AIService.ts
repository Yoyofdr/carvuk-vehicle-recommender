import OpenAI from 'openai'
import { Vehicle } from '../entities/Vehicle'
import { InsuranceProduct } from '../entities/InsuranceProduct'
import { VehicleAnswers, InsuranceAnswers } from '../schemas/answers'
import { AIRecommendation, VehicleComparison, NaturalLanguageQuery } from '../types/ai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export class AIService {
  private model: string
  private maxTokens: number
  private temperature: number

  constructor() {
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
    this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '1500')
    this.temperature = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7')
  }

  async generateVehicleRecommendation(
    vehicle: Vehicle,
    userAnswers: VehicleAnswers
  ): Promise<AIRecommendation> {
    try {
      const prompt = this.buildVehicleRecommendationPrompt(vehicle, userAnswers)
      
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Eres un experto asesor automotriz en Chile. Proporciona recomendaciones personalizadas, objetivas y útiles en español chileno.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        response_format: { type: 'json_object' }
      })

      const response = completion.choices[0].message.content
      if (!response) throw new Error('No response from AI')

      return JSON.parse(response) as AIRecommendation
    } catch (error) {
      console.error('AI Recommendation error:', error)
      return this.getFallbackRecommendation(vehicle)
    }
  }

  async generateInsuranceRecommendation(
    insurance: InsuranceProduct,
    userAnswers: InsuranceAnswers
  ): Promise<AIRecommendation> {
    try {
      const prompt = this.buildInsuranceRecommendationPrompt(insurance, userAnswers)
      
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Eres un experto asesor de seguros automotrices en Chile. Proporciona recomendaciones claras y útiles en español chileno.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        response_format: { type: 'json_object' }
      })

      const response = completion.choices[0].message.content
      if (!response) throw new Error('No response from AI')

      return JSON.parse(response) as AIRecommendation
    } catch (error) {
      console.error('AI Insurance Recommendation error:', error)
      return this.getFallbackInsuranceRecommendation(insurance)
    }
  }

  async compareVehicles(vehicles: Vehicle[]): Promise<VehicleComparison> {
    try {
      const prompt = this.buildComparisonPrompt(vehicles)
      
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Eres un experto automotriz que compara vehículos de manera objetiva y detallada.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.5, // Lower temperature for more consistent comparisons
        response_format: { type: 'json_object' }
      })

      const response = completion.choices[0].message.content
      if (!response) throw new Error('No response from AI')

      return JSON.parse(response) as VehicleComparison
    } catch (error) {
      console.error('AI Comparison error:', error)
      return this.getFallbackComparison(vehicles)
    }
  }

  async generatePersonalizedSummary(
    recommendations: Array<{ vehicle?: Vehicle; insurance?: InsuranceProduct; score: number; reasons: string[] }>,
    userPreferences: Record<string, unknown>
  ): Promise<string> {
    try {
      const prompt = `
        Basándote en las siguientes preferencias del usuario:
        ${JSON.stringify(userPreferences, null, 2)}
        
        Y estas recomendaciones:
        ${JSON.stringify(recommendations.slice(0, 3), null, 2)}
        
        Genera un resumen personalizado en español chileno (máximo 150 palabras) que:
        1. Explique por qué estas opciones son las mejores para el usuario
        2. Destaque los aspectos más relevantes según sus preferencias
        3. Sugiera cuál sería la mejor opción y por qué
        4. Sea amigable y profesional
      `

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Eres un asesor experto y amigable que ayuda a tomar decisiones informadas.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: this.temperature
      })

      return completion.choices[0].message.content || 'No se pudo generar el resumen.'
    } catch (error) {
      console.error('AI Summary error:', error)
      return 'Hemos encontrado excelentes opciones que se ajustan a tus preferencias. Revisa los detalles de cada una para tomar la mejor decisión.'
    }
  }

  async analyzeMarketTrends(vehicles: Vehicle[]): Promise<{
    insights: string[];
    priceRanges: Record<string, { min: number; max: number; average: number }>;
    popularBrands: string[];
    recommendations: string[];
  }> {
    try {
      const prompt = `
        Analiza los siguientes vehículos del mercado chileno:
        ${JSON.stringify(vehicles.slice(0, 10).map(v => ({
          brand: v.brand,
          model: v.model,
          year: v.year,
          price: v.priceCLP,
          bodyType: v.bodyType,
          fuelType: v.fuelType
        })), null, 2)}
        
        Proporciona en formato JSON:
        {
          "trendSummary": "Resumen de tendencias del mercado",
          "priceAnalysis": {
            "average": number,
            "trend": "up" | "down" | "stable",
            "explanation": "string"
          },
          "popularFeatures": ["feature1", "feature2"],
          "recommendations": ["recomendación 1", "recomendación 2"],
          "bestValueOptions": ["marca modelo", "marca modelo"]
        }
      `

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Eres un analista del mercado automotriz chileno con amplio conocimiento de tendencias y precios.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.5,
        response_format: { type: 'json_object' }
      })

      const response = completion.choices[0].message.content
      return response ? JSON.parse(response) : {
        insights: [],
        priceRanges: {},
        popularBrands: [],
        recommendations: []
      }
    } catch (error) {
      console.error('AI Market Analysis error:', error)
      return {
        insights: [],
        priceRanges: {},
        popularBrands: [],
        recommendations: []
      }
    }
  }

  async generateNaturalLanguageQuery(userInput: string): Promise<NaturalLanguageQuery | null> {
    try {
      const prompt = `
        El usuario ha escrito: "${userInput}"
        
        Interpreta esta búsqueda de vehículos y extrae los siguientes parámetros en formato JSON:
        {
          "bodyTypes": ["sedan", "suv", "hatchback", "pickup", "coupe", "minivan"] o [],
          "fuelTypes": ["gasoline", "diesel", "hybrid", "electric"] o [],
          "transmission": "manual" | "automatic" | null,
          "priceRange": [min, max] o null,
          "yearRange": [min, max] o null,
          "brands": ["marca1", "marca2"] o [],
          "features": ["feature1", "feature2"] o [],
          "usage": ["city", "highway", "family", "work", "offroad", "sport"] o [],
          "interpretation": "Explicación de lo que entendiste"
        }
        
        Ejemplos:
        - "Quiero un auto familiar económico" -> bodyTypes: ["suv", "minivan"], usage: ["family"]
        - "Busco un sedán Toyota del 2020 en adelante" -> bodyTypes: ["sedan"], brands: ["Toyota"], yearRange: [2020, 2024]
      `

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en interpretar búsquedas de vehículos en lenguaje natural.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })

      const response = completion.choices[0].message.content
      return response ? JSON.parse(response) : null
    } catch (error) {
      console.error('AI Query Parser error:', error)
      return null
    }
  }

  private buildVehicleRecommendationPrompt(vehicle: Vehicle, answers: VehicleAnswers): string {
    return `
      Analiza este vehículo para el usuario:
      
      Vehículo:
      - ${vehicle.brand} ${vehicle.model} ${vehicle.year}
      - Precio: $${vehicle.priceCLP.toLocaleString('es-CL')} CLP
      - Carrocería: ${vehicle.bodyType}
      - Combustible: ${vehicle.fuelType}
      - Transmisión: ${vehicle.transmission}
      - Seguridad: ${vehicle.safetyRating}/5 estrellas
      - Rendimiento: ${vehicle.fuelEfficiency} km/l
      
      Preferencias del usuario:
      - Presupuesto mensual: $${answers.monthlyBudget?.[0]}-${answers.monthlyBudget?.[1]} CLP
      - Carrocerías preferidas: ${answers.bodyTypes?.join(', ')}
      - Combustibles preferidos: ${answers.fuelTypes?.join(', ')}
      - Uso principal: ${answers.usage?.join(', ')}
      
      Genera una recomendación en formato JSON con:
      {
        "reasoning": "Explicación detallada de por qué este vehículo es o no es adecuado",
        "pros": ["ventaja 1", "ventaja 2", "ventaja 3"],
        "cons": ["desventaja 1", "desventaja 2"],
        "alternatives": ["alternativa similar 1", "alternativa similar 2"],
        "personalizedAdvice": "Consejo personalizado basado en las preferencias del usuario",
        "confidenceScore": 0.85
      }
    `
  }

  private buildInsuranceRecommendationPrompt(insurance: InsuranceProduct, answers: InsuranceAnswers): string {
    return `
      Analiza este seguro para el usuario:
      
      Seguro:
      - Proveedor: ${insurance.provider}
      - Producto: ${insurance.productName}
      - Deducible: ${insurance.deductibleUF} UF
      - Coberturas: ${insurance.coverages.filter(c => c.included).map(c => c.type).join(', ')}
      - Taller: ${insurance.features.workshopType}
      - Auto reemplazo: ${insurance.features.replacementCar ? 'Sí' : 'No'}
      
      Preferencias del usuario:
      - Presupuesto: $${answers.monthlyBudget[0]}-${answers.monthlyBudget[1]} CLP/mes
      - Deducible preferido: ${answers.deductibleRange[0]}-${answers.deductibleRange[1]} UF
      - Coberturas mínimas: ${answers.minCoverages.join(', ')}
      
      Genera una recomendación en formato JSON.
    `
  }

  private buildComparisonPrompt(vehicles: Vehicle[]): string {
    const vehiclesSummary = vehicles.map(v => ({
      name: `${v.brand} ${v.model}`,
      price: v.priceCLP,
      year: v.year,
      bodyType: v.bodyType,
      fuelType: v.fuelType,
      safety: v.safetyRating,
      efficiency: v.fuelEfficiency
    }))

    return `
      Compara estos vehículos:
      ${JSON.stringify(vehiclesSummary, null, 2)}
      
      Genera una comparación en formato JSON:
      {
        "summary": "Resumen ejecutivo de la comparación",
        "winner": "Marca Modelo del ganador general",
        "comparison": [
          {
            "category": "Precio",
            "winner": "Marca Modelo",
            "explanation": "Explicación breve"
          },
          {
            "category": "Seguridad",
            "winner": "Marca Modelo",
            "explanation": "Explicación breve"
          },
          {
            "category": "Eficiencia",
            "winner": "Marca Modelo",
            "explanation": "Explicación breve"
          },
          {
            "category": "Valor general",
            "winner": "Marca Modelo",
            "explanation": "Explicación breve"
          }
        ]
      }
    `
  }

  private getFallbackRecommendation(vehicle: Vehicle): AIRecommendation {
    return {
      reasoning: `El ${vehicle.brand} ${vehicle.model} es una opción sólida en su categoría.`,
      pros: [
        'Marca reconocida',
        'Buen equipamiento de serie',
        'Respaldo de servicio técnico'
      ],
      cons: [
        'Considerar costos de mantenimiento',
        'Verificar disponibilidad de repuestos'
      ],
      alternatives: [
        'Toyota Corolla',
        'Mazda 3',
        'Honda Civic'
      ],
      personalizedAdvice: 'Te recomendamos hacer una prueba de manejo y comparar con opciones similares.',
      confidenceScore: 0.7
    }
  }

  private getFallbackInsuranceRecommendation(insurance: InsuranceProduct): AIRecommendation {
    return {
      reasoning: `${insurance.provider} ofrece una cobertura completa con ${insurance.productName}.`,
      pros: [
        'Cobertura amplia',
        'Proveedor establecido',
        'Buenos beneficios adicionales'
      ],
      cons: [
        'Revisar letra chica',
        'Comparar deducibles'
      ],
      alternatives: [
        'HDI Seguros',
        'SURA',
        'Mapfre'
      ],
      personalizedAdvice: 'Compara al menos 3 cotizaciones antes de decidir.',
      confidenceScore: 0.65
    }
  }

  private getFallbackComparison(vehicles: Vehicle[]): VehicleComparison {
    return {
      summary: 'Comparación basada en características principales de los vehículos.',
      winner: `${vehicles[0].brand} ${vehicles[0].model}`,
      comparison: [
        {
          category: 'Precio',
          winner: `${vehicles[0].brand} ${vehicles[0].model}`,
          explanation: 'Mejor relación precio-valor'
        },
        {
          category: 'Características',
          winner: `${vehicles[0].brand} ${vehicles[0].model}`,
          explanation: 'Equipamiento más completo'
        }
      ]
    }
  }
}