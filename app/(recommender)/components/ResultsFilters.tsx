'use client'

import { useState } from 'react'
import { 
  SlidersHorizontal, 
  X, 
  ChevronDown,
  DollarSign,
  Car,
  Fuel,
  Settings,
  Shield,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import RangeControl from './RangeControl'
import PillsFilter from './PillsFilter'

interface FilterOptions {
  priceRange?: [number, number]
  bodyTypes?: string[]
  fuelTypes?: string[]
  transmission?: string[]
  brands?: string[]
  safetyRating?: number
  sortBy?: 'score' | 'price_asc' | 'price_desc' | 'safety' | 'efficiency'
}

interface ResultsFiltersProps {
  type: 'vehicles' | 'insurance'
  filters: FilterOptions
  onChange: (filters: FilterOptions) => void
  resultsCount?: number
}

export default function ResultsFilters({ 
  type, 
  filters, 
  onChange, 
  resultsCount 
}: ResultsFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(['price'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handleFilterChange = (key: keyof FilterOptions, value: FilterOptions[keyof FilterOptions]) => {
    onChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onChange({})
  }

  const activeFiltersCount = Object.keys(filters).filter(
    key => key !== 'sortBy' && filters[key as keyof FilterOptions] !== undefined
  ).length

  const vehicleFilters = (
    <>
      <FilterSection
        icon={<DollarSign className="h-4 w-4" />}
        title="Precio"
        id="price"
        expanded={expandedSections.includes('price')}
        onToggle={() => toggleSection('price')}
      >
        <RangeControl
          min={5000000}
          max={100000000}
          step={1000000}
          value={filters.priceRange || [5000000, 100000000]}
          onChange={(value) => handleFilterChange('priceRange', value)}
          format={(v) => `$${(v / 1000000).toFixed(0)}M`}
        />
      </FilterSection>

      <FilterSection
        icon={<Car className="h-4 w-4" />}
        title="Carrocería"
        id="bodyType"
        expanded={expandedSections.includes('bodyType')}
        onToggle={() => toggleSection('bodyType')}
      >
        <PillsFilter
          pills={[
            { id: 'sedan', label: 'Sedán' },
            { id: 'suv', label: 'SUV' },
            { id: 'hatchback', label: 'Hatchback' },
            { id: 'pickup', label: 'Pickup' },
            { id: 'coupe', label: 'Coupé' },
            { id: 'minivan', label: 'Minivan' }
          ]}
          value={filters.bodyTypes || []}
          onChange={(value) => handleFilterChange('bodyTypes', value)}
        />
      </FilterSection>

      <FilterSection
        icon={<Fuel className="h-4 w-4" />}
        title="Combustible"
        id="fuelType"
        expanded={expandedSections.includes('fuelType')}
        onToggle={() => toggleSection('fuelType')}
      >
        <PillsFilter
          pills={[
            { id: 'gasoline', label: 'Bencina' },
            { id: 'diesel', label: 'Diésel' },
            { id: 'hybrid', label: 'Híbrido' },
            { id: 'electric', label: 'Eléctrico' }
          ]}
          value={filters.fuelTypes || []}
          onChange={(value) => handleFilterChange('fuelTypes', value)}
        />
      </FilterSection>

      <FilterSection
        icon={<Settings className="h-4 w-4" />}
        title="Transmisión"
        id="transmission"
        expanded={expandedSections.includes('transmission')}
        onToggle={() => toggleSection('transmission')}
      >
        <PillsFilter
          pills={[
            { id: 'manual', label: 'Manual' },
            { id: 'automatic', label: 'Automática' }
          ]}
          value={filters.transmission || []}
          onChange={(value) => handleFilterChange('transmission', value)}
        />
      </FilterSection>

      <FilterSection
        icon={<Shield className="h-4 w-4" />}
        title="Seguridad Mínima"
        id="safety"
        expanded={expandedSections.includes('safety')}
        onToggle={() => toggleSection('safety')}
      >
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleFilterChange('safetyRating', rating)}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-lg border transition-all',
                filters.safetyRating === rating
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-neutral-200 hover:border-neutral-300'
              )}
            >
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{rating}+</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </>
  )

  const insuranceFilters = (
    <>
      <FilterSection
        icon={<DollarSign className="h-4 w-4" />}
        title="Prima Mensual"
        id="price"
        expanded={expandedSections.includes('price')}
        onToggle={() => toggleSection('price')}
      >
        <RangeControl
          min={10000}
          max={200000}
          step={5000}
          value={filters.priceRange || [10000, 200000]}
          onChange={(value) => handleFilterChange('priceRange', value)}
          format={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
      </FilterSection>

      {/* TODO: Add more insurance-specific filters */}
    </>
  )

  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="font-medium">Filtros</span>
        {activeFiltersCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-brand text-white text-xs rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Sidebar */}
      <div className={cn(
        'fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Filtros</h3>
              {resultsCount !== undefined && (
                <p className="text-sm text-neutral-600">{resultsCount} resultados</p>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Cerrar filtros"
            >
              <X className="h-5 w-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Filters Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Sort Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Ordenar por
            </label>
            <select
              value={filters.sortBy || 'score'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterOptions['sortBy'])}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="score">Mejor coincidencia</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              {type === 'vehicles' && (
                <>
                  <option value="safety">Mayor seguridad</option>
                  <option value="efficiency">Mayor eficiencia</option>
                </>
              )}
            </select>
          </div>

          {/* Dynamic Filters */}
          {type === 'vehicles' ? vehicleFilters : insuranceFilters}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 flex gap-3">
          <button
            onClick={clearFilters}
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors font-medium"
          >
            Limpiar filtros
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 px-4 py-2 bg-brand text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
          >
            Aplicar filtros
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

interface FilterSectionProps {
  icon: React.ReactNode
  title: string
  id: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({ icon, title, expanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-neutral-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-neutral-600">{icon}</div>
          <span className="font-medium text-neutral-900">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-neutral-600 transition-transform',
            expanded && 'rotate-180'
          )}
        />
      </button>
      {expanded && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  )
}