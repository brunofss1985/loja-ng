import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPedidosComponent } from './user-pedidos.component';

describe('UserPedidosComponent', () => {
  let component: UserPedidosComponent;
  let fixture: ComponentFixture<UserPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPedidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
