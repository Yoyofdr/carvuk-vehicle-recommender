export class NormalizationService {
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
  }

  static normalize(value: number, min: number, max: number): number {
    if (max === min) return 0
    return this.clamp((value - min) / (max - min), 0, 1)
  }

  static normalizeInverse(value: number, min: number, max: number): number {
    return 1 - this.normalize(value, min, max)
  }

  static normalizeBoolean(value: boolean): number {
    return value ? 1 : 0
  }

  static normalizeMatch<T>(value: T, target: T): number {
    return value === target ? 1 : 0
  }

  static normalizePartialMatch<T>(values: T[], targets: T[]): number {
    if (targets.length === 0) return 1
    if (values.length === 0) return 0
    
    const matches = values.filter(v => targets.includes(v)).length
    return matches / targets.length
  }

  static normalizeRange(value: number, range: [number, number]): number {
    const [min, max] = range
    if (value < min || value > max) return 0
    
    const distanceFromMid = Math.abs(value - (min + max) / 2)
    const maxDistance = (max - min) / 2
    
    return this.normalizeInverse(distanceFromMid, 0, maxDistance)
  }
}