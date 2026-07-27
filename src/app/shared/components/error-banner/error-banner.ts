import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-banner',
  imports: [],
  template: `
    <div
      class="flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300 rounded-lg px-4 py-3 mb-4 text-sm"
    >
      <span>{{ mensaje() }}</span>
      <button
        type="button"
        (click)="reintentar.emit()"
        class="shrink-0 bg-red-600 text-white rounded px-3 py-1 text-xs hover:bg-red-700"
      >
        Reintentar
      </button>
    </div>
  `,
})
export class ErrorBanner {
  readonly mensaje = input.required<string>();
  readonly reintentar = output<void>();
}
