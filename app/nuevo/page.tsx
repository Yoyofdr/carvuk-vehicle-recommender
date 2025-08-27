'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevoPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Volver</span>
            </Link>
            <h1 className="text-lg font-bold text-neutral-900">Autos Nuevos</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Encuentra tu auto nuevo ideal
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Configura y recibe ofertas de concesionarios oficiales
          </p>
          <Link
            href="/descubre"
            className="inline-block px-8 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand/90 transition-all"
          >
            Comenzar búsqueda
          </Link>
        </div>
      </main>
    </div>
  )
}