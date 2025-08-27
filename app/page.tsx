'use client'

import Link from 'next/link'
import { Search, Star, Shield, TrendingDown, Users } from 'lucide-react'

export default function HomePage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-brand">Carvuk</h1>
              <div className="hidden md:flex gap-6">
                <Link href="/nuevo" className="text-neutral-600 hover:text-neutral-900">Autos nuevos</Link>
                <Link href="/usado" className="text-neutral-600 hover:text-neutral-900">Autos usados</Link>
                <Link href="/vender" className="text-neutral-600 hover:text-neutral-900">Vende tu auto</Link>
                <Link href="/financiamiento" className="text-neutral-600 hover:text-neutral-900">Financiamiento</Link>
              </div>
            </div>
            <button className="text-neutral-600 hover:text-neutral-900">
              Iniciar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand/5 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Encuentra el auto perfecto para ti
            </h2>
            <p className="text-xl text-neutral-600 mb-8">
              Responde algunas preguntas y te mostraremos las mejores opciones 
              según tus necesidades y presupuesto.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/descubre"
                className="bg-brand text-white rounded-xl px-8 py-4 font-medium hover:bg-brand/90 transition-all flex items-center justify-center gap-2 text-lg"
              >
                <Search className="h-5 w-5" />
                <span>Descubre tu auto ideal</span>
              </Link>
              <Link
                href="/configurar"
                className="bg-white text-neutral-700 border-2 border-neutral-200 rounded-xl px-8 py-4 font-medium hover:border-neutral-300 transition-all flex items-center justify-center text-lg"
              >
                Ya sé qué auto quiero
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-neutral-900 mb-12">
            Cómo funciona Carvuk
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand">1</span>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Configura tu auto</h4>
              <p className="text-neutral-600">
                Elige marca, modelo y especificaciones que deseas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand">2</span>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Recibe ofertas</h4>
              <p className="text-neutral-600">
                Los concesionarios te envían sus mejores ofertas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand">3</span>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Compara y elige</h4>
              <p className="text-neutral-600">
                Compara ofertas y elige la que más te convenga
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <TrendingDown className="h-8 w-8 text-brand mx-auto mb-3" />
              <h4 className="font-semibold text-neutral-900 mb-1">Ahorra dinero</h4>
              <p className="text-sm text-neutral-600">
                Hasta 20% de descuento en promedio
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-brand mx-auto mb-3" />
              <h4 className="font-semibold text-neutral-900 mb-1">Sin compromisos</h4>
              <p className="text-sm text-neutral-600">
                Compara ofertas sin presión
              </p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-brand mx-auto mb-3" />
              <h4 className="font-semibold text-neutral-900 mb-1">Red de concesionarios</h4>
              <p className="text-sm text-neutral-600">
                Más de 50 concesionarios
              </p>
            </div>
            <div className="text-center">
              <Star className="h-8 w-8 text-brand mx-auto mb-3" />
              <h4 className="font-semibold text-neutral-900 mb-1">Garantía total</h4>
              <p className="text-sm text-neutral-600">
                Autos nuevos con garantía
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-neutral-900 mb-8">
            Marcas populares
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {['Toyota', 'Chevrolet', 'Nissan', 'Hyundai', 'Mazda', 'Volkswagen'].map(brand => (
              <Link
                key={brand}
                href={`/marca/${brand.toLowerCase()}`}
                className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:shadow-md transition-all"
              >
                <div className="h-12 flex items-center justify-center mb-2">
                  <span className="text-2xl">🚗</span>
                </div>
                <p className="text-sm font-medium text-neutral-900">{brand}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-neutral-600">
            <p className="font-semibold text-neutral-900 mb-2">Carvuk</p>
            <p className="text-sm">
              © 2024 Carvuk. Todos los derechos reservados.
            </p>
            <p className="text-xs mt-2 text-neutral-500">
              Powered by AutoPress API
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}