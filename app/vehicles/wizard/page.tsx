'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VehicleWizardPage() {
  const router = useRouter()

  useEffect(() => {
    // For now, redirect to results with sample data
    // In production, this would be the actual wizard flow
    router.push('/results')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="h-8 w-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Preparando el asistente...</p>
        </div>
      </div>
    </div>
  )
}