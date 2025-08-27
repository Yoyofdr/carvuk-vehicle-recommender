'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Clock, MapPin, Phone, Mail, Check } from 'lucide-react'
import Link from 'next/link'
import { formatCLP } from '@/lib/utils/currency'
import { cn } from '@/lib/utils'

interface Offer {
  id: string
  dealerName: string
  dealerLocation: string
  price: number
  discount: number
  validUntil: string
  status: 'pending' | 'accepted' | 'rejected'
  includes: string[]
  contact: {
    phone: string
    email: string
    seller: string
  }
}

// Mock data
const mockOffers: Offer[] = [
  {
    id: '1',
    dealerName: 'Toyota Santiago Centro',
    dealerLocation: 'Providencia, Santiago',
    price: 21500000,
    discount: 1490000,
    validUntil: '2024-12-31',
    status: 'pending',
    includes: ['Mantención gratis 1 año', 'Seguro incluido', 'Tag gratis'],
    contact: {
      phone: '+56 2 2345 6789',
      email: 'ventas@toyota-santiago.cl',
      seller: 'Juan Pérez'
    }
  },
  {
    id: '2',
    dealerName: 'AutoMax Las Condes',
    dealerLocation: 'Las Condes, Santiago',
    price: 20990000,
    discount: 2000000,
    validUntil: '2024-12-31',
    status: 'pending',
    includes: ['Garantía extendida', 'Bono en accesorios'],
    contact: {
      phone: '+56 2 3456 7890',
      email: 'ofertas@automax.cl',
      seller: 'María González'
    }
  },
  {
    id: '3',
    dealerName: 'Kovacs Motor',
    dealerLocation: 'Vitacura, Santiago',
    price: 21200000,
    discount: 1790000,
    validUntil: '2024-12-31',
    status: 'pending',
    includes: ['Pintura cerámica', 'Láminas de seguridad'],
    contact: {
      phone: '+56 2 4567 8901',
      email: 'ventas@kovacs.cl',
      seller: 'Carlos Rodríguez'
    }
  }
]

export default function MisOfertasPage() {
  const [requestData, setRequestData] = useState<{
    vehicleConfig?: {
      marca: string
      modelo: string
    }
  } | null>(null)
  const [offers, setOffers] = useState<Offer[]>(mockOffers)

  useEffect(() => {
    // Load request data
    const data = localStorage.getItem('offerRequest')
    if (data) {
      setRequestData(JSON.parse(data))
    }
  }, [])

  const handleAcceptOffer = (offerId: string) => {
    setOffers(offers.map(o => 
      o.id === offerId ? { ...o, status: 'accepted' } : o
    ))
  }

  const handleRejectOffer = (offerId: string) => {
    setOffers(offers.map(o => 
      o.id === offerId ? { ...o, status: 'rejected' } : o
    ))
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/"
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Inicio</span>
            </Link>
            
            <h1 className="text-lg font-bold text-neutral-900">
              Mis Ofertas
            </h1>
            
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Clock className="h-4 w-4" />
              <span>Actualizado hace 5 min</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Tienes {offers.filter(o => o.status === 'pending').length} ofertas nuevas
              </h2>
              {requestData?.vehicleConfig && (
                <p className="text-neutral-600 mt-1">
                  Para tu {requestData.vehicleConfig.marca} {requestData.vehicleConfig.modelo}
                </p>
              )}
            </div>
            
            <div className="text-right">
              <p className="text-sm text-neutral-600">Mejor oferta</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCLP(Math.min(...offers.map(o => o.price)))}
              </p>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <div 
              key={offer.id}
              className={cn(
                "bg-white rounded-xl shadow-sm overflow-hidden transition-all",
                offer.status === 'accepted' && "ring-2 ring-green-500",
                offer.status === 'rejected' && "opacity-50"
              )}
            >
              {index === 0 && offer.status === 'pending' && (
                <div className="bg-green-500 text-white text-center py-2 text-sm font-medium">
                  💰 Mejor precio
                </div>
              )}
              
              <div className="p-6">
                {/* Dealer Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-neutral-900">{offer.dealerName}</h3>
                  <p className="text-sm text-neutral-600 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {offer.dealerLocation}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-neutral-900">
                      {formatCLP(offer.price)}
                    </p>
                    {offer.discount > 0 && (
                      <span className="text-sm text-green-600 font-medium">
                        -{formatCLP(offer.discount)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Válida hasta {new Date(offer.validUntil).toLocaleDateString('es-CL')}
                  </p>
                </div>

                {/* Includes */}
                {offer.includes.length > 0 && (
                  <div className="mb-4 space-y-1">
                    {offer.includes.map((item, i) => (
                      <p key={i} className="text-sm text-neutral-700 flex items-start gap-1">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        {item}
                      </p>
                    ))}
                  </div>
                )}

                {/* Contact Info */}
                <div className="border-t border-neutral-200 pt-4 mb-4 space-y-2">
                  <p className="text-sm text-neutral-600 flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {offer.contact.phone}
                  </p>
                  <p className="text-sm text-neutral-600 flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {offer.contact.email}
                  </p>
                  <p className="text-sm text-neutral-600">
                    Vendedor: <span className="font-medium">{offer.contact.seller}</span>
                  </p>
                </div>

                {/* Actions */}
                {offer.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptOffer(offer.id)}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleRejectOffer(offer.id)}
                      className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
                
                {offer.status === 'accepted' && (
                  <div className="text-center p-2 bg-green-100 text-green-700 rounded-lg font-medium">
                    ✓ Oferta aceptada
                  </div>
                )}
                
                {offer.status === 'rejected' && (
                  <div className="text-center p-2 bg-neutral-100 text-neutral-600 rounded-lg">
                    Oferta rechazada
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {offers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-xl text-neutral-600 mb-4">
              Aún no tienes ofertas
            </p>
            <p className="text-neutral-500 mb-6">
              Los concesionarios están preparando sus mejores ofertas para ti
            </p>
            <Link
              href="/descubre"
              className="inline-block px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-all"
            >
              Solicitar nuevas ofertas
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}