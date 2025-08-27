'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Share2, 
  MapPin, 
  Calendar,
  Fuel,
  Settings,
  Users,
  Shield,
  DollarSign,
  ChevronRight,
  Check,
  Star,
  Car,
  Gauge,
  Wrench
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Vehicle } from '@/lib/entities/Vehicle'
import { mockVehicles } from '@/lib/data/mockVehicles'
import { formatCLP } from '@/lib/utils/currency'
import FavoriteButton from '@/app/(recommender)/components/FavoriteButton'
import { useToast } from '@/app/(recommender)/components/Toast'

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'features' | 'finance'>('overview')

  useEffect(() => {
    // TODO: Fetch vehicle from API
    const foundVehicle = mockVehicles.find(v => v.id === params.id)
    if (foundVehicle) {
      setVehicle(foundVehicle)
    }
    setIsLoading(false)
  }, [params.id])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle?.brand} ${vehicle?.model}`,
          text: `Mira este ${vehicle?.brand} ${vehicle?.model} en Carvuk`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      showToast({
        type: 'success',
        message: 'Enlace copiado al portapapeles'
      })
    }
  }

  const handleContactDealer = () => {
    showToast({
      type: 'info',
      message: 'Pronto podrás contactar al vendedor',
      description: 'Esta función estará disponible pronto'
    })
  }

  const handleScheduleTestDrive = () => {
    showToast({
      type: 'info',
      message: 'Agenda tu test drive',
      description: 'Esta función estará disponible pronto'
    })
  }

  const handleFinanceCalculator = () => {
    router.push(`/finance-calculator?vehicle=${vehicle?.id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-12 w-48 bg-neutral-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center">
        <Car className="h-16 w-16 text-neutral-400 mb-4" />
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Vehículo no encontrado</h1>
        <p className="text-neutral-600 mb-6">El vehículo que buscas no está disponible</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-brand text-white rounded-xl hover:opacity-90"
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  // Mock images for gallery
  const images = [
    vehicle.image || '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600'
  ]

  const monthlyPayment = Math.round(vehicle.priceCLP * 0.02) // Simple 2% estimation

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </button>
            
            <div className="flex items-center gap-3">
              <FavoriteButton
                item={{
                  id: vehicle.id,
                  type: 'vehicle',
                  data: vehicle
                }}
                showLabel
              />
              <button
                onClick={handleShare}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Compartir"
              >
                <Share2 className="h-5 w-5 text-neutral-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="aspect-[4/3] relative">
                <Image
                  src={images[selectedImage]}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <span className="text-sm font-medium text-neutral-900">
                    {selectedImage + 1} / {images.length}
                  </span>
                </div>
              </div>
              <div className="p-4 flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                      selectedImage === idx 
                        ? 'border-brand ring-2 ring-brand/20' 
                        : 'border-transparent hover:border-neutral-300'
                    )}
                  >
                    <div className="relative w-full h-full">
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-card">
              <div className="border-b border-neutral-200">
                <div className="flex">
                  {(['overview', 'specs', 'features', 'finance'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        'flex-1 px-4 py-3 text-sm font-medium transition-all relative',
                        activeTab === tab
                          ? 'text-brand'
                          : 'text-neutral-600 hover:text-neutral-900'
                      )}
                    >
                      {tab === 'overview' && 'Resumen'}
                      {tab === 'specs' && 'Especificaciones'}
                      {tab === 'features' && 'Características'}
                      {tab === 'finance' && 'Financiamiento'}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                        Información General
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <InfoItem
                          icon={<Calendar className="h-4 w-4" />}
                          label="Año"
                          value={vehicle.year.toString()}
                        />
                        <InfoItem
                          icon={<Car className="h-4 w-4" />}
                          label="Carrocería"
                          value={vehicle.bodyType}
                        />
                        <InfoItem
                          icon={<Fuel className="h-4 w-4" />}
                          label="Combustible"
                          value={vehicle.fuelType}
                        />
                        <InfoItem
                          icon={<Settings className="h-4 w-4" />}
                          label="Transmisión"
                          value={vehicle.transmission}
                        />
                        <InfoItem
                          icon={<Users className="h-4 w-4" />}
                          label="Asientos"
                          value={`${vehicle.seats} personas`}
                        />
                        <InfoItem
                          icon={<Shield className="h-4 w-4" />}
                          label="Seguridad"
                          value={
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'h-4 w-4',
                                    i < vehicle.safetyRating
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-neutral-300'
                                  )}
                                />
                              ))}
                            </div>
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                        Rendimiento
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <InfoItem
                          icon={<Gauge className="h-4 w-4" />}
                          label="Motor"
                          value={`${vehicle.engineSize}L`}
                        />
                        <InfoItem
                          icon={<Fuel className="h-4 w-4" />}
                          label="Eficiencia"
                          value={`${vehicle.fuelEfficiency} km/l`}
                        />
                        <InfoItem
                          icon={<Wrench className="h-4 w-4" />}
                          label="Mantenimiento"
                          value={
                            <span className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              vehicle.maintenanceCostRating === 'low' && 'bg-green-100 text-green-700',
                              vehicle.maintenanceCostRating === 'medium' && 'bg-yellow-100 text-yellow-700',
                              vehicle.maintenanceCostRating === 'high' && 'bg-red-100 text-red-700'
                            )}>
                              {vehicle.maintenanceCostRating === 'low' && 'Bajo'}
                              {vehicle.maintenanceCostRating === 'medium' && 'Medio'}
                              {vehicle.maintenanceCostRating === 'high' && 'Alto'}
                            </span>
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-4">
                    <SpecItem label="Marca" value={vehicle.brand} />
                    <SpecItem label="Modelo" value={vehicle.model} />
                    <SpecItem label="Año" value={vehicle.year.toString()} />
                    <SpecItem label="Tipo de carrocería" value={vehicle.bodyType} />
                    <SpecItem label="Combustible" value={vehicle.fuelType} />
                    <SpecItem label="Transmisión" value={vehicle.transmission} />
                    <SpecItem label="Motor" value={`${vehicle.engineSize} litros`} />
                    <SpecItem label="Asientos" value={`${vehicle.seats} personas`} />
                    <SpecItem label="Puertas" value={vehicle.doorsCount.toString()} />
                    <SpecItem label="Rendimiento" value={`${vehicle.fuelEfficiency} km/l`} />
                    <SpecItem 
                      label="Calificación de seguridad" 
                      value={`${vehicle.safetyRating}/5 estrellas`} 
                    />
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="space-y-3">
                    {vehicle.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-neutral-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'finance' && (
                  <div className="space-y-6">
                    <div className="bg-brand/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-600">Cuota estimada</span>
                        <span className="text-2xl font-bold text-brand">
                          {formatCLP(monthlyPayment)}/mes
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        *Estimación con 20% de pie a 48 meses
                      </p>
                    </div>
                    
                    <button
                      onClick={handleFinanceCalculator}
                      className="w-full px-4 py-3 bg-white border border-brand text-brand rounded-xl hover:bg-brand/5 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <DollarSign className="h-5 w-5" />
                      Calcular financiamiento
                    </button>

                    <div className="text-sm text-neutral-600 space-y-2">
                      <p>• Sujeto a evaluación crediticia</p>
                      <p>• Tasa referencial del mercado</p>
                      <p>• Puedes ajustar el pie y plazo</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Price and Actions */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <p className="text-neutral-600 mt-1">{vehicle.year}</p>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold text-neutral-900">
                  {formatCLP(vehicle.priceCLP)}
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  o {formatCLP(monthlyPayment)}/mes
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleContactDealer}
                  className="w-full px-4 py-3 bg-brand text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
                >
                  Contactar vendedor
                </button>
                
                <button
                  onClick={handleScheduleTestDrive}
                  className="w-full px-4 py-3 bg-white border border-brand text-brand rounded-xl hover:bg-brand/5 transition-colors font-medium"
                >
                  Agendar test drive
                </button>

                <button
                  onClick={handleFinanceCalculator}
                  className="w-full px-4 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors font-medium"
                >
                  Simular crédito
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="flex items-start gap-3 text-sm text-neutral-600">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-900">Disponible en Santiago</p>
                    <p>Entrega inmediata</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Vehicles */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Vehículos similares
              </h3>
              <div className="space-y-3">
                {mockVehicles
                  .filter(v => 
                    v.id !== vehicle.id && 
                    (v.bodyType === vehicle.bodyType || v.brand === vehicle.brand)
                  )
                  .slice(0, 3)
                  .map(v => (
                    <button
                      key={v.id}
                      onClick={() => router.push(`/vehicles/${v.id}`)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors text-left"
                    >
                      <div className="w-16 h-16 bg-neutral-100 rounded-lg flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">
                          {v.brand} {v.model}
                        </p>
                        <p className="text-sm text-neutral-600">{formatCLP(v.priceCLP)}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-neutral-400" />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-neutral-600 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm text-neutral-600">{label}</p>
        <div className="font-medium text-neutral-900">{value}</div>
      </div>
    </div>
  )
}

interface SpecItemProps {
  label: string
  value: string
}

function SpecItem({ label, value }: SpecItemProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
      <span className="text-neutral-600">{label}</span>
      <span className="font-medium text-neutral-900">{value}</span>
    </div>
  )
}