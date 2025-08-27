'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Send,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from './Toast'

const quotationSchema = z.object({
  fullName: z.string().min(3, 'Nombre completo requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono requerido'),
  rut: z.string().min(8, 'RUT requerido'),
  city: z.string().min(2, 'Ciudad requerida'),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']),
  message: z.string().optional(),
  acceptTerms: z.boolean().refine(v => v === true, 'Debes aceptar los términos')
})

type QuotationFormData = z.infer<typeof quotationSchema>

interface QuotationFormProps {
  itemType: 'vehicle' | 'insurance'
  itemId: string
  itemName: string
  onSuccess?: () => void
}

export default function QuotationForm({ 
  itemType: _itemType, 
  itemId: _itemId, 
  itemName,
  onSuccess 
}: QuotationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema)
  })

  const onSubmit = async (_data: QuotationFormData) => {
    setIsSubmitting(true)

    try {
      // TODO: Send to API
      await new Promise(resolve => setTimeout(resolve, 2000))

      setIsSuccess(true)
      showToast({
        type: 'success',
        message: 'Cotización enviada',
        description: 'Te contactaremos pronto con tu cotización personalizada'
      })

      reset()
      onSuccess?.()
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Error al enviar cotización',
        description: 'Por favor intenta nuevamente'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          ¡Cotización enviada exitosamente!
        </h3>
        <p className="text-neutral-600 mb-6">
          Recibirás tu cotización personalizada en las próximas 24 horas
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-4 py-2 bg-brand text-white rounded-xl hover:opacity-90"
        >
          Solicitar otra cotización
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
          Solicitar cotización
        </h3>
        <p className="text-sm text-neutral-600">
          Para: {itemName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Nombre completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              {...register('fullName')}
              type="text"
              className={cn(
                'w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40',
                errors.fullName ? 'border-red-500' : 'border-neutral-200'
              )}
              placeholder="Juan Pérez"
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            RUT
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              {...register('rut')}
              type="text"
              className={cn(
                'w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40',
                errors.rut ? 'border-red-500' : 'border-neutral-200'
              )}
              placeholder="12.345.678-9"
            />
          </div>
          {errors.rut && (
            <p className="mt-1 text-xs text-red-500">{errors.rut.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              {...register('email')}
              type="email"
              className={cn(
                'w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40',
                errors.email ? 'border-red-500' : 'border-neutral-200'
              )}
              placeholder="juan@ejemplo.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Teléfono
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              {...register('phone')}
              type="tel"
              className={cn(
                'w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40',
                errors.phone ? 'border-red-500' : 'border-neutral-200'
              )}
              placeholder="+56 9 1234 5678"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Ciudad
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              {...register('city')}
              type="text"
              className={cn(
                'w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40',
                errors.city ? 'border-red-500' : 'border-neutral-200'
              )}
              placeholder="Santiago"
            />
          </div>
          {errors.city && (
            <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Contacto preferido
          </label>
          <select
            {...register('preferredContact')}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40"
          >
            <option value="email">Email</option>
            <option value="phone">Teléfono</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Mensaje adicional (opcional)
        </label>
        <textarea
          {...register('message')}
          rows={3}
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40"
          placeholder="¿Hay algo específico que quieras decirnos?"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          {...register('acceptTerms')}
          type="checkbox"
          id="terms"
          className="mt-1 h-4 w-4 text-brand border-neutral-300 rounded focus:ring-brand/40"
        />
        <label htmlFor="terms" className="text-sm text-neutral-600">
          Acepto los términos y condiciones y autorizo el uso de mis datos para fines comerciales
        </label>
      </div>
      {errors.acceptTerms && (
        <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2',
          isSubmitting
            ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
            : 'bg-brand text-white hover:opacity-90'
        )}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Solicitar cotización
          </>
        )}
      </button>
    </form>
  )
}