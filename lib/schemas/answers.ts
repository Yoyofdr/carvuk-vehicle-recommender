import { z } from 'zod'

export const vehicleAnswersSchema = z.object({
  vehicleCondition: z.enum(['new', 'used']).optional(),
  monthlyBudget: z.tuple([z.number(), z.number()]).optional(),
  downPayment: z.tuple([z.number(), z.number()]).optional(),
  bodyTypes: z.array(z.enum(['sedan', 'suv', 'hatchback', 'pickup', 'coupe', 'minivan', 'wagon', 'convertible', 'sports'])).min(1),
  fuelTypes: z.array(z.enum(['gasoline', 'diesel', 'hybrid', 'electric'])).optional(),
  transmission: z.enum(['manual', 'automatic', 'any']).optional(),
  usage: z.array(z.enum(['city', 'highway', 'family', 'work', 'offroad', 'sport'])).optional()
})

export const insuranceAnswersSchema = z.object({
  monthlyBudget: z.tuple([z.number(), z.number()]),
  deductibleRange: z.tuple([z.number(), z.number()]),
  minCoverages: z.array(z.enum(['rc-1000', 'damage', 'theft', 'glass', 'natural'])).min(1),
  preferences: z.array(z.enum([
    'brand-workshop',
    'replacement-car',
    'road-assistance',
    'international',
    'zero-deductible-glass'
  ])).optional()
})

export type VehicleAnswers = z.infer<typeof vehicleAnswersSchema>
export type InsuranceAnswers = z.infer<typeof insuranceAnswersSchema>