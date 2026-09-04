const DEFAULT_API_URL = 'https://dba-compras-backend.onrender.com'
const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '')
const TIMEOUT_MS = 15000

function buildQuery(params = {}) {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') usp.set(key, value)
  })
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

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

export async function getClientesTop10(limite = 10, filtros = {}, options) {
  const { fechaDesde, fechaHasta, idCategoria, idProducto } = filtros
  const query = buildQuery({ limite, fechaDesde, fechaHasta, idCategoria, idProducto })
  return request(`/api/clientes/top10${query}`, options)
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

export function getComprasPorMes(filtros = {}, options) {
  const { fechaDesde, fechaHasta, idCliente, idCategoria, idProducto } = filtros
  const query = buildQuery({ fechaDesde, fechaHasta, idCliente, idCategoria, idProducto })
  return request(`/api/compras/por-mes${query}`, options)
}

export function getProductosTop10(filtros = {}, options) {
  const { fechaDesde, fechaHasta, idCliente, idCategoria } = filtros
  const query = buildQuery({ fechaDesde, fechaHasta, idCliente, idCategoria })
  return request(`/api/productos/top10${query}`, options)
}

export async function getTarjetasPorMarca(filtros = {}) {
  const { fechaDesde, fechaHasta, idCliente } = filtros
  const query = buildQuery({ fechaDesde, fechaHasta, idCliente })
  return request(`/api/tarjetas/por-marca${query}`)
}

export async function getCreditoVsDebito(filtros = {}) {
  const { fechaDesde, fechaHasta, idCliente } = filtros
  const query = buildQuery({ fechaDesde, fechaHasta, idCliente })
  return request(`/api/tarjetas/credito-vs-debito${query}`)
}

export async function getComprasPorCategoria(filtros = {}) {
  const { fechaDesde, fechaHasta, idCliente } = filtros
  const query = buildQuery({ fechaDesde, fechaHasta, idCliente })
  return request(`/api/productos/por-categoria${query}`)
}

export async function getCategorias() {
  return request('/api/categorias')
}

export async function getProductos(filtros = {}) {
  const { q, idCategoria } = filtros
  const query = buildQuery({ q, idCategoria })
  return request(`/api/productos${query}`)
}
