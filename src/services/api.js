const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const TIMEOUT_MS = 15000

async function request(path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} en ${path}`)
    }

    const body = await response.json()
    if (body && body.success === false) {
      throw new Error(body.message || `La API devolvió un error en ${path}`)
    }

    return body ? body.data : null
  } finally {
    clearTimeout(timeout)
  }
}

export async function getClientesTop10(limite = 10) {
  return request(`/api/clientes/top10?limite=${limite}`)
}

export async function getClientesSinCompras() {
  return request('/api/clientes/sin-compras')
}

export async function getTotalCompras() {
  return request('/api/compras/total')
}

export async function getClientesConCompras() {
  return request('/api/clientes/con-compras')
}

export async function getMontoTotalVendido() {
  return request('/api/compras/monto')
}

export async function getTicketPromedio() {
  return request('/api/compras/promedio')
}

export async function getTarjetasPorMarca() {
  return request('/api/tarjetas/por-marca')
}

export async function getCreditoVsDebito() {
  return request('/api/tarjetas/credito-vs-debito')
}
