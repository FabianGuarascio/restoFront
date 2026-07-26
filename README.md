# RestoFront

Frontend del challenge técnico "Administración de Restaurante". Aplicación Angular standalone (sin NgModules) que consume la API de `RestoApi` (backend .NET, repo sibling `RestoApi/`) vía `HttpClient`.

## Stack

- Angular 22, componentes standalone
- Estado de entidades con `@ngrx/signals` (SignalStore) — un store por entidad en `src/app/core/state/`: `categorias.store.ts`, `productos.store.ts`, `mesas.store.ts`, `pedidos.store.ts`
- Tailwind para estilos
- Tests con **Vitest** (no Karma/Jasmine)

## Estructura

- `core/models/` — modelos TypeScript del dominio (`Categoria`, `Producto`, `Mesa`, `Pedido`, ...)
- `core/services/API/` — un service HTTP por entidad, stateless (solo Observables)
- `core/state/` — SignalStore por entidad; cachea la lista (`load(force = false)` no refetchea si ya está cargada) y actualiza el cache localmente a partir de la respuesta de cada create/update/delete
- `features/menu/` — categorías y productos (CRUD)
- `features/mesas/` — grilla de mesas con estado visual (Libre / Ocupada / Reservada)
- `features/pedidos/` — comanda: crear pedido, agregar/quitar ítems, cambiar estado, cobrar
- `shared/components/` — componentes reutilizables (modales, banners de error, etc.)

Rutas: `/menu`, `/mesas`, `/pedidos`.

## Configuración de la API

La URL base de la API se configura por environment (`src/environments/`), no está hardcodeada en los services.

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
