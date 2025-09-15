import { Component, EventEmitter, output, Output, signal } from '@angular/core';

@Component({
  selector: 'app-paquete-search',
  standalone: true,
  imports: [],
  templateUrl: './paquete-search.component.html',
  styleUrl: './paquete-search.component.scss'
})
export class PaqueteSearchComponent {
  searchTerm = signal('');
  searchChange = output<string>();

  onSearchChange(value: string | null | undefined) {
    const v = (value ?? '').toString();
    this.searchTerm.set(v);
    this.searchChange.emit(v);
  }
}
