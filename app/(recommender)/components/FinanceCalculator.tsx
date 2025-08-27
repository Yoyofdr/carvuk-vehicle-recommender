'use client'

import { useState, useEffect, useCallback } from 'react'
import { DollarSign, Percent, Calendar, TrendingUp, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCLP } from '@/lib/utils/currency'
import RangeControl from './RangeControl'

interface FinanceCalculatorProps {
  vehiclePrice: number
  className?: string
}

export default function FinanceCalculator({ vehiclePrice, className }: FinanceCalculatorProps) {
  const [downPayment, setDownPayment] = useState(vehiclePrice * 0.2)
  const [loanTerm, setLoanTerm] = useState(48)
  const [interestRate, setInterestRate] = useState(1.2)
  const [includeInsurance, setIncludeInsurance] = useState(true)
  
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  const calculatePayment = useCallback(() => {
    const principal = vehiclePrice - downPayment
    const monthlyRate = interestRate / 100
    const numPayments = loanTerm

    if (principal <= 0) {
      setMonthlyPayment(0)
      setTotalPayment(downPayment)
      setTotalInterest(0)
      return
    }

    // Formula: M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                   (Math.pow(1 + monthlyRate, numPayments) - 1)

    const insuranceMonthly = includeInsurance ? vehiclePrice * 0.001 : 0
    const totalMonthly = payment + insuranceMonthly

    setMonthlyPayment(Math.round(totalMonthly))
    setTotalPayment(Math.round(totalMonthly * numPayments + downPayment))
    setTotalInterest(Math.round(totalMonthly * numPayments - principal))
  }, [vehiclePrice, downPayment, loanTerm, interestRate, includeInsurance])

  useEffect(() => {
    calculatePayment()
  }, [calculatePayment])

  const downPaymentPercentage = Math.round((downPayment / vehiclePrice) * 100)
  const loanAmount = vehiclePrice - downPayment

  return (
    <div className={cn('bg-white rounded-2xl shadow-card p-6', className)}>
      <h3 className="text-xl font-semibold text-neutral-900 mb-6">
        Calculadora de Financiamiento
      </h3>

      {/* Result Display */}
      <div className="bg-brand/5 rounded-xl p-6 mb-6">
        <div className="text-center mb-4">
          <p className="text-sm text-neutral-600 mb-1">Cuota mensual estimada</p>
          <p className="text-4xl font-bold text-brand">{formatCLP(monthlyPayment)}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-neutral-600">Total a pagar</p>
            <p className="text-sm font-semibold text-neutral-900">{formatCLP(totalPayment)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-600">Monto a financiar</p>
            <p className="text-sm font-semibold text-neutral-900">{formatCLP(loanAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-600">Intereses totales</p>
            <p className="text-sm font-semibold text-neutral-900">{formatCLP(totalInterest)}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {/* Down Payment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pie inicial
            </label>
            <span className="text-sm text-neutral-600">
              {downPaymentPercentage}% del precio
            </span>
          </div>
          <RangeControl
            min={0}
            max={vehiclePrice * 0.5}
            step={100000}
            value={[downPayment, downPayment]}
            onChange={(value) => setDownPayment(value[0])}
            format={(v) => formatCLP(v)}
          />
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Plazo del crédito
            </label>
            <span className="text-sm text-neutral-600">
              {loanTerm} meses
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[12, 24, 36, 48, 60].map((months) => (
              <button
                key={months}
                onClick={() => setLoanTerm(months)}
                className={cn(
                  'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                  loanTerm === months
                    ? 'bg-brand text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                )}
              >
                {months}m
              </button>
            ))}
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Tasa de interés mensual
            </label>
            <span className="text-sm text-neutral-600">
              {interestRate}%
            </span>
          </div>
          <RangeControl
            min={0.8}
            max={2.0}
            step={0.1}
            value={[interestRate, interestRate]}
            onChange={(value) => setInterestRate(value[0])}
            format={(v) => `${v.toFixed(1)}%`}
          />
          <p className="text-xs text-neutral-500 mt-1">
            Tasa referencial del mercado
          </p>
        </div>

        {/* Insurance Option */}
        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="insurance"
              checked={includeInsurance}
              onChange={(e) => setIncludeInsurance(e.target.checked)}
              className="h-4 w-4 text-brand border-neutral-300 rounded focus:ring-brand/40"
            />
            <label htmlFor="insurance" className="text-sm font-medium text-neutral-700">
              Incluir seguro desgravamen
            </label>
          </div>
          <Info className="h-4 w-4 text-neutral-400" />
        </div>
      </div>

      {/* Amortization Preview */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <h4 className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Desglose del pago mensual
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Capital</span>
            <span className="font-medium text-neutral-900">
              {formatCLP(Math.round(loanAmount / loanTerm))}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Intereses</span>
            <span className="font-medium text-neutral-900">
              {formatCLP(Math.round(monthlyPayment - loanAmount / loanTerm - (includeInsurance ? vehiclePrice * 0.001 : 0)))}
            </span>
          </div>
          {includeInsurance && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Seguro</span>
              <span className="font-medium text-neutral-900">
                {formatCLP(Math.round(vehiclePrice * 0.001))}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-neutral-200">
            <span className="font-medium text-neutral-700">Total mensual</span>
            <span className="font-semibold text-brand text-lg">
              {formatCLP(monthlyPayment)}
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>Importante:</strong> Esta es una simulación referencial. Las condiciones finales 
          están sujetas a evaluación crediticia y pueden variar según la institución financiera.
        </p>
      </div>
    </div>
  )
}