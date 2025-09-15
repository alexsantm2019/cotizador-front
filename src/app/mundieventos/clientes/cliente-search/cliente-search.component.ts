import { Component, EventEmitter, output, Output, signal } from '@angular/core';

@Component({
  selector: 'app-cliente-search',
  standalone: true,
  imports: [],
  templateUrl: './cliente-search.component.html',
  styleUrl: './cliente-search.component.scss'
})
export class ClienteSearchComponent {
  searchTerm = signal('');
  searchChange = output<string>();

  onSearchChange(value: string | null | undefined) {
    const v = (value ?? '').toString();
    this.searchTerm.set(v);
    this.searchChange.emit(v);
  }
}
