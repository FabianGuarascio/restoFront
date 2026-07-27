import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '@core/state/auth.store';
import { ThemeStore } from '@core/state/theme.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly authStore = inject(AuthStore);
  protected readonly themeStore = inject(ThemeStore);
  private readonly router = inject(Router);

  protected async cerrarSesion(): Promise<void> {
    await this.authStore.logout();
    await this.router.navigateByUrl('/login');
  }
}
