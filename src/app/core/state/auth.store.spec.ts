import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthAPI } from '@core/services/API/authAPI';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  const usuario = { id: 1, nombreUsuario: 'admin' };

  function configurar(mockAuthAPI: Partial<AuthAPI>) {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthAPI, useValue: mockAuthAPI }],
    });
    return TestBed.inject(AuthStore);
  }

  it('verificarSesion() con me() exitoso deja checked=true y usuario seteado', async () => {
    const store = configurar({ me: () => of(usuario) });

    await store.verificarSesion();

    expect(store.checked()).toBe(true);
    expect(store.usuario()).toEqual(usuario);
    expect(store.estaLogueado()).toBe(true);
  });

  it('verificarSesion() con me() que falla (401) deja checked=true y usuario=null', async () => {
    const store = configurar({
      me: () => throwError(() => new Error('401')),
    });

    await store.verificarSesion();

    expect(store.checked()).toBe(true);
    expect(store.usuario()).toBeNull();
    expect(store.estaLogueado()).toBe(false);
  });

  it('login() exitoso setea usuario y error=null', async () => {
    const store = configurar({ login: () => of(usuario) });

    await store.login('admin', 'password12345');

    expect(store.usuario()).toEqual(usuario);
    expect(store.error()).toBeNull();
    expect(store.loading()).toBe(false);
  });

  it('login() fallido setea error y usuario sigue null', async () => {
    const store = configurar({
      login: () => throwError(() => new Error('401')),
    });

    await store.login('admin', 'incorrecta');

    expect(store.usuario()).toBeNull();
    expect(store.error()).toBe('Usuario o contraseña incorrectos.');
    expect(store.loading()).toBe(false);
  });
});
