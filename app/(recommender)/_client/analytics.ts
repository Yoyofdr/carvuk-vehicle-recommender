'use client'

type EventName = 
  | 'recommender_step_view'
  | 'recommender_answer_change'
  | 'recommender_results_view'
  | 'recommender_select'
  | 'recommender_complete'
  | 'recommender_abandon'
  | 'valuation_request'

type AnswerValue = string | number | string[] | number[] | [number, number] | boolean | undefined

interface EventPayload {
  vertical?: 'vehicles' | 'insurance'
  step?: number
  stepId?: string
  answerKey?: string
  answerValue?: AnswerValue
  resultsCount?: number
  selectedId?: string
  score?: number
  sessionId?: string
  timestamp?: number
  from?: string
  brand?: string
  model?: string
  year?: number
}

class Analytics {
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  track(eventName: EventName, payload: EventPayload = {}): void {
    const enrichedPayload = {
      ...payload,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    }

    // TODO: Replace with actual analytics service (Mixpanel, GA4, etc.)
    console.log('[Analytics]', eventName, enrichedPayload)

    // Example Mixpanel integration (when ready):
    // if (typeof window !== 'undefined' && window.mixpanel) {
    //   window.mixpanel.track(eventName, enrichedPayload)
    // }
  }

  identify(userId: string, traits?: Record<string, string | number | boolean>): void {
    console.log('[Analytics] Identify', userId, traits)
    // TODO: Implement identification when auth is available
  }

  reset(): void {
    this.sessionId = this.generateSessionId()
    console.log('[Analytics] Session reset')
  }
}

export const analytics = new Analytics()