'use client'

import { useState } from 'react'
import { X, Check, Minus, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Vehicle } from '@/lib/entities/Vehicle'
import { InsuranceProduct } from '@/lib/entities/InsuranceProduct'
import { formatCLP } from '@/lib/utils/currency'

interface ComparisonItem {
  id: string
  type: 'vehicle' | 'insurance'
  data: Vehicle | InsuranceProduct
  monthlyPrice?: number
}

interface ComparisonTableProps {
  items: ComparisonItem[]
  onRemove: (id: string) => void
  onClose?: () => void
}

export default function ComparisonTable({ items, onRemove, onClose }: ComparisonTableProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'features'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const isVehicle = (data: unknown): data is Vehicle => {
    return typeof data === 'object' && 
           data !== null && 
           'bodyType' in data && 
           'fuelType' in data
  }

  const renderVehicleComparison = () => {
    const vehicles = items.filter(item => item.type === 'vehicle')
    if (vehicles.length === 0) return null

    return (
      <>
        <Section
          title="Información Básica"
          id="basic"
          expanded={expandedSections.includes('basic')}
          onToggle={() => toggleSection('basic')}
        >
          <ComparisonRow label="Marca">
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              return <td key={item.id} className="p-4">{vehicle.brand}</td>
            })}
          </ComparisonRow>
          <ComparisonRow label="Modelo">
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              return <td key={item.id} className="p-4">{vehicle.model}</td>
            })}
          </ComparisonRow>
          <ComparisonRow label="Año">
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              return <td key={item.id} className="p-4">{vehicle.year}</td>
            })}
          </ComparisonRow>
          <ComparisonRow label="Precio" highlight>
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              return (
                <td key={item.id} className="p-4">
                  <div className="font-semibold text-lg">{formatCLP(vehicle.priceCLP)}</div>
                  {item.monthlyPrice && (
                    <div className="text-sm text-neutral-600">
                      {formatCLP(item.monthlyPrice)}/mes
                    </div>
                  )}
                </td>
              )
            })}
          </ComparisonRow>
        </Section>

        <Section
          title="Especificaciones"
          id="specs"
          expanded={expandedSections.includes('specs')}
          onToggle={() => toggleSection('specs')}
        >
          <ComparisonRow label="Carrocería">
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              return <td key={item.id} className="p-4 capitalize">{vehicle.bodyType}</td>
            })}
          </ComparisonRow>
          <ComparisonRow label="Combustible">
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              return <td key={item.id} className="p-4 capitalize">{vehicle.fuelType}</td>
            })}
          </ComparisonRow>
          <ComparisonRow label="Transmisión">
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              return <td key={item.id} className="p-4 capitalize">{vehicle.transmission}</td>
            })}
          </ComparisonRow>
          <ComparisonRow label="Motor">
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              return <td key={item.id} className="p-4">{vehicle.engineSize}L</td>
            })}
          </ComparisonRow>
          <ComparisonRow label="Asientos">
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              return <td key={item.id} className="p-4">{vehicle.seats}</td>
            })}
          </ComparisonRow>
          <ComparisonRow label="Puertas">
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              return <td key={item.id} className="p-4">{vehicle.doorsCount}</td>
            })}
          </ComparisonRow>
        </Section>

        <Section
          title="Eficiencia y Seguridad"
          id="performance"
          expanded={expandedSections.includes('performance')}
          onToggle={() => toggleSection('performance')}
        >
          <ComparisonRow label="Rendimiento">
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              return <td key={item.id} className="p-4">{vehicle.fuelEfficiency} km/l</td>
            })}
          </ComparisonRow>
          <ComparisonRow label="Seguridad" highlight>
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              return (
                <td key={item.id} className="p-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'text-lg',
                          i < vehicle.safetyRating ? 'text-yellow-500' : 'text-neutral-300'
                        )}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </td>
              )
            })}
          </ComparisonRow>
          <ComparisonRow label="Mantenimiento">
            {vehicles.map(item => {
              const vehicle = item.data as Vehicle
              const costLabels = {
                low: 'Bajo',
                medium: 'Medio',
                high: 'Alto'
              }
              return (
                <td key={item.id} className="p-4">
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    vehicle.maintenanceCostRating === 'low' && 'bg-green-100 text-green-700',
                    vehicle.maintenanceCostRating === 'medium' && 'bg-yellow-100 text-yellow-700',
                    vehicle.maintenanceCostRating === 'high' && 'bg-red-100 text-red-700'
                  )}>
                    {costLabels[vehicle.maintenanceCostRating]}
                  </span>
                </td>
              )
            })}
          </ComparisonRow>
        </Section>

        <Section
          title="Características"
          id="features"
          expanded={expandedSections.includes('features')}
          onToggle={() => toggleSection('features')}
        >
          {getAllFeatures(vehicles).map(feature => (
            <ComparisonRow key={feature} label={feature}>
              {vehicles.map(item => {
                const vehicle = item.data as Vehicle
                const hasFeature = vehicle.features.includes(feature)
                return (
                  <td key={item.id} className="p-4 text-center">
                    {hasFeature ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <Minus className="h-5 w-5 text-neutral-400 mx-auto" />
                    )}
                  </td>
                )
              })}
            </ComparisonRow>
          ))}
        </Section>
      </>
    )
  }

  const renderInsuranceComparison = () => {
    const insurances = items.filter(item => item.type === 'insurance')
    if (insurances.length === 0) return null

    return (
      <>
        <Section
          title="Información Básica"
          id="basic"
          expanded={expandedSections.includes('basic')}
          onToggle={() => toggleSection('basic')}
        >
          <ComparisonRow label="Proveedor">
            {insurances.map(item => {
              const insurance = item.data as InsuranceProduct
              return <td key={item.id} className="p-4">{insurance.provider}</td>
            })}
          </ComparisonRow>
          <ComparisonRow label="Producto">
            {insurances.map(item => {
              const insurance = item.data as InsuranceProduct
              return <td key={item.id} className="p-4">{insurance.productName}</td>
            })}
          </ComparisonRow>
          <ComparisonRow label="Prima Mensual" highlight>
            {insurances.map(item => (
              <td key={item.id} className="p-4">
                <div className="font-semibold text-lg">
                  {item.monthlyPrice ? formatCLP(item.monthlyPrice) : 'Cotizar'}
                </div>
              </td>
            ))}
          </ComparisonRow>
          <ComparisonRow label="Deducible">
            {insurances.map(item => {
              const insurance = item.data as InsuranceProduct
              return <td key={item.id} className="p-4">{insurance.deductibleUF} UF</td>
            })}
          </ComparisonRow>
        </Section>

        <Section
          title="Coberturas"
          id="coverages"
          expanded={expandedSections.includes('coverages')}
          onToggle={() => toggleSection('coverages')}
        >
          {['rc', 'damage', 'theft', 'glass', 'natural_disaster', 'personal_accident'].map(coverageType => {
            const coverageLabels: Record<string, string> = {
              rc: 'Responsabilidad Civil',
              damage: 'Daños Propios',
              theft: 'Robo',
              glass: 'Cristales',
              natural_disaster: 'Eventos Naturales',
              personal_accident: 'Accidentes Personales'
            }
            
            return (
              <ComparisonRow key={coverageType} label={coverageLabels[coverageType]}>
                {insurances.map(item => {
                  const insurance = item.data as InsuranceProduct
                  const coverage = insurance.coverages.find(c => c.type === coverageType)
                  
                  return (
                    <td key={item.id} className="p-4 text-center">
                      {coverage?.included ? (
                        <div>
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                          {coverage.limitUF && (
                            <div className="text-xs text-neutral-600 mt-1">
                              {coverage.limitUF} UF
                            </div>
                          )}
                        </div>
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  )
                })}
              </ComparisonRow>
            )
          })}
        </Section>

        <Section
          title="Servicios Adicionales"
          id="services"
          expanded={expandedSections.includes('services')}
          onToggle={() => toggleSection('services')}
        >
          <ComparisonRow label="Tipo de Taller">
            {insurances.map(item => {
              const insurance = item.data as InsuranceProduct
              const workshopLabels = {
                brand: 'De marca',
                preferred: 'Preferente',
                any: 'Cualquiera'
              }
              return (
                <td key={item.id} className="p-4">
                  {workshopLabels[insurance.features.workshopType]}
                </td>
              )
            })}
          </ComparisonRow>
          <ComparisonRow label="Auto de Reemplazo">
            {insurances.map(item => {
              const insurance = item.data as InsuranceProduct
              return (
                <td key={item.id} className="p-4 text-center">
                  {insurance.features.replacementCar ? (
                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  )}
                </td>
              )
            })}
          </ComparisonRow>
          <ComparisonRow label="Asistencia en Ruta">
            {insurances.map(item => {
              const insurance = item.data as InsuranceProduct
              return (
                <td key={item.id} className="p-4 text-center">
                  {insurance.features.roadAssistance ? (
                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  )}
                </td>
              )
            })}
          </ComparisonRow>
          <ComparisonRow label="Cobertura Internacional">
            {insurances.map(item => {
              const insurance = item.data as InsuranceProduct
              return (
                <td key={item.id} className="p-4 text-center">
                  {insurance.features.internationalCoverage ? (
                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  )}
                </td>
              )
            })}
          </ComparisonRow>
        </Section>
      </>
    )
  }

  const getAllFeatures = (vehicles: ComparisonItem[]) => {
    const allFeatures = new Set<string>()
    vehicles.forEach(item => {
      const vehicle = item.data as Vehicle
      vehicle.features.forEach(f => allFeatures.add(f))
    })
    return Array.from(allFeatures)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">No hay elementos para comparar</p>
      </div>
    )
  }

  const isComparingVehicles = items[0].type === 'vehicle'

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold text-neutral-900">
            Comparación de {isComparingVehicles ? 'Vehículos' : 'Seguros'}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Cerrar comparación"
            >
              <X className="h-5 w-5 text-neutral-600" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="p-4 text-left text-sm font-medium text-neutral-600 w-48">
                Característica
              </th>
              {items.map(item => (
                <th key={item.id} className="p-4 text-left min-w-[200px]">
                  <div className="relative">
                    {isVehicle(item.data) ? (
                      <div>
                        <div className="font-semibold text-neutral-900">
                          {item.data.brand} {item.data.model}
                        </div>
                        <div className="text-sm text-neutral-600">{item.data.year}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-neutral-900">
                          {item.data.productName}
                        </div>
                        <div className="text-sm text-neutral-600">{item.data.provider}</div>
                      </div>
                    )}
                    <button
                      onClick={() => onRemove(item.id)}
                      className="absolute -top-2 -right-2 p-1 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors"
                      aria-label="Quitar de comparación"
                    >
                      <X className="h-3 w-3 text-neutral-600" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isComparingVehicles ? renderVehicleComparison() : renderInsuranceComparison()}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  id: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function Section({ title, expanded, onToggle, children }: SectionProps) {
  return (
    <>
      <tr className="bg-neutral-50 border-y border-neutral-200">
        <td colSpan={100}>
          <button
            onClick={onToggle}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-100 transition-colors"
          >
            <span className="font-medium text-neutral-900">{title}</span>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-neutral-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-neutral-600" />
            )}
          </button>
        </td>
      </tr>
      {expanded && children}
    </>
  )
}

interface ComparisonRowProps {
  label: string
  highlight?: boolean
  children: React.ReactNode
}

function ComparisonRow({ label, highlight, children }: ComparisonRowProps) {
  return (
    <tr className={cn(
      'border-b border-neutral-100',
      highlight && 'bg-brand/5'
    )}>
      <td className="p-4 text-sm font-medium text-neutral-700">{label}</td>
      {children}
    </tr>
  )
}