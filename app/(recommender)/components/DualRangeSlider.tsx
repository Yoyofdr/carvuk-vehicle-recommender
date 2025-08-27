'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface DualRangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  label?: string
  format?: (value: number) => string
  unit?: string
  className?: string
}

export default function DualRangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  format = (v) => v.toLocaleString('es-CL'),
  unit = '',
  className
}: DualRangeSliderProps) {
  const [minVal, setMinVal] = useState(value[0])
  const [maxVal, setMaxVal] = useState(value[1])
  const minValRef = useRef(value[0])
  const maxValRef = useRef(value[1])
  const range = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  )

  // Set width of the range to change from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal)
    const maxPercent = getPercent(maxValRef.current)

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minVal, getPercent])

  // Set width of the range to change from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current)
    const maxPercent = getPercent(maxVal)

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [maxVal, getPercent])

  // Only update parent when dragging stops or input changes
  useEffect(() => {
    if (!isDragging.current) {
      // Only call onChange if values actually changed
      if (minVal !== value[0] || maxVal !== value[1]) {
        onChange([minVal, maxVal])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minVal, maxVal])

  // Sync with external value changes - but only if they're different
  useEffect(() => {
    if (value[0] !== minVal && !isDragging.current) {
      setMinVal(value[0])
      minValRef.current = value[0]
    }
    if (value[1] !== maxVal && !isDragging.current) {
      setMaxVal(value[1])
      maxValRef.current = value[1]
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    if (!isNaN(newValue) && newValue >= min && newValue <= maxVal - step) {
      setMinVal(newValue)
      minValRef.current = newValue
    }
  }

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    if (!isNaN(newValue) && newValue <= max && newValue >= minVal + step) {
      setMaxVal(newValue)
      maxValRef.current = newValue
    }
  }

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - step)
    setMinVal(value)
    minValRef.current = value
  }

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + step)
    setMaxVal(value)
    maxValRef.current = value
  }

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-4">
          {label}
        </label>
      )}

      {/* Input fields */}
      <div className="flex gap-4 items-center mb-8">
        <div className="flex-1">
          <label className="text-xs text-neutral-600 mb-1 block">Valor mínimo</label>
          <div className="relative">
            <input
              type="number"
              min={min}
              max={maxVal - step}
              step={step}
              value={minVal}
              onChange={handleMinInputChange}
              className="w-full px-3 py-2 pr-12 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40 text-sm"
            />
            {unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">
                {unit}
              </span>
            )}
          </div>
        </div>

        <span className="text-neutral-400 mt-5">—</span>

        <div className="flex-1">
          <label className="text-xs text-neutral-600 mb-1 block">Valor máximo</label>
          <div className="relative">
            <input
              type="number"
              min={minVal + step}
              max={max}
              step={step}
              value={maxVal}
              onChange={handleMaxInputChange}
              className="w-full px-3 py-2 pr-12 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40 text-sm"
            />
            {unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">
                {unit}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative mb-6">
        {/* Background track */}
        <div className="h-2 bg-neutral-200 rounded-full" />
        
        {/* Colored range track */}
        <div
          ref={range}
          className="absolute h-2 bg-brand rounded-full"
          style={{ top: 0 }}
        />

        {/* Left slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinSliderChange}
          onMouseDown={() => { isDragging.current = true }}
          onMouseUp={() => { 
            isDragging.current = false
            onChange([minVal, maxVal])
          }}
          onTouchStart={() => { isDragging.current = true }}
          onTouchEnd={() => { 
            isDragging.current = false
            onChange([minVal, maxVal])
          }}
          className={cn(
            "absolute w-full h-2 top-0 bg-transparent pointer-events-none",
            "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
            "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2",
            "[&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto",
            "[&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:hover:shadow-md",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5",
            "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2",
            "[&::-moz-range-thumb]:border-brand [&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto",
            "[&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:hover:shadow-md",
            "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-solid"
          )}
          style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
        />

        {/* Right slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxSliderChange}
          onMouseDown={() => { isDragging.current = true }}
          onMouseUp={() => { 
            isDragging.current = false
            onChange([minVal, maxVal])
          }}
          onTouchStart={() => { isDragging.current = true }}
          onTouchEnd={() => { 
            isDragging.current = false
            onChange([minVal, maxVal])
          }}
          className={cn(
            "absolute w-full h-2 top-0 bg-transparent pointer-events-none",
            "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
            "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2",
            "[&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto",
            "[&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:hover:shadow-md",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5",
            "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2",
            "[&::-moz-range-thumb]:border-brand [&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto",
            "[&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:hover:shadow-md",
            "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-solid"
          )}
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Value labels */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-neutral-700">
          <span className="font-semibold text-brand">
            ${format(minVal)}
          </span>
          <span className="text-neutral-500 ml-1">{unit}</span>
        </div>
        
        <div className="text-xs text-neutral-500">
          {Math.round((maxVal - minVal) / step)} opciones disponibles
        </div>

        <div className="text-sm text-neutral-700">
          <span className="font-semibold text-brand">
            ${format(maxVal)}
          </span>
          <span className="text-neutral-500 ml-1">{unit}</span>
        </div>
      </div>
    </div>
  )
}