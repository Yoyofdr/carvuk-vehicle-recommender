'use client'

import { Search, AlertCircle } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: 'search' | 'alert'
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({
  title = 'No encontramos resultados',
  description = 'Intenta ajustar tus preferencias para ver más opciones',
  icon = 'search',
  action
}: EmptyStateProps) {
  const Icon = icon === 'search' ? Search : AlertCircle
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-neutral-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-neutral-900 text-center mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-neutral-600 text-center max-w-sm">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-4 py-2 bg-brand text-white rounded-xl font-medium hover:opacity-90 transition-opacity focus-ring"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}