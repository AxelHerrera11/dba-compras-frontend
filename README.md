# Dashboard de Análisis de Compras — Frontend (Grupo 2)

Frontend que consume la API RESTful de `DBA_COMPRAS` (repo separado: `dba-compras-backend`, ya desplegado en Render) y muestra un dashboard de reportería y análisis.

Stack: **Vue 3 + Vite**.

## Estado actual

- [x] Proyecto Vite generado
- [x] `.gitignore` configurado
- [x] Deploy a GitHub Pages configurado (`gh-pages`, `base` en `vite.config.js`, scripts en `package.json`)
- [ ] Desarrollo del dashboard (pendiente — Lis)
- [ ] Primer deploy publicado

## Integrantes y tareas de frontend

| Integrante | Tarea |
|---|---|
| **Lis Ivette Rosales Colindrez** | Lead de frontend: estructura general del dashboard, layout, KPIs (total compras, clientes con compras, monto total vendido, ticket promedio), consumo base de la API |
| **Didhyer Alexander Ortíz Guevara** | Gráficas: Ventas por mes, Top 10 clientes, Top 10 productos |
| **Keily Fabiola Orellana Marroquín** | Gráficas: Compras por categoría, Tarjetas utilizadas por marca, Crédito vs Débito, más los filtros (fecha, cliente, categoría, producto) |

## Requisitos previos

- Node.js (18 o superior)
- Backend ya desplegado en `https://dba-compras-backend.onrender.com` (o corriendo localmente en `http://localhost:8080`)

## Configuración del entorno

La URL de la API se define como variable de entorno para poder cambiar entre desarrollo local y producción sin tocar el código fuente.

1. Copiar el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
2. El `.env` ya viene apuntando al backend desplegado:
   ```
   VITE_API_URL=https://dba-compras-backend.onrender.com
   ```
   Si están probando contra el backend corriendo en local, cambiarlo a `http://localhost:8080`.

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

Esto levanta un servidor de desarrollo (normalmente en `http://localhost:5173`).

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

## Publicar en GitHub Pages

El deploy ya está configurado en el repo (`gh-pages` instalado, `base` en `vite.config.js`, scripts en `package.json`). Para publicar:

```bash
npm run deploy
```

Esto compila el proyecto y publica el contenido de `dist/` en la rama `gh-pages`. La primera vez, confirmar en GitHub → Settings → Pages que la fuente sea la rama `gh-pages`, carpeta `/ (root)`.

URL publicada: `https://axelherrera11.github.io/dba-compras-frontend/`

> No hace falta correr el deploy hasta tener algo visible que mostrar — publicar un proyecto vacío no aporta nada. Cuando Lis tenga al menos el layout base del dashboard, ahí sí correr `npm run deploy`.

Después del primer deploy, avisar al equipo de backend para que actualicen `allowedOrigins` en `CorsConfig.java` con esta URL (ahora mismo está en `"*"` como placeholder, hay que restringirlo antes de la entrega final).

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
