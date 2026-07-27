import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  template: `
    <div class="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm py-10">
      <span
        class="h-5 w-5 rounded-full border-2 border-slate-300 border-t-slate-600 dark:border-slate-600 dark:border-t-slate-300 animate-spin"
      ></span>
      <span>{{ mensaje() }}</span>
    </div>
  `,
})
export class LoadingSpinner {
  readonly mensaje = input('Cargando...');
}
