'use client'

interface StepperProps {
  current: number
  total: number
}

export default function Stepper({ current, total }: StepperProps) {
  const percentage = Math.round(((current + 1) / total) * 100)

  return (
    <div className="w-full" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-neutral-600">Progreso</span>
        <span className="text-sm font-medium text-neutral-800">{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
        <div 
          className="h-full bg-brand transition-all duration-300 ease-out" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  )
}