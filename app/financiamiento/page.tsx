'use client'

import { ArrowLeft, Calculator } from 'lucide-react'
import Link from 'next/link'

export default function FinanciamientoPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Volver</span>
            </Link>
            <h1 className="text-lg font-bold text-neutral-900">Financiamiento</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Calculator className="h-16 w-16 text-brand mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Simula tu crédito automotriz
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Compara las mejores opciones de financiamiento disponibles
          </p>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-neutral-600">
              Próximamente podrás simular tu crédito y comparar opciones de diferentes bancos
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}