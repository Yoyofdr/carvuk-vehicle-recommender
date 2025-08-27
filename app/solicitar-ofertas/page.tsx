'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' 
import { ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { formatCLP } from '@/lib/utils/currency'

export default function SolicitarOfertasPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [config, setConfig] = useState<{
    vehicleConfig?: {
      marca: string
      modelo: string
      año: number
      version: string
      precio: number
    }
    insurance?: {
      tipoSeguro: string
      deducible: string
      coberturaTotal: number
    }
  } | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rut: '',
    ciudad: '',
    comuna: '',
    financiamiento: 'contado',
    entregaActual: 'no',
    marcaActual: '',
    modeloActual: '',
    anoActual: '',
    comentarios: ''
  })

  useEffect(() => {
    // Load vehicle configuration
    const savedConfig = localStorage.getItem('vehicleConfig')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulate saving the request
    const requestData = {
      ...formData,
      vehicleConfig: config,
      requestDate: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    }
    
    localStorage.setItem('offerRequest', JSON.stringify(requestData))
    
    // Redirect to offers dashboard
    router.push('/mis-ofertas')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/configurar"
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Volver</span>
            </Link>
            
            <h1 className="text-lg font-bold text-neutral-900">
              Solicitar Ofertas
            </h1>
            
            <div className="text-sm text-neutral-600">
              Paso {step} de 3
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Progreso</span>
            <span className="text-sm font-medium text-neutral-900">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-brand h-2 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                    Información personal
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        RUT
                      </label>
                      <input
                        type="text"
                        name="rut"
                        value={formData.rut}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Ciudad
                      </label>
                      <select
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                      >
                        <option value="">Seleccionar</option>
                        <option value="santiago">Santiago</option>
                        <option value="valparaiso">Valparaíso</option>
                        <option value="concepcion">Concepción</option>
                        <option value="la-serena">La Serena</option>
                        <option value="temuco">Temuco</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-all"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Financing */}
              {step === 2 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                    Financiamiento y entrega
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-3">
                        ¿Cómo planeas pagar?
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                          <input
                            type="radio"
                            name="financiamiento"
                            value="contado"
                            checked={formData.financiamiento === 'contado'}
                            onChange={handleInputChange}
                            className="text-brand"
                          />
                          <span>Al contado</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                          <input
                            type="radio"
                            name="financiamiento"
                            value="credito"
                            checked={formData.financiamiento === 'credito'}
                            onChange={handleInputChange}
                            className="text-brand"
                          />
                          <span>Con crédito</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-3">
                        ¿Tienes un vehículo para entregar en parte de pago?
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                          <input
                            type="radio"
                            name="entregaActual"
                            value="no"
                            checked={formData.entregaActual === 'no'}
                            onChange={handleInputChange}
                            className="text-brand"
                          />
                          <span>No</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                          <input
                            type="radio"
                            name="entregaActual"
                            value="si"
                            checked={formData.entregaActual === 'si'}
                            onChange={handleInputChange}
                            className="text-brand"
                          />
                          <span>Sí, tengo un vehículo</span>
                        </label>
                      </div>
                    </div>
                    
                    {formData.entregaActual === 'si' && (
                      <div className="grid md:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Marca
                          </label>
                          <input
                            type="text"
                            name="marcaActual"
                            value={formData.marcaActual}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Modelo
                          </label>
                          <input
                            type="text"
                            name="modeloActual"
                            value={formData.modeloActual}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Año
                          </label>
                          <input
                            type="text"
                            name="anoActual"
                            value={formData.anoActual}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all"
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-all"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                    Confirmar solicitud
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm font-medium text-neutral-700 mb-2">Información personal</p>
                      <p className="text-sm text-neutral-600">
                        {formData.nombre} {formData.apellido}<br />
                        {formData.email}<br />
                        {formData.telefono}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm font-medium text-neutral-700 mb-2">Forma de pago</p>
                      <p className="text-sm text-neutral-600">
                        {formData.financiamiento === 'contado' ? 'Al contado' : 'Con crédito'}
                      </p>
                    </div>
                    
                    {formData.entregaActual === 'si' && (
                      <div className="p-4 bg-neutral-50 rounded-lg">
                        <p className="text-sm font-medium text-neutral-700 mb-2">Vehículo en parte de pago</p>
                        <p className="text-sm text-neutral-600">
                          {formData.marcaActual} {formData.modeloActual} {formData.anoActual}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Comentarios adicionales (opcional)
                    </label>
                    <textarea
                      name="comentarios"
                      value={formData.comentarios}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                      placeholder="¿Algo más que los concesionarios deban saber?"
                    />
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                    <div className="flex gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="text-sm text-green-800">
                        <p className="font-medium mb-1">Todo listo para enviar tu solicitud</p>
                        <p>Los concesionarios recibirán tu solicitud y te enviarán sus mejores ofertas en las próximas 24 horas.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all"
                    >
                      Anterior
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-all"
                    >
                      Enviar solicitud
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Tu vehículo
              </h3>
              
              {config && (
                <div>
                  <div className="bg-neutral-100 rounded-lg h-32 mb-4 flex items-center justify-center">
                    <span className="text-5xl">🚗</span>
                  </div>
                  
                  <p className="font-medium text-neutral-900 mb-2">
                    {(config as any).marca} {(config as any).modelo}
                  </p>
                  
                  <div className="space-y-1 text-sm text-neutral-600 mb-4">
                    <p>Motor: {(config as any).motor}</p>
                    <p>Versión: {(config as any).version}</p>
                    <p>Color: {(config as any).color}</p>
                    {(config as any).extras?.length > 0 && (
                      <p>Extras: {(config as any).extras.length} opcionales</p>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-neutral-200">
                    <p className="text-sm text-neutral-600 mb-1">Precio configurado</p>
                    <p className="text-xl font-bold text-brand">
                      {formatCLP((config as any).total)}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-3 bg-neutral-50 rounded-lg">
                <p className="text-xs text-neutral-600">
                  <strong>Garantía Carvuk:</strong> Tu información es privada y solo la compartimos con los concesionarios que elijas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}