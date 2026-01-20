import { Component, Input } from '@angular/core';
import { NavigationItemInterface } from '../../../../../core/models/navigation-item.models';

@Component({
  selector: 'app-nav-horizontal',
  standalone: false,
  // imports: [],
  templateUrl: './nav-horizontal.component.html',
  styleUrl: './nav-horizontal.component.scss'
})
export class NavHorizontalComponent {
  mobileOpen = false;
  @Input() navigations: NavigationItemInterface[] = [];
  
  toggleMobileMenu() {
    this.mobileOpen = !this.mobileOpen;
  }
}
