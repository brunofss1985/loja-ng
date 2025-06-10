import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutosEmFaltaFormComponent } from './produtos-em-falta-form.component';

describe('ProdutosEmFaltaFormComponent', () => {
  let component: ProdutosEmFaltaFormComponent;
  let fixture: ComponentFixture<ProdutosEmFaltaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutosEmFaltaFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutosEmFaltaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
