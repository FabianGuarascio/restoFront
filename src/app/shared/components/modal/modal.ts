import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  readonly abierto = input.required<boolean>();
  readonly titulo = input<string>('');
  readonly cerrar = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.abierto()) {
      this.cerrar.emit();
    }
  }
}
