import { prisma } from '@/lib/database/prismaClient'
import { cache, CACHE_TTL, CacheService } from './CacheService'
import { Prisma, Lead, Customer, Vehicle, CustomerPreference } from '@prisma/client'

export interface LeadCreationData {
  customerId: string
  vehicleId: string
  preferenceId?: string
  leadSource: string
  contactMethod?: string
  contactDate?: Date
  followUpDate?: Date
  notes?: string
}

export interface LeadWithRelations extends Lead {
  customer: Customer
  vehicle: Vehicle | null
  preference: CustomerPreference | null
}

export class LeadService {
  constructor() {
    // LeadService initialized
  }

  /**
   * Create a new lead and distribute to relevant dealers
   */
  async createLead(data: LeadCreationData): Promise<LeadWithRelations> {
    try {
      // Create the lead in database
      const lead = await prisma.lead.create({
        data: {
          customerId: data.customerId,
          vehicleId: data.vehicleId,
          preferenceId: data.preferenceId,
          leadSource: data.leadSource,
          leadStatus: 'new',
          contactMethod: data.contactMethod || 'email',
          contactDate: data.contactDate || new Date(),
          followUpDate: data.followUpDate || this.calculateFollowUpDate(),
          leadScore: 0, // Will be calculated
          contactAttempts: 0,
        },
        include: {
          customer: true,
          vehicle: true,
          preference: true,
        },
      })

      // Calculate lead score
      const leadScore = await this.calculateLeadScore(lead)
      
      // Update lead with calculated score
      const updatedLead = await prisma.lead.update({
        where: { id: lead.id },
        data: { leadScore },
        include: {
          customer: true,
          vehicle: true,
          preference: true,
        },
      })

      // Cache the lead for quick access
      await cache.set(
        CacheService.leadKey(updatedLead.id),
        updatedLead,
        CACHE_TTL.LEADS
      )

      // Track the lead creation
      await this.trackLeadEvent(updatedLead.id, 'created')

      return updatedLead
    } catch (error) {
      console.error('Error creating lead:', error)
      throw new Error('Failed to create lead')
    }
  }

  /**
   * Calculate lead quality score (0-100)
   */
  async calculateLeadScore(lead: LeadWithRelations): Promise<number> {
    let score = 0

    // Budget match (30 points)
    if (lead.preference) {
      if (lead.preference.minPrice && lead.preference.maxPrice) {
        score += 30 // Has defined budget
      }
    }

    // Contact information completeness (20 points)
    if (lead.customer) {
      if (lead.customer.email) score += 10
      if (lead.customer.phone) score += 10
    }

    // Vehicle specificity (20 points)
    if (lead.vehicleId) {
      score += 20 // Interested in specific vehicle
    }

    // Lead source quality (15 points)
    const highQualitySources = ['discovery', 'comparison', 'configurator']
    if (highQualitySources.includes(lead.leadSource || '')) {
      score += 15
    }

    // Timeline urgency (15 points)
    if (lead.followUpDate) {
      const daysUntilFollowUp = Math.ceil(
        (lead.followUpDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
      if (daysUntilFollowUp <= 7) score += 15 // Urgent buyer
      else if (daysUntilFollowUp <= 30) score += 10 // Near-term buyer
      else score += 5 // Future buyer
    }

    return Math.min(100, score)
  }


  /**
   * Update lead status
   */
  async updateLeadStatus(
    leadId: string,
    status: string,
    notes?: string
  ): Promise<Lead> {
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        leadStatus: status,
        followUpNotes: notes,
        lastContactDate: new Date(),
      },
    })

    // Clear cache
    await cache.delete(CacheService.leadKey(leadId))

    // Track status change
    await this.trackLeadEvent(leadId, `status_changed_to_${status}`)

    return updatedLead
  }

  /**
   * Record interaction with lead
   */
  async recordInteraction(
    leadId: string,
    interactionType: string,
    notes: string,
    outcome: string
  ): Promise<void> {
    await prisma.leadInteraction.create({
      data: {
        leadId,
        interactionType,
        notes,
        outcome,
        interactionDate: new Date(),
      },
    })

    // Increment contact attempts
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        contactAttempts: { increment: 1 },
        lastContactDate: new Date(),
      },
    })
  }

  /**
   * Get leads by status
   */
  async getLeadsByStatus(status: string): Promise<Lead[]> {
    const cacheKey = CacheService.generateKey('leads:status', status)
    
    return cache.getOrSet(
      cacheKey,
      async () => {
        return prisma.lead.findMany({
          where: { leadStatus: status },
          include: {
            customer: true,
            vehicle: true,
          },
          orderBy: { createdAt: 'desc' },
        })
      },
      300 // 5 minutes cache
    )
  }


  /**
   * Get customer's lead history
   */
  async getCustomerLeads(customerId: string): Promise<Lead[]> {
    return prisma.lead.findMany({
      where: { customerId },
      include: {
        vehicle: true,
        quotes: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Mark lead as won
   */
  async markLeadAsWon(
    leadId: string,
    finalPrice: number,
    commissionAmount?: number
  ): Promise<Lead> {
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        leadStatus: 'won',
        wonDate: new Date(),
        finalPrice,
        commissionAmount: commissionAmount || this.calculateCommission(finalPrice),
      },
    })

    await this.trackLeadEvent(leadId, 'won')
    return lead
  }

  /**
   * Mark lead as lost
   */
  async markLeadAsLost(leadId: string, reason: string): Promise<Lead> {
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        leadStatus: 'lost',
        lostReason: reason,
      },
    })

    await this.trackLeadEvent(leadId, 'lost')
    return lead
  }

  /**
   * Calculate commission for a sale
   */
  private calculateCommission(finalPrice: number): number {
    const commissionRate = parseFloat(
      process.env.DEFAULT_COMMISSION_RATE || '5.0'
    )
    return (finalPrice * commissionRate) / 100
  }

  /**
   * Calculate default follow-up date
   */
  private calculateFollowUpDate(): Date {
    const date = new Date()
    date.setDate(date.getDate() + 3) // 3 days from now
    return date
  }

  /**
   * Track lead events for analytics
   */
  private async trackLeadEvent(leadId: string, event: string): Promise<void> {
    // TODO: Implement analytics tracking
    console.log(`Lead event: ${event} for lead ${leadId}`)
  }

  /**
   * Get lead statistics
   */
  async getLeadStatistics(): Promise<any> {
    const [totalLeads, wonLeads, lostLeads, activeLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { leadStatus: 'won' } }),
      prisma.lead.count({ where: { leadStatus: 'lost' } }),
      prisma.lead.count({
        where: {
          leadStatus: { in: ['new', 'contacted', 'qualified', 'negotiation'] },
        },
      }),
    ])

    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0

    return {
      totalLeads,
      wonLeads,
      lostLeads,
      activeLeads,
      conversionRate: conversionRate.toFixed(2),
    }
  }
}

// Export singleton instance
export const leadService = new LeadService()