import { TestBed } from '@angular/core/testing';
import { UrlTree, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthAPI } from '@core/services/API/authAPI';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const usuario = { id: 1, nombreUsuario: 'admin' };

  function configurar(mockAuthAPI: Partial<AuthAPI>) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthAPI, useValue: mockAuthAPI },
      ],
    });
  }

  it('devuelve true cuando hay sesión', async () => {
    configurar({ me: () => of(usuario) });

    const resultado = await TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    );

    expect(resultado).toBe(true);
  });

  it('devuelve un UrlTree hacia /login cuando no hay sesión', async () => {
    configurar({ me: () => throwError(() => new Error('401')) });

    const resultado = await TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    );

    expect(resultado).toBeInstanceOf(UrlTree);
    expect((resultado as UrlTree).toString()).toBe('/login');
  });
});
