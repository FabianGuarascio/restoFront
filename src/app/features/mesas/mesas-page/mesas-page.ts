import { Component, OnInit, inject, signal } from '@angular/core';
import { MesasStore } from '@core/state/mesas.store';
import { MesaItem } from './mesa-item/mesa-item';
import { ModalCrearMesa } from './modal-crear-mesa/modal-crear-mesa';

@Component({
  selector: 'app-mesas-page',
  imports: [MesaItem, ModalCrearMesa],
  templateUrl: './mesas-page.html',
})
export class MesasPage implements OnInit {
  private readonly mesasStore = inject(MesasStore);

  readonly mesas = this.mesasStore.items;
  readonly modalCreacionAbierto = signal(false);

  ngOnInit(): void {
    this.mesasStore.load();
  }
}
