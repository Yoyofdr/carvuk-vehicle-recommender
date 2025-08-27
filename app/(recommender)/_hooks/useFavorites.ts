'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Vehicle } from '@/lib/entities/Vehicle'
import { InsuranceProduct } from '@/lib/entities/InsuranceProduct'

export interface FavoriteItem {
  id: string
  type: 'vehicle' | 'insurance'
  data: Vehicle | InsuranceProduct
  savedAt: Date
  notes?: string
  tags?: string[]
}

interface FavoritesState {
  favorites: FavoriteItem[]
  comparisons: string[] // IDs of items in comparison
  
  addFavorite: (item: Omit<FavoriteItem, 'savedAt'>) => void
  removeFavorite: (id: string) => void
  updateFavorite: (id: string, updates: Partial<FavoriteItem>) => void
  isFavorite: (id: string) => boolean
  getFavoritesByType: (type: 'vehicle' | 'insurance') => FavoriteItem[]
  
  addToComparison: (id: string) => void
  removeFromComparison: (id: string) => void
  clearComparison: () => void
  isInComparison: (id: string) => boolean
  getComparisonItems: () => FavoriteItem[]
  
  clearAll: () => void
}

const MAX_FAVORITES = 50
const MAX_COMPARISON = 4

const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      comparisons: [],

      addFavorite: (item) => {
        const { favorites } = get()
        
        // Check if already exists
        if (favorites.some(f => f.id === item.id)) {
          return
        }

        // Limit favorites
        if (favorites.length >= MAX_FAVORITES) {
          // Remove oldest
          const sorted = [...favorites].sort((a, b) => 
            new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()
          )
          set({
            favorites: [
              ...sorted.slice(1),
              { ...item, savedAt: new Date() }
            ]
          })
        } else {
          set({
            favorites: [...favorites, { ...item, savedAt: new Date() }]
          })
        }
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter(f => f.id !== id),
          comparisons: state.comparisons.filter(c => c !== id)
        }))
      },

      updateFavorite: (id, updates) => {
        set((state) => ({
          favorites: state.favorites.map(f =>
            f.id === id ? { ...f, ...updates } : f
          )
        }))
      },

      isFavorite: (id) => {
        return get().favorites.some(f => f.id === id)
      },

      getFavoritesByType: (type) => {
        return get().favorites.filter(f => f.type === type)
      },

      addToComparison: (id) => {
        const { comparisons, favorites } = get()
        
        // Check if item exists in favorites
        const item = favorites.find(f => f.id === id)
        if (!item) return

        // Check if already in comparison
        if (comparisons.includes(id)) return

        // Check comparison limit
        if (comparisons.length >= MAX_COMPARISON) {
          // Remove first item
          set({
            comparisons: [...comparisons.slice(1), id]
          })
        } else {
          set({
            comparisons: [...comparisons, id]
          })
        }
      },

      removeFromComparison: (id) => {
        set((state) => ({
          comparisons: state.comparisons.filter(c => c !== id)
        }))
      },

      clearComparison: () => {
        set({ comparisons: [] })
      },

      isInComparison: (id) => {
        return get().comparisons.includes(id)
      },

      getComparisonItems: () => {
        const { favorites, comparisons } = get()
        return comparisons
          .map(id => favorites.find(f => f.id === id))
          .filter(Boolean) as FavoriteItem[]
      },

      clearAll: () => {
        set({ favorites: [], comparisons: [] })
      }
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        comparisons: state.comparisons
      })
    }
  )
)

export default useFavorites