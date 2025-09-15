import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioSearchComponent } from './inventario-search.component';

describe('InventarioSearchComponent', () => {
  let component: InventarioSearchComponent;
  let fixture: ComponentFixture<InventarioSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
