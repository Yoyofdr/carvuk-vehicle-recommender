'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface RangeControlProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  label?: string
  format?: (value: number) => string
  unit?: string
}

export default function RangeControl({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  format = (v) => v.toLocaleString('es-CL'),
  unit = ''
}: RangeControlProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = useCallback((newMin: number) => {
    // Ensure min doesn't exceed max
    const validMin = Math.min(Math.max(newMin, min), localValue[1] - step)
    const newValue: [number, number] = [validMin, localValue[1]]
    setLocalValue(newValue)
    onChange(newValue)
  }, [localValue, min, step, onChange])

  const handleMaxChange = useCallback((newMax: number) => {
    // Ensure max doesn't go below min
    const validMax = Math.max(Math.min(newMax, max), localValue[0] + step)
    const newValue: [number, number] = [localValue[0], validMax]
    setLocalValue(newValue)
    onChange(newValue)
  }, [localValue, max, step, onChange])

  const handleInputMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value)
    if (!isNaN(newMin)) {
      handleMinChange(newMin)
    }
  }

  const handleInputMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value)
    if (!isNaN(newMax)) {
      handleMaxChange(newMax)
    }
  }

  const minPercent = ((localValue[0] - min) / (max - min)) * 100
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100

  // Handle slider interaction
  const handleSliderClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = (x / rect.width) * 100
    const value = min + (percent / 100) * (max - min)
    
    // Determine which handle is closer
    const distToMin = Math.abs(value - localValue[0])
    const distToMax = Math.abs(value - localValue[1])
    
    if (distToMin < distToMax) {
      handleMinChange(Math.round(value / step) * step)
    } else {
      handleMaxChange(Math.round(value / step) * step)
    }
  }, [min, max, step, localValue, handleMinChange, handleMaxChange])

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-neutral-700">{label}</label>
      )}
      
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label htmlFor="min-input" className="sr-only">Valor mínimo</label>
          <div className="relative">
            <input
              id="min-input"
              type="number"
              min={min}
              max={localValue[1] - step}
              step={step}
              value={localValue[0]}
              onChange={handleInputMinChange}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                {unit}
              </span>
            )}
          </div>
        </div>
        
        <span className="text-neutral-400">—</span>
        
        <div className="flex-1">
          <label htmlFor="max-input" className="sr-only">Valor máximo</label>
          <div className="relative">
            <input
              id="max-input"
              type="number"
              min={localValue[0] + step}
              max={max}
              step={step}
              value={localValue[1]}
              onChange={handleInputMaxChange}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                {unit}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="relative py-4">
        {/* Track */}
        <div 
          className="relative h-2 bg-neutral-200 rounded-full cursor-pointer"
          onClick={handleSliderClick}
        >
          {/* Active track */}
          <div
            className="absolute h-full bg-brand rounded-full pointer-events-none"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          />
          
          {/* Min slider handle */}
          <div className="absolute w-full h-full">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={localValue[0]}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              onMouseDown={() => setIsDragging('min')}
              onMouseUp={() => setIsDragging(null)}
              className={cn(
                "absolute w-full h-full opacity-0 cursor-pointer pointer-events-none",
                "[&::-webkit-slider-thumb]:pointer-events-auto",
                "[&::-moz-range-thumb]:pointer-events-auto",
                isDragging === 'min' && 'z-20'
              )}
              style={{ 
                pointerEvents: isDragging === 'min' ? 'auto' : 'none',
                zIndex: isDragging === 'min' ? 20 : 10 
              }}
              aria-label="Valor mínimo del rango"
            />
          </div>
          
          {/* Max slider handle */}
          <div className="absolute w-full h-full">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={localValue[1]}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              onMouseDown={() => setIsDragging('max')}
              onMouseUp={() => setIsDragging(null)}
              className={cn(
                "absolute w-full h-full opacity-0 cursor-pointer pointer-events-none",
                "[&::-webkit-slider-thumb]:pointer-events-auto",
                "[&::-moz-range-thumb]:pointer-events-auto",
                isDragging === 'max' && 'z-20'
              )}
              style={{ 
                pointerEvents: isDragging === 'max' ? 'auto' : 'none',
                zIndex: isDragging === 'max' ? 20 : 10 
              }}
              aria-label="Valor máximo del rango"
            />
          </div>
          
          {/* Visual handles */}
          <div
            className={cn(
              "absolute w-5 h-5 bg-white border-2 border-brand rounded-full -mt-1.5 -ml-2.5 shadow-sm transition-transform",
              isDragging === 'min' && "scale-125 shadow-lg",
              "hover:scale-110"
            )}
            style={{ left: `${minPercent}%` }}
          />
          <div
            className={cn(
              "absolute w-5 h-5 bg-white border-2 border-brand rounded-full -mt-1.5 -ml-2.5 shadow-sm transition-transform",
              isDragging === 'max' && "scale-125 shadow-lg",
              "hover:scale-110"
            )}
            style={{ left: `${maxPercent}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between text-sm text-neutral-600">
        <span className="font-medium">
          ${format(localValue[0])} {unit}
        </span>
        <span className="text-xs text-neutral-400 self-center">
          {Math.round((localValue[1] - localValue[0]) / step)} opciones disponibles
        </span>
        <span className="font-medium">
          ${format(localValue[1])} {unit}
        </span>
      </div>
    </div>
  )
}