# Dashboard de Análisis de Compras — Frontend (Grupo 2)

Frontend que consume la API RESTful de `DBA_COMPRAS` (repo separado: `dba-compras-backend`) y muestra un dashboard de reportería y análisis.

> Este README asume **Vue 3 + Vite**, ya que es el stack que el equipo usó en el proyecto anterior de Desarrollo Web. Si terminan usando otro framework (React, Svelte, etc.), la estructura de carpetas y los comandos de build cambian — ajusten esta sección según corresponda.

## Integrantes y tareas de frontend

| Integrante | Tarea |
|---|---|
| **Lis Ivette Rosales Colindrez** | Lead de frontend: estructura general del dashboard, layout, KPIs (total compras, clientes con compras, monto total vendido, ticket promedio), consumo base de la API |
| **Didhyer Alexander Ortíz Guevara** | Gráficas: Ventas por mes, Top 10 clientes, Top 10 productos |
| **Keily Fabiola Orellana Marroquín** | Gráficas: Compras por categoría, Tarjetas utilizadas por marca, Crédito vs Débito, más los filtros (fecha, cliente, categoría, producto) |

## Requisitos previos

- Node.js (18 o superior)
- El backend (`dba-compras-backend`) corriendo localmente o ya desplegado, con su URL a mano

## Configuración del entorno

La URL de la API **no debe quedar escrita directamente en el código** — se define como variable de entorno para poder cambiar entre desarrollo local y producción sin tocar el código fuente.

1. Copiar el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
2. Editar `.env` con la URL del backend:
   ```
   VITE_API_URL=http://localhost:8080
   ```
   En producción, este valor debe apuntar a la URL pública donde quede desplegado el backend (Render, Railway, etc.), no a `localhost`.

3. Usarla en el código así (ejemplo con `fetch`):
   ```js
   const API_URL = import.meta.env.VITE_API_URL;

   fetch(`${API_URL}/api/clientes/top10`)
     .then(res => res.json())
     .then(data => console.log(data));
   ```

## Instalación y desarrollo local

```bash
npm install
npm run dev
```

Esto levanta un servidor de desarrollo (normalmente en `http://localhost:5173`). Si al consumir la API ven un error de CORS, avisen al equipo de backend para que agreguen ese origen en `CorsConfig.java`.

## Estructura sugerida

```
src/
├── components/
│   ├── kpi/              # tarjetas de KPIs (total compras, ticket promedio, etc.)
│   ├── charts/            # componentes de gráficas (Chart.js/ApexCharts/etc.)
│   └── filters/           # filtros de fecha, cliente, categoría, producto
├── services/
│   └── api.js              # funciones centralizadas de fetch a cada endpoint
├── views/
│   └── Dashboard.vue        # vista principal
└── App.vue
```

Centralizar las llamadas a la API en `services/api.js` (una función por endpoint) evita que cada quien escriba su propio `fetch` suelto y hace más fácil cambiar la URL base en un solo lugar.

## Build para producción

```bash
npm run build
```

Esto genera la carpeta `dist/` con los archivos estáticos listos para publicar.

## Publicar en GitHub Pages

1. En `vite.config.js`, configurar `base` con el nombre del repo (importante, si no las rutas quedan rotas en producción):
   ```js
   export default defineConfig({
     base: '/dba-compras-frontend/', // ajustar al nombre real del repo
     // ...
   })
   ```
2. Generar el build:
   ```bash
   npm run build
   ```
3. Publicar la carpeta `dist/` en la rama `gh-pages` (usando `gh-pages` npm package, o manualmente, o vía GitHub Actions).
4. En GitHub → Settings → Pages, confirmar que la fuente sea la rama `gh-pages`.
5. Una vez publicado, avisar al equipo de backend la URL final para que la agreguen en `allowedOrigins` de `CorsConfig.java` (ahora mismo está en `"*"` como placeholder, hay que restringirlo a esta URL antes de la entrega).

## Checklist del dashboard

- [ ] KPIs: total de compras, total de clientes con compras, monto total vendido, ticket promedio
- [ ] Gráfica: ventas por mes
- [ ] Gráfica: top 10 clientes
- [ ] Gráfica: top 10 productos
- [ ] Gráfica: compras por categoría
- [ ] Gráfica: tarjetas utilizadas por marca
- [ ] Gráfica: crédito vs débito
- [ ] Filtro por fecha
- [ ] Filtro por cliente
- [ ] Filtro por categoría
- [ ] Filtro por producto
- [ ] `VITE_API_URL` apunta al backend desplegado (no a localhost) en la versión publicada
- [ ] Probado consumiendo la API ya desplegada, no solo en local
