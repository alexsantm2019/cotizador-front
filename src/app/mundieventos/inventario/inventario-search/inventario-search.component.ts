import { Component, EventEmitter, output, Output, signal } from '@angular/core';

@Component({
  selector: 'app-inventario-search',
  standalone: true,
  imports: [],
  templateUrl: './inventario-search.component.html',
  styleUrl: './inventario-search.component.scss'
})
export class InventarioSearchComponent {

  searchTerm = signal('');
  searchChange = output<string>();

  onSearchChange(value: string | null | undefined) {
    const v = (value ?? '').toString();
    this.searchTerm.set(v);
    this.searchChange.emit(v);
  }

}
