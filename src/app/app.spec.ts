import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { App } from './app';
import { AuthStore } from '@core/state/auth.store';
import { AuthAPI } from '@core/services/API/authAPI';

describe('App', () => {
  it('should create the app', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthAPI, useValue: { me: () => throwError(() => new Error('401')) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the nav brand when there is a logged in user', async () => {
    const usuario = { id: 1, nombreUsuario: 'admin' };
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthAPI, useValue: { login: () => of(usuario) } },
      ],
    }).compileComponents();

    const authStore = TestBed.inject(AuthStore);
    await authStore.login('admin', 'password12345');

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav')?.textContent).toContain(
      'RestoAdmin',
    );
  });

  it('should not render the nav when there is no logged in user', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthAPI, useValue: { me: () => throwError(() => new Error('401')) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav')).toBeNull();
  });
});
