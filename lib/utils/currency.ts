export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatUF(amount: number): string {
  return `${amount.toLocaleString('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  })} UF`
}

export function parseCLP(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, ''), 10) || 0
}

export function parseUF(value: string): number {
  return parseFloat(value.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0
}