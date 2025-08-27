'use client'

import { ReactNode } from 'react'

interface StepCardProps {
  title: string
  description?: string
  children: ReactNode
}

export default function StepCard({ title, description, children }: StepCardProps) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white shadow-card p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">{title}</h1>
      {description && <p className="mt-2 text-neutral-600">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}