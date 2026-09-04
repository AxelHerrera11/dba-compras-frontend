import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'

ChartJS.register(
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
)

const currency = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
  maximumFractionDigits: 2,
})

const compactNumber = new Intl.NumberFormat('es-GT', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const number = new Intl.NumberFormat('es-GT', {
  maximumFractionDigits: 2,
})

const monthNames = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
]

export const chartPalette = ['#8B74EC', '#6BC7B3', '#F2A0C9', '#F5B478', '#8FB8F6', '#F0D179']

export const formatCurrency = (value) => currency.format(Number(value) || 0)
export const formatCompactNumber = (value) => compactNumber.format(Number(value) || 0)
export const formatNumber = (value) => number.format(Number(value) || 0)
export const isDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches
export const chartTextColor = () => (isDarkMode() ? '#b8afcc' : '#8a8296')
export const chartGridColor = () => (isDarkMode() ? '#3a3452' : '#ede7f7')

function numericValue(value, fieldName) {
  const number = Number(value)
  if (!Number.isFinite(number)) throw new Error(`La API devolvió un valor inválido para ${fieldName}.`)
  return number
}

export function normalizeMonthlySales(rows) {
  return rows
    .map((row, index) => {
      const month = Number(row.mes ?? row.month)
      const year = Number(row.anio ?? row.año ?? row.year)
      const monthLabel = row.nombreMes || (month >= 1 && month <= 12 ? monthNames[month - 1] : row.mes)
      const label = [monthLabel, Number.isFinite(year) ? year : ''].filter(Boolean).join(' ')

      return {
        label: label || `Periodo ${index + 1}`,
        value: numericValue(
          row.montoTotal ?? row.totalVentas ?? row.totalVendido ?? row.total,
          'el total mensual',
        ),
        order: Number.isFinite(month) && Number.isFinite(year) ? year * 100 + month : index,
      }
    })
    .sort((a, b) => a.order - b.order)
}

export function normalizeTopClients(rows) {
  return rows.map((row, index) => ({
    label:
      row.nombreCliente ||
      [row.primerNombre, row.primerApellido].filter(Boolean).join(' ') ||
      `Cliente ${index + 1}`,
    value: numericValue(row.totalComprado ?? row.montoTotal ?? row.total, 'el total comprado'),
  }))
}

export function normalizeTopProducts(rows) {
  return rows.map((row, index) => ({
    label: row.nombreProducto || row.producto || row.nombre || `Producto ${index + 1}`,
    value: numericValue(
      row.cantidadVendida ?? row.unidadesVendidas ?? row.totalVentas ?? row.totalVendido ?? row.total,
      'las ventas del producto',
    ),
  }))
}

export function barOptions(valueFormatter = formatCompactNumber) {
  const textColor = chartTextColor()

  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    interaction: { intersect: false, mode: 'nearest' },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => valueFormatter(context.raw),
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: chartGridColor() },
        ticks: { callback: valueFormatter, color: textColor },
      },
      y: {
        border: { display: false },
        grid: { display: false },
        ticks: { autoSkip: false, color: textColor, font: { weight: 600 } },
      },
    },
  }
}
