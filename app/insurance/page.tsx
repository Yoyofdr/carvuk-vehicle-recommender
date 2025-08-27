'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-neutral-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/"
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Volver</span>
            </Link>
            
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand to-brand/70 bg-clip-text text-transparent">
              Cotizador de Seguros
            </h1>
            
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🚧</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Próximamente
              </h2>
              <p className="text-neutral-600 mb-6">
                Estamos trabajando en nuestro cotizador de seguros inteligente.
              </p>
              <p className="text-sm text-neutral-500 max-w-md mx-auto">
                Pronto podrás comparar seguros de las mejores aseguradoras de Chile, 
                con coberturas personalizadas y los mejores precios del mercado.
              </p>
              
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <p className="text-sm text-neutral-600 mb-4">
                  Mientras tanto, puedes:
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/valuation"
                    className="px-4 py-2 bg-brand text-white rounded-xl hover:bg-brand/90 transition-colors"
                  >
                    Tasar un vehículo
                  </Link>
                  <Link
                    href="/vehicles"
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    Buscar vehículos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}