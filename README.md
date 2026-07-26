# RestoFront

Frontend del challenge técnico "Administración de Restaurante". Aplicación Angular standalone (sin NgModules) que consume la API de `RestoApi` (backend .NET, repo sibling `RestoApi/`) vía `HttpClient`.

## Stack

- Angular 22, componentes standalone
- Estado de entidades con `@ngrx/signals` (SignalStore) — un store por entidad en `src/app/core/state/`: `categorias.store.ts`, `productos.store.ts`, `mesas.store.ts`, `pedidos.store.ts`
- Tailwind para estilos
- Tests con **Vitest** (no Karma/Jasmine)

## Estructura

- `core/models/` — modelos TypeScript del dominio (`Categoria`, `Producto`, `Mesa`, `Pedido`, `Usuario`, ...)
- `core/services/API/` — un service HTTP por entidad, stateless (solo Observables)
- `core/state/` — SignalStore por entidad; cachea la lista (`load(force = false)` no refetchea si ya está cargada) y actualiza el cache localmente a partir de la respuesta de cada create/update/delete. Incluye `auth.store.ts` (sesión: usuario logueado, login, logout)
- `core/guards/` — `authGuard` (bloquea rutas si no hay sesión) y `guestGuard` (bloquea `/login` si ya estás logueado)
- `core/interceptors/` — `credentialsInterceptor` (agrega `withCredentials: true` a toda request), `csrfInterceptor` (agrega el header `X-XSRF-TOKEN`), `authExpiredInterceptor` (si un 401 llega en una ruta protegida, limpia la sesión y redirige a `/login`)
- `core/services/csrf-token.service.ts` — guarda en memoria el token CSRF vigente
- `features/auth/login-page/` — pantalla de login
- `features/menu/` — categorías y productos (CRUD)
- `features/mesas/` — grilla de mesas con estado visual (Libre / Ocupada / Reservada)
- `features/pedidos/` — comanda: crear pedido, agregar/quitar ítems, cambiar estado, cobrar
- `shared/components/` — componentes reutilizables (modales, banners de error, etc.)

Rutas: `/login` (pública), `/menu`, `/mesas`, `/pedidos` (protegidas por `authGuard` — sin sesión redirigen a `/login`).

## Autenticación

Login por cookie de sesión (no JWT) contra `RestoApi` — ver el README de ese repo para el detalle del backend. Para el frontend, lo relevante:

- Todas las requests salen con `withCredentials: true` (interceptor `credentials.interceptor.ts`) para que la cookie cross-site viaje en ambas direcciones.
- Al arrancar la app, `AuthStore.verificarSesion()` pide un token CSRF (`GET /auth/token`) y consulta la sesión (`GET /auth/me`) antes de dejar pasar cualquier ruta protegida.
- El token CSRF se vuelve a pedir después de cada login/logout (queda atado a la identidad activa en el momento en que se generó).

**Importante para correr local**: el backend ahora requiere HTTPS (cookie `Secure=true`). `environments/environment.development.ts` ya apunta a `https://localhost:7043/api` — hace falta confiar el certificado de desarrollo una vez (`dotnet dev-certs https --trust`, desde `RestoApi/RestoApi.Api`) y correr el backend con `dotnet run --launch-profile https`.

## Configuración de la API

La URL base de la API se configura por environment (`src/environments/`), no está hardcodeada en los services.

## Deploy

- Frontend: https://icy-grass-0220dfb10.7.azurestaticapps.net (Azure Static Web App `resto-front-guarascio`)
- Backend: https://resto-api-guarascio.azurewebsites.net (Azure App Service, plan free — cold start tras inactividad)

CI/CD vía GitHub Actions: push a `main` dispara build y deploy automático a la Static Web App.

## Comandos

```bash
npm start   # ng serve, http://localhost:4200
npm test    # vitest
```

## Building

```bash
ng build
```

Compila el proyecto y deja los artefactos en `dist/`. Por defecto la build de producción optimiza para performance.

## Recursos adicionales

Más información sobre Angular CLI en la [documentación oficial](https://angular.dev/tools/cli).
