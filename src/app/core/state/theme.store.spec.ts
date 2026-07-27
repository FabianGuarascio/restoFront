import { TestBed } from '@angular/core/testing';
import { ThemeStore } from './theme.store';

describe('ThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({});
  });

  it('alternar() cambia tema() y lo persiste en localStorage', () => {
    const store = TestBed.inject(ThemeStore);
    const temaOriginal = store.tema();

    store.alternar();

    const temaEsperado = temaOriginal === 'dark' ? 'light' : 'dark';
    expect(store.tema()).toBe(temaEsperado);
    expect(localStorage.getItem('resto-tema')).toBe(temaEsperado);
  });

  it('alternar() dos veces vuelve al tema original', () => {
    const store = TestBed.inject(ThemeStore);
    const temaOriginal = store.tema();

    store.alternar();
    store.alternar();

    expect(store.tema()).toBe(temaOriginal);
    expect(localStorage.getItem('resto-tema')).toBe(temaOriginal);
  });
});
