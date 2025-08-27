'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Shield } from 'lucide-react'
import useWizardStore from './_hooks/useWizardStore'
import Stepper from './components/Stepper'
import { VehicleSteps, InsuranceSteps } from '@/lib/schemas/steps'

interface RecommenderLayoutProps {
  children: ReactNode
}

export default function RecommenderLayout({ children }: RecommenderLayoutProps) {
  const pathname = usePathname()
  const { vertical, currentStep, setVertical, reset } = useWizardStore()
  
  const isResultsPage = pathname?.includes('/results')
  const steps = vertical === 'vehicles' ? VehicleSteps : InsuranceSteps
  const totalSteps = steps.length

  const handleVerticalChange = (newVertical: 'vehicles' | 'insurance') => {
    if (newVertical !== vertical) {
      reset()
      setVertical(newVertical)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-brand">
                Carvuk
              </Link>
              
              {/* Vertical Selector */}
              <div className="hidden sm:flex items-center gap-2 p-1 bg-neutral-100 rounded-xl">
                <button
                  onClick={() => handleVerticalChange('vehicles')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                    vertical === 'vehicles'
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Car className="h-4 w-4" />
                  <span className="text-sm font-medium">Vehículos</span>
                </button>
                <button
                  onClick={() => handleVerticalChange('insurance')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                    vertical === 'insurance'
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Seguros</span>
                </button>
              </div>
            </div>

            {/* Progress Indicator */}
            {!isResultsPage && (
              <div className="hidden md:block w-64">
                <Stepper current={currentStep} total={totalSteps} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Progress */}
      {!isResultsPage && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3">
          <Stepper current={currentStep} total={totalSteps} />
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}