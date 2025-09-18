import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPedidoDetalhesComponent } from './admin-pedido-detalhes.component';

describe('AdminPedidoDetalhesComponent', () => {
  let component: AdminPedidoDetalhesComponent;
  let fixture: ComponentFixture<AdminPedidoDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPedidoDetalhesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPedidoDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
