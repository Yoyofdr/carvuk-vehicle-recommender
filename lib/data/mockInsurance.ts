import { InsuranceProduct } from '../entities/InsuranceProduct'
import { InsurancePremium } from '../entities/InsurancePremium'

export const mockInsuranceProducts: InsuranceProduct[] = [
  {
    id: 'ins1',
    provider: 'HDI Seguros',
    productName: 'HDI Auto Plus',
    coverages: [
      { type: 'rc', limitUF: 1500, included: true },
      { type: 'damage', included: true, deductibleUF: 5 },
      { type: 'theft', included: true, deductibleUF: 5 },
      { type: 'glass', included: true, deductibleUF: 0 },
      { type: 'natural_disaster', included: true, deductibleUF: 5 }
    ],
    deductibleUF: 5,
    features: {
      workshopType: 'brand',
      replacementCar: true,
      roadAssistance: true,
      internationalCoverage: true
    },
    rating: 5
  },
  {
    id: 'ins2',
    provider: 'SURA',
    productName: 'Auto Seguro SURA',
    coverages: [
      { type: 'rc', limitUF: 1000, included: true },
      { type: 'damage', included: true, deductibleUF: 8 },
      { type: 'theft', included: true, deductibleUF: 8 },
      { type: 'glass', included: true, deductibleUF: 2 },
      { type: 'natural_disaster', included: false }
    ],
    deductibleUF: 8,
    features: {
      workshopType: 'preferred',
      replacementCar: false,
      roadAssistance: true,
      internationalCoverage: false
    },
    rating: 4
  },
  {
    id: 'ins3',
    provider: 'Mapfre',
    productName: 'Mapfre Auto Premium',
    coverages: [
      { type: 'rc', limitUF: 2000, included: true },
      { type: 'damage', included: true, deductibleUF: 3 },
      { type: 'theft', included: true, deductibleUF: 3 },
      { type: 'glass', included: true, deductibleUF: 0 },
      { type: 'natural_disaster', included: true, deductibleUF: 3 },
      { type: 'personal_accident', limitUF: 500, included: true }
    ],
    deductibleUF: 3,
    features: {
      workshopType: 'brand',
      replacementCar: true,
      roadAssistance: true,
      internationalCoverage: true
    },
    rating: 5
  },
  {
    id: 'ins4',
    provider: 'Consorcio',
    productName: 'Seguro Auto Consorcio',
    coverages: [
      { type: 'rc', limitUF: 1000, included: true },
      { type: 'damage', included: true, deductibleUF: 10 },
      { type: 'theft', included: true, deductibleUF: 10 },
      { type: 'glass', included: false },
      { type: 'natural_disaster', included: false }
    ],
    deductibleUF: 10,
    features: {
      workshopType: 'any',
      replacementCar: false,
      roadAssistance: false,
      internationalCoverage: false
    },
    rating: 3
  },
  {
    id: 'ins5',
    provider: 'Liberty',
    productName: 'Liberty Auto Full',
    coverages: [
      { type: 'rc', limitUF: 1500, included: true },
      { type: 'damage', included: true, deductibleUF: 6 },
      { type: 'theft', included: true, deductibleUF: 6 },
      { type: 'glass', included: true, deductibleUF: 1 },
      { type: 'natural_disaster', included: true, deductibleUF: 6 }
    ],
    deductibleUF: 6,
    features: {
      workshopType: 'preferred',
      replacementCar: true,
      roadAssistance: true,
      internationalCoverage: false
    },
    rating: 4
  },
  {
    id: 'ins6',
    provider: 'BCI Seguros',
    productName: 'BCI Auto Protegido',
    coverages: [
      { type: 'rc', limitUF: 1200, included: true },
      { type: 'damage', included: true, deductibleUF: 7 },
      { type: 'theft', included: true, deductibleUF: 7 },
      { type: 'glass', included: true, deductibleUF: 0 },
      { type: 'natural_disaster', included: true, deductibleUF: 7 }
    ],
    deductibleUF: 7,
    features: {
      workshopType: 'brand',
      replacementCar: false,
      roadAssistance: true,
      internationalCoverage: true
    },
    rating: 4
  },
  {
    id: 'ins7',
    provider: 'Chilena Consolidada',
    productName: 'Auto Seguro Total',
    coverages: [
      { type: 'rc', limitUF: 1000, included: true },
      { type: 'damage', included: true, deductibleUF: 9 },
      { type: 'theft', included: true, deductibleUF: 9 },
      { type: 'glass', included: true, deductibleUF: 3 },
      { type: 'natural_disaster', included: false }
    ],
    deductibleUF: 9,
    features: {
      workshopType: 'preferred',
      replacementCar: false,
      roadAssistance: true,
      internationalCoverage: false
    },
    rating: 3
  },
  {
    id: 'ins8',
    provider: 'Zurich',
    productName: 'Zurich Auto Elite',
    coverages: [
      { type: 'rc', limitUF: 2500, included: true },
      { type: 'damage', included: true, deductibleUF: 4 },
      { type: 'theft', included: true, deductibleUF: 4 },
      { type: 'glass', included: true, deductibleUF: 0 },
      { type: 'natural_disaster', included: true, deductibleUF: 4 },
      { type: 'personal_accident', limitUF: 1000, included: true }
    ],
    deductibleUF: 4,
    features: {
      workshopType: 'brand',
      replacementCar: true,
      roadAssistance: true,
      internationalCoverage: true
    },
    rating: 5
  }
]

export const mockInsurancePremiums: InsurancePremium[] = [
  // Premiums for vehicle v1 (Toyota Corolla)
  {
    productId: 'ins1',
    vehicleId: 'v1',
    monthlyPremiumCLP: 45000,
    annualPremiumCLP: 540000,
    validUntil: new Date('2025-12-31')
  },
  {
    productId: 'ins2',
    vehicleId: 'v1',
    monthlyPremiumCLP: 35000,
    annualPremiumCLP: 420000,
    validUntil: new Date('2025-12-31')
  },
  {
    productId: 'ins3',
    vehicleId: 'v1',
    monthlyPremiumCLP: 55000,
    annualPremiumCLP: 660000,
    validUntil: new Date('2025-12-31')
  },
  {
    productId: 'ins4',
    vehicleId: 'v1',
    monthlyPremiumCLP: 25000,
    annualPremiumCLP: 300000,
    validUntil: new Date('2025-12-31')
  },
  {
    productId: 'ins5',
    vehicleId: 'v1',
    monthlyPremiumCLP: 42000,
    annualPremiumCLP: 504000,
    validUntil: new Date('2025-12-31')
  },
  {
    productId: 'ins6',
    vehicleId: 'v1',
    monthlyPremiumCLP: 40000,
    annualPremiumCLP: 480000,
    validUntil: new Date('2025-12-31')
  },
  {
    productId: 'ins7',
    vehicleId: 'v1',
    monthlyPremiumCLP: 32000,
    annualPremiumCLP: 384000,
    validUntil: new Date('2025-12-31')
  },
  {
    productId: 'ins8',
    vehicleId: 'v1',
    monthlyPremiumCLP: 65000,
    annualPremiumCLP: 780000,
    validUntil: new Date('2025-12-31')
  },
  // Generic premiums for other vehicles (simplified)
  ...Array.from({ length: 14 }, (_, i) => {
    const vehicleId = `v${i + 2}`
    return mockInsuranceProducts.map(product => ({
      productId: product.id,
      vehicleId,
      monthlyPremiumCLP: Math.round(25000 + Math.random() * 40000),
      annualPremiumCLP: 0, // Will be calculated
      validUntil: new Date('2025-12-31')
    }))
  }).flat().map(p => ({
    ...p,
    annualPremiumCLP: p.monthlyPremiumCLP * 12
  }))
]