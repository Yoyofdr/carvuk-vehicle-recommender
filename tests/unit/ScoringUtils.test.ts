import { describe, it, expect } from 'vitest'
import { ScoringUtils } from '@/lib/services/ScoringUtils'

describe('ScoringUtils', () => {
  describe('weightedSum', () => {
    it('should calculate weighted sum correctly', () => {
      const scores = [
        { value: 1, weight: 0.5 },
        { value: 0.5, weight: 0.3 },
        { value: 0.8, weight: 0.2 }
      ]
      
      // (1 * 0.5 + 0.5 * 0.3 + 0.8 * 0.2) / 1.0 = 0.81
      expect(ScoringUtils.weightedSum(scores)).toBe(81)
    })

    it('should return 0 for empty scores', () => {
      expect(ScoringUtils.weightedSum([])).toBe(0)
    })

    it('should return 0 when total weight is 0', () => {
      const scores = [
        { value: 1, weight: 0 },
        { value: 0.5, weight: 0 }
      ]
      expect(ScoringUtils.weightedSum(scores)).toBe(0)
    })

    it('should handle scores with labels', () => {
      const scores = [
        { value: 1, weight: 0.5, label: 'budget' },
        { value: 0.5, weight: 0.5, label: 'features' }
      ]
      expect(ScoringUtils.weightedSum(scores)).toBe(75)
    })
  })

  describe('combineScores', () => {
    it('should combine scores with equal weights by default', () => {
      const scores = [0.8, 0.6, 0.4]
      // (0.8 + 0.6 + 0.4) / 3 = 0.6
      expect(ScoringUtils.combineScores(scores)).toBe(60)
    })

    it('should combine scores with custom weights', () => {
      const scores = [1, 0.5, 0]
      const weights = [0.5, 0.3, 0.2]
      // (1 * 0.5 + 0.5 * 0.3 + 0 * 0.2) / 1.0 = 0.65
      expect(ScoringUtils.combineScores(scores, weights)).toBe(65)
    })

    it('should return 0 for empty scores', () => {
      expect(ScoringUtils.combineScores([])).toBe(0)
    })
  })

  describe('calculatePenalty', () => {
    it('should apply penalty when violation exists', () => {
      expect(ScoringUtils.calculatePenalty(true)).toBe(0.5)
      expect(ScoringUtils.calculatePenalty(true, 0.7)).toBe(0.7)
    })

    it('should not apply penalty when no violation', () => {
      expect(ScoringUtils.calculatePenalty(false)).toBe(1)
      expect(ScoringUtils.calculatePenalty(false, 0.3)).toBe(1)
    })
  })

  describe('applyBonus', () => {
    it('should apply bonus when applicable', () => {
      expect(ScoringUtils.applyBonus(80, true)).toBe(88)
      expect(ScoringUtils.applyBonus(80, true, 1.2)).toBe(96)
    })

    it('should not exceed 100', () => {
      expect(ScoringUtils.applyBonus(95, true)).toBe(100)
      expect(ScoringUtils.applyBonus(90, true, 1.5)).toBe(100)
    })

    it('should not apply bonus when not applicable', () => {
      expect(ScoringUtils.applyBonus(80, false)).toBe(80)
      expect(ScoringUtils.applyBonus(80, false, 1.5)).toBe(80)
    })
  })
})