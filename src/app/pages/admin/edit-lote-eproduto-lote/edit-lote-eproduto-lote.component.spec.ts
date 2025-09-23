import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoteEProdutoLoteComponent } from './edit-lote-eproduto-lote.component';

describe('EditLoteEProdutoLoteComponent', () => {
  let component: EditLoteEProdutoLoteComponent;
  let fixture: ComponentFixture<EditLoteEProdutoLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLoteEProdutoLoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLoteEProdutoLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
