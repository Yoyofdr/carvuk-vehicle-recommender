'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Choice {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface ChoiceGridProps {
  choices: Choice[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  columns?: 2 | 3 | 4
}

export default function ChoiceGrid({ 
  choices, 
  value, 
  onChange, 
  multiple = false,
  columns = 3 
}: ChoiceGridProps) {
  const handleToggle = (choiceId: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      if (currentValues.includes(choiceId)) {
        onChange(currentValues.filter(v => v !== choiceId))
      } else {
        onChange([...currentValues, choiceId])
      }
    } else {
      onChange(choiceId)
    }
  }

  const isSelected = (choiceId: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(choiceId)
    }
    return value === choiceId
  }

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-3', gridCols[columns])}>
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          onClick={() => handleToggle(choice.id)}
          className={cn(
            'relative rounded-xl border-2 p-4 text-left transition-all hover:border-brand/50 focus-ring',
            isSelected(choice.id)
              ? 'border-brand bg-brand/5'
              : 'border-neutral-200 bg-white hover:bg-neutral-50'
          )}
          aria-pressed={isSelected(choice.id)}
        >
          {isSelected(choice.id) && (
            <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-brand flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
          {choice.icon && (
            <div className="mb-3 text-neutral-600">{choice.icon}</div>
          )}
          <div className="font-medium text-neutral-900">{choice.label}</div>
          {choice.description && (
            <div className="mt-1 text-sm text-neutral-600">{choice.description}</div>
          )}
        </button>
      ))}
    </div>
  )
}