'use client'

import { cn } from '@/lib/utils'

interface Pill {
  id: string
  label: string
}

interface PillsFilterProps {
  pills: Pill[]
  value: string[]
  onChange: (value: string[]) => void
  label?: string
}

export default function PillsFilter({ pills, value, onChange, label }: PillsFilterProps) {
  const handleToggle = (pillId: string) => {
    if (value.includes(pillId)) {
      onChange(value.filter(v => v !== pillId))
    } else {
      onChange([...value, pillId])
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-3">{label}</label>
      )}
      <div className="flex flex-wrap gap-2">
        {pills.map((pill) => (
          <button
            key={pill.id}
            type="button"
            onClick={() => handleToggle(pill.id)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-all focus-ring',
              value.includes(pill.id)
                ? 'bg-brand/10 border-brand text-brand'
                : 'bg-white border-neutral-300 text-neutral-700 hover:border-brand/50'
            )}
            aria-pressed={value.includes(pill.id)}
          >
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  )
}