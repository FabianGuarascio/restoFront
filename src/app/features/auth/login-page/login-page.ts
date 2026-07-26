import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { AuthStore } from '@core/state/auth.store';

interface LoginFormModel {
  nombreUsuario: string;
  password: string;
}

@Component({
  selector: 'app-login-page',
  imports: [FormField],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly loading = this.authStore.loading;
  readonly error = this.authStore.error;

  private readonly modelo = signal<LoginFormModel>({ nombreUsuario: '', password: '' });

  readonly loginForm = form(this.modelo, (f) => {
    required(f.nombreUsuario, { message: 'Ingresá tu usuario.' });
    required(f.password, { message: 'Ingresá tu contraseña.' });
  });

  async ingresar(): Promise<void> {
    this.loginForm().markAsTouched();
    await submit(this.loginForm, async () => {
      const { nombreUsuario, password } = this.loginForm().value();
      await this.authStore.login(nombreUsuario, password);
      if (this.authStore.estaLogueado()) {
        await this.router.navigateByUrl('/pedidos');
      }
      return undefined;
    });
  }
}
