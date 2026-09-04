const DEFAULT_API_URL = 'https://dba-compras-backend.onrender.com'
const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '')
const TIMEOUT_MS = 15000

async function request(path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const abortFromCaller = () => controller.abort()
  if (options.signal?.aborted) controller.abort()
  else options.signal?.addEventListener('abort', abortFromCaller, { once: true })

  try {
    let response

    try {
      response = await fetch(`${API_URL}${path}`, {
        ...options,
        signal: controller.signal,
        headers: { Accept: 'application/json', ...(options.headers || {}) },
      })
    } catch (error) {
      if (options.signal?.aborted) throw error
      if (error.name === 'AbortError') throw new Error('La solicitud tardó demasiado tiempo.')
      throw new Error('No fue posible conectar con el servidor.')
    }

    let body

    try {
      body = await response.json()
    } catch (error) {
      if (options.signal?.aborted) throw error
      if (controller.signal.aborted) throw new Error('La solicitud tardó demasiado tiempo.')
      if (!response.ok) throw new Error(`El servidor respondió con estado ${response.status}.`)
      throw new Error('El servidor devolvió una respuesta no válida.')
    }

    if (!response.ok || body.success === false) {
      throw new Error(body.message || `La solicitud falló con estado ${response.status}.`)
    }

    return body ? body.data : null
  } finally {
    clearTimeout(timeout)
    options.signal?.removeEventListener('abort', abortFromCaller)
  }
}

export async function getClientesTop10(limite = 10, options) {
  return request(`/api/clientes/top10?limite=${limite}`, options)
}

export async function getClientesSinCompras() {
  return request('/api/clientes/sin-compras')
}

export async function getTotalCompras() {
  const resumen = await request('/api/compras/total')
  return resumen.totalCompras
}

export async function getClientesConCompras() {
  const resumen = await request('/api/clientes/con-compras')
  return resumen.cantidad
}

export async function getMontoTotalVendido() {
  const resumen = await request('/api/compras/total')
  return resumen.montoTotalVendido
}

export async function getTicketPromedio() {
  const resumen = await request('/api/compras/promedio')
  return resumen.ticketPromedio
}

export function getComprasPorMes(options) {
  return request('/api/compras/por-mes', options)
}

export function getProductosTop10(options) {
  return request('/api/productos/top10', options)
}

export async function getTarjetasPorMarca() {
  return request('/api/tarjetas/por-marca')
}

export async function getCreditoVsDebito() {
  return request('/api/tarjetas/credito-vs-debito')
}
