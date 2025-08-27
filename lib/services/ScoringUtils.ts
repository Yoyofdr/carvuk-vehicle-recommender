export type WeightedScore = {
  value: number
  weight: number
  label?: string
}

export class ScoringUtils {
  static weightedSum(scores: WeightedScore[]): number {
    const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0)
    
    if (totalWeight === 0) return 0
    
    const weightedTotal = scores.reduce(
      (sum, s) => sum + (s.value * s.weight),
      0
    )
    
    return Math.round((weightedTotal / totalWeight) * 100)
  }

  static combineScores(scores: number[], weights?: number[]): number {
    if (scores.length === 0) return 0
    
    const scoreWeights = weights || scores.map(() => 1)
    
    const weightedScores: WeightedScore[] = scores.map((score, i) => ({
      value: score,
      weight: scoreWeights[i] || 1
    }))
    
    return this.weightedSum(weightedScores)
  }

  static calculatePenalty(hasViolation: boolean, penaltyFactor: number = 0.5): number {
    return hasViolation ? penaltyFactor : 1
  }

  static applyBonus(baseScore: number, hasBonus: boolean, bonusFactor: number = 1.1): number {
    return hasBonus ? Math.min(100, baseScore * bonusFactor) : baseScore
  }
}