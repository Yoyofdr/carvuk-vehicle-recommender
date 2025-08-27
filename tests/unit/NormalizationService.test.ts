import { describe, it, expect } from 'vitest'
import { NormalizationService } from '@/lib/services/NormalizationService'

describe('NormalizationService', () => {
  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(NormalizationService.clamp(5, 0, 10)).toBe(5)
      expect(NormalizationService.clamp(-5, 0, 10)).toBe(0)
      expect(NormalizationService.clamp(15, 0, 10)).toBe(10)
    })
  })

  describe('normalize', () => {
    it('should normalize values to 0-1 range', () => {
      expect(NormalizationService.normalize(5, 0, 10)).toBe(0.5)
      expect(NormalizationService.normalize(0, 0, 10)).toBe(0)
      expect(NormalizationService.normalize(10, 0, 10)).toBe(1)
      expect(NormalizationService.normalize(15, 0, 10)).toBe(1)
    })

    it('should handle equal min and max', () => {
      expect(NormalizationService.normalize(5, 5, 5)).toBe(0)
    })
  })

  describe('normalizeInverse', () => {
    it('should return inverse normalized values', () => {
      expect(NormalizationService.normalizeInverse(0, 0, 10)).toBe(1)
      expect(NormalizationService.normalizeInverse(10, 0, 10)).toBe(0)
      expect(NormalizationService.normalizeInverse(5, 0, 10)).toBe(0.5)
    })
  })

  describe('normalizeBoolean', () => {
    it('should convert boolean to 0 or 1', () => {
      expect(NormalizationService.normalizeBoolean(true)).toBe(1)
      expect(NormalizationService.normalizeBoolean(false)).toBe(0)
    })
  })

  describe('normalizeMatch', () => {
    it('should return 1 for matches and 0 for non-matches', () => {
      expect(NormalizationService.normalizeMatch('sedan', 'sedan')).toBe(1)
      expect(NormalizationService.normalizeMatch('sedan', 'suv')).toBe(0)
      expect(NormalizationService.normalizeMatch(5, 5)).toBe(1)
      expect(NormalizationService.normalizeMatch(5, 10)).toBe(0)
    })
  })

  describe('normalizePartialMatch', () => {
    it('should calculate partial match ratio', () => {
      expect(NormalizationService.normalizePartialMatch(
        ['sedan', 'suv'],
        ['sedan', 'suv', 'hatchback']
      )).toBeCloseTo(0.67, 1)
      
      expect(NormalizationService.normalizePartialMatch(
        ['sedan'],
        ['sedan']
      )).toBe(1)
      
      expect(NormalizationService.normalizePartialMatch(
        [],
        ['sedan']
      )).toBe(0)
      
      expect(NormalizationService.normalizePartialMatch(
        ['sedan'],
        []
      )).toBe(1)
    })
  })

  describe('normalizeRange', () => {
    it('should normalize values within range', () => {
      expect(NormalizationService.normalizeRange(50, [0, 100])).toBe(1)
      expect(NormalizationService.normalizeRange(0, [0, 100])).toBe(0)
      expect(NormalizationService.normalizeRange(100, [0, 100])).toBe(0)
      expect(NormalizationService.normalizeRange(25, [0, 100])).toBe(0.5)
      expect(NormalizationService.normalizeRange(-10, [0, 100])).toBe(0)
      expect(NormalizationService.normalizeRange(110, [0, 100])).toBe(0)
    })
  })
})