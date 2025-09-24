import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoRealFormComponent } from './produto-real-form.component';

describe('ProdutoRealFormComponent', () => {
  let component: ProdutoRealFormComponent;
  let fixture: ComponentFixture<ProdutoRealFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutoRealFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutoRealFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
