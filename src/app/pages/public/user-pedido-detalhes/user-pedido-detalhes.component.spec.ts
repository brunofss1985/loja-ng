import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPedidoDetalhesComponent } from './user-pedido-detalhes.component';

describe('UserPedidoDetalhesComponent', () => {
  let component: UserPedidoDetalhesComponent;
  let fixture: ComponentFixture<UserPedidoDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPedidoDetalhesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPedidoDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
