import { Component, EventEmitter, output, Output, signal } from '@angular/core';

@Component({
  selector: 'app-producto-search',
  standalone: true,
  imports: [],
  templateUrl: './producto-search.component.html',
  styleUrl: './producto-search.component.scss'
})
export class ProductoSearchComponent {
  searchTerm = signal('');
  searchChange = output<string>();

  onSearchChange(value: string | null | undefined) {
    const v = (value ?? '').toString();
    this.searchTerm.set(v);
    this.searchChange.emit(v);
  }
}
