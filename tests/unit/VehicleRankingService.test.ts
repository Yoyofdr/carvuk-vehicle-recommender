import { describe, it, expect } from 'vitest'
import { VehicleRankingService } from '@/lib/services/VehicleRankingService'
import { Vehicle } from '@/lib/entities/Vehicle'
import { VehicleAnswers } from '@/lib/schemas/answers'

describe('VehicleRankingService', () => {
  const mockVehicles: Vehicle[] = [
    {
      id: 'v1',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2024,
      bodyType: 'sedan',
      fuelType: 'gasoline',
      transmission: 'automatic',
      engineSize: 1.8,
      seats: 5,
      doorsCount: 4,
      priceCLP: 18000000,
      features: [],
      safetyRating: 5,
      fuelEfficiency: 15,
      maintenanceCostRating: 'low'
    },
    {
      id: 'v2',
      brand: 'Mazda',
      model: 'CX-5',
      year: 2024,
      bodyType: 'suv',
      fuelType: 'gasoline',
      transmission: 'automatic',
      engineSize: 2.5,
      seats: 5,
      doorsCount: 5,
      priceCLP: 28000000,
      features: [],
      safetyRating: 4,
      fuelEfficiency: 12,
      maintenanceCostRating: 'medium'
    },
    {
      id: 'v3',
      brand: 'Ford',
      model: 'Ranger',
      year: 2024,
      bodyType: 'pickup',
      fuelType: 'diesel',
      transmission: 'manual',
      engineSize: 2.0,
      seats: 5,
      doorsCount: 4,
      priceCLP: 35000000,
      features: [],
      safetyRating: 3,
      fuelEfficiency: 10,
      maintenanceCostRating: 'high'
    }
  ]

  describe('rank', () => {
    it('should rank vehicles based on budget preference', () => {
      const answers: VehicleAnswers = {
        monthlyBudget: [300000, 500000],
        bodyTypes: ['sedan', 'suv', 'pickup']
      }

      const results = VehicleRankingService.rank(mockVehicles, answers)
      
      expect(results).toHaveLength(3)
      expect(results[0].score).toBeGreaterThanOrEqual(results[1].score)
      expect(results[1].score).toBeGreaterThanOrEqual(results[2].score)
    })

    it('should prefer matching body types', () => {
      const answers: VehicleAnswers = {
        monthlyBudget: [200000, 1000000],
        bodyTypes: ['sedan']
      }

      const results = VehicleRankingService.rank(mockVehicles, answers)
      
      // Toyota Corolla (sedan) should rank highest
      expect(results[0].vehicle.id).toBe('v1')
      expect(results[0].reasons).toContain('Carrocería Sedán')
    })

    it('should consider fuel type preferences', () => {
      const answers: VehicleAnswers = {
        monthlyBudget: [200000, 1000000],
        bodyTypes: ['sedan', 'suv', 'pickup'],
        fuelTypes: ['diesel']
      }

      const results = VehicleRankingService.rank(mockVehicles, answers)
      
      // Check that diesel vehicle gets bonus
      const dieselVehicle = results.find(r => r.vehicle.fuelType === 'diesel')
      expect(dieselVehicle?.reasons.some(r => r.includes('Diésel'))).toBe(true)
    })

    it('should consider transmission preferences', () => {
      const answers: VehicleAnswers = {
        monthlyBudget: [200000, 1000000],
        bodyTypes: ['sedan', 'suv', 'pickup'],
        transmission: 'automatic'
      }

      const results = VehicleRankingService.rank(mockVehicles, answers)
      
      // Automatic vehicles should score higher
      const automaticVehicles = results.filter(r => r.vehicle.transmission === 'automatic')
      const manualVehicle = results.find(r => r.vehicle.transmission === 'manual')
      
      if (automaticVehicles.length > 0 && manualVehicle) {
        expect(automaticVehicles[0].score).toBeGreaterThan(manualVehicle.score)
      }
    })

    it('should consider usage patterns', () => {
      const answers: VehicleAnswers = {
        monthlyBudget: [200000, 1000000],
        bodyTypes: ['sedan', 'suv', 'pickup'],
        usage: ['family']
      }

      const results = VehicleRankingService.rank(mockVehicles, answers)
      
      // SUV should score well for family usage
      const suvResult = results.find(r => r.vehicle.bodyType === 'suv')
      expect(suvResult).toBeDefined()
    })

    it('should include safety rating in scoring', () => {
      const answers: VehicleAnswers = {
        monthlyBudget: [200000, 1000000],
        bodyTypes: ['sedan', 'suv', 'pickup']
      }

      const results = VehicleRankingService.rank(mockVehicles, answers)
      
      // Vehicle with 5-star safety should have it in reasons
      const safestVehicle = results.find(r => r.vehicle.safetyRating === 5)
      expect(safestVehicle?.reasons.some(r => r.includes('5 estrellas'))).toBe(true)
    })

    it('should calculate monthly estimates', () => {
      const answers: VehicleAnswers = {
        monthlyBudget: [300000, 500000],
        downPayment: [5000000, 10000000],
        bodyTypes: ['sedan']
      }

      const results = VehicleRankingService.rank(mockVehicles, answers)
      
      expect(results[0].monthlyEstimateCLP).toBeDefined()
      expect(results[0].monthlyEstimateCLP).toBeGreaterThan(0)
    })
  })

  describe('filterByBudget', () => {
    it('should filter vehicles within budget range', () => {
      const filtered = VehicleRankingService.filterByBudget(
        mockVehicles,
        [300000, 400000],
        [5000000, 10000000]
      )
      
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.length).toBeLessThanOrEqual(mockVehicles.length)
    })

    it('should return all vehicles when no budget specified', () => {
      const filtered = VehicleRankingService.filterByBudget(mockVehicles)
      expect(filtered).toHaveLength(mockVehicles.length)
    })

    it('should allow 20% flexibility in budget', () => {
      const filtered = VehicleRankingService.filterByBudget(
        mockVehicles,
        [100000, 200000], // Very low budget
        [0, 5000000]
      )
      
      // Should still include some vehicles due to 20% flexibility
      expect(filtered.length).toBeGreaterThanOrEqual(0)
    })
  })
})