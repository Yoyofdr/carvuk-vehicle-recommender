'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Star, Check, TrendingUp } from 'lucide-react'

interface ResultCardProps {
  title: string
  subtitle?: string
  image?: string
  price: string
  monthlyPrice?: string
  score: number
  reasons: string[]
  features?: string[]
  ctaLabel?: string
  onCtaClick?: () => void
  highlighted?: boolean
  valuationData?: {
    brand: string
    model: string
    year: number
  }
  onValuationClick?: () => void
}

export default function ResultCard({
  title,
  subtitle,
  image,
  price,
  monthlyPrice,
  score,
  reasons,
  features,
  ctaLabel = 'Ver detalles',
  onCtaClick,
  highlighted = false,
  valuationData,
  onValuationClick
}: ResultCardProps) {
  return (
    <article className={cn(
      'rounded-2xl border bg-white shadow-card overflow-hidden transition-all hover:shadow-lg',
      highlighted ? 'border-brand ring-2 ring-brand/20' : 'border-neutral-200'
    )}>
      {highlighted && (
        <div className="bg-brand text-white text-center py-2 text-sm font-medium">
          Mejor opción para ti
        </div>
      )}
      
      {image && (
        <div className="aspect-[16/9] bg-neutral-50 relative">
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-neutral-900">{score}/100</span>
          </div>
        </div>
      )}
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-600 mt-0.5">{subtitle}</p>}
        
        <div className="mt-4 flex items-baseline gap-2">
          <div className="text-2xl font-bold text-neutral-900">{price}</div>
          {monthlyPrice && (
            <div className="text-sm text-neutral-600">o {monthlyPrice}/mes</div>
          )}
        </div>
        
        {reasons.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {reasons.map((reason, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-brand/10 text-brand border border-brand/20"
              >
                <Check className="h-3 w-3" />
                {reason}
              </span>
            ))}
          </div>
        )}
        
        {features && features.length > 0 && (
          <ul className="mt-4 space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
        
        <div className="mt-5 flex gap-2">
          <button
            onClick={onCtaClick}
            className="flex-1 bg-brand text-white rounded-2xl px-4 py-2.5 font-medium hover:opacity-90 active:opacity-80 transition-opacity focus-ring"
          >
            {ctaLabel}
          </button>
          {valuationData && onValuationClick && (
            <button
              onClick={onValuationClick}
              className="px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-2xl font-medium hover:bg-neutral-200 transition-all flex items-center gap-2"
              title="Ver tasación"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="sr-only">Tasación</span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}