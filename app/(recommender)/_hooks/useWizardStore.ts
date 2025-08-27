'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect, useState } from 'react'

type AnswerValue = string | number | string[] | number[] | [number, number] | undefined

interface WizardState {
  vertical: 'vehicles' | 'insurance'
  currentStep: number
  totalSteps: number
  answers: Record<string, AnswerValue>
  resultsCount: number
  
  setVertical: (vertical: 'vehicles' | 'insurance') => void
  setAnswer: (key: string, value: AnswerValue) => void
  setAnswers: (answers: Record<string, AnswerValue>) => void
  setResultsCount: (count: number) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  reset: () => void
  isStepValid: (stepAnswerKey: string) => boolean
}

const useWizardStoreBase = create<WizardState>()(
  persist(
    (set, get) => ({
      vertical: 'vehicles',
      currentStep: 0,
      totalSteps: 7,
      answers: {},
      resultsCount: 0,

      setVertical: (vertical) => {
        set({ 
          vertical, 
          currentStep: 0,
          answers: {},
          resultsCount: 0,
          totalSteps: vertical === 'vehicles' ? 7 : 4
        })
      },

      setAnswer: (key, value) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [key]: value
          }
        }))
      },

      setAnswers: (answers) => {
        set({ answers })
      },

      setResultsCount: (count) => {
        set({ resultsCount: count })
      },

      nextStep: () => {
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1)
        }))
      },

      prevStep: () => {
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0)
        }))
      },

      goToStep: (step) => {
        const { totalSteps } = get()
        set({
          currentStep: Math.max(0, Math.min(step, totalSteps - 1))
        })
      },

      reset: () => {
        set({
          currentStep: 0,
          answers: {},
          resultsCount: 0
        })
      },

      isStepValid: (stepAnswerKey) => {
        const { answers } = get()
        const value = answers[stepAnswerKey]
        
        if (!value) return false
        
        if (Array.isArray(value)) {
          if (value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
            // Range value
            return value[0] > 0 && value[1] > 0
          }
          // Multi-choice
          return value.length > 0
        }
        
        // Single value
        return value !== null && value !== undefined && value !== ''
      }
    }),
    {
      name: 'wizard-storage',
      partialize: (state) => ({
        vertical: state.vertical,
        currentStep: state.currentStep,
        answers: state.answers,
        resultsCount: state.resultsCount
      })
    }
  )
)

// Hook to prevent hydration mismatch
const useWizardStore = () => {
  const [hydrated, setHydrated] = useState(false)
  const store = useWizardStoreBase()
  
  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated ? store : {
    vertical: 'vehicles' as const,
    currentStep: 0,
    totalSteps: 7,
    answers: {},
    resultsCount: 0,
    setVertical: () => {},
    setAnswer: () => {},
    setAnswers: () => {},
    setResultsCount: () => {},
    nextStep: () => {},
    prevStep: () => {},
    goToStep: () => {},
    reset: () => {},
    isStepValid: () => false
  }
}

export default useWizardStore
export { useWizardStoreBase }