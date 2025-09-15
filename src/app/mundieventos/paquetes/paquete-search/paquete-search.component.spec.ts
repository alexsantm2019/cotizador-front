import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaqueteSearchComponent } from './paquete-search.component';

describe('PaqueteSearchComponent', () => {
  let component: PaqueteSearchComponent;
  let fixture: ComponentFixture<PaqueteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaqueteSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaqueteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
