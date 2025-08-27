'use client'

import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import useFavorites, { FavoriteItem } from '../_hooks/useFavorites'
import { useToast } from './Toast'

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, 'savedAt'>
  className?: string
  showLabel?: boolean
}

export default function FavoriteButton({ item, className, showLabel = false }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { showToast } = useToast()
  const isSaved = isFavorite(item.id)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isSaved) {
      removeFavorite(item.id)
      showToast({
        type: 'info',
        message: 'Eliminado de favoritos'
      })
    } else {
      addFavorite(item)
      showToast({
        type: 'success',
        message: 'Guardado en favoritos'
      })
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'inline-flex items-center gap-2 transition-all',
        isSaved 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-neutral-400 hover:text-neutral-600',
        className
      )}
      aria-label={isSaved ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-pressed={isSaved}
    >
      <Heart 
        className={cn(
          'h-5 w-5 transition-all',
          isSaved && 'fill-current'
        )} 
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isSaved ? 'Guardado' : 'Guardar'}
        </span>
      )}
    </button>
  )
}