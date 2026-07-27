import { effect } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

type Tema = 'light' | 'dark';
const CLAVE_STORAGE = 'resto-tema';

function prefiereOscuro(): boolean {
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function temaInicial(): Tema {
  const guardado = localStorage.getItem(CLAVE_STORAGE);
  if (guardado === 'light' || guardado === 'dark') return guardado;
  return prefiereOscuro() ? 'dark' : 'light';
}

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState<{ tema: Tema }>({ tema: temaInicial() }),
  withMethods((store) => ({
    alternar(): void {
      const nuevo = store.tema() === 'dark' ? 'light' : 'dark';
      localStorage.setItem(CLAVE_STORAGE, nuevo);
      patchState(store, { tema: nuevo });
    },
  })),
  withHooks({
    onInit(store) {
      effect(() => {
        const esOscuro = store.tema() === 'dark';
        document.documentElement.classList.toggle('dark', esOscuro);
        document.documentElement.style.colorScheme = esOscuro ? 'dark' : 'light';
      });
    },
  }),
);
