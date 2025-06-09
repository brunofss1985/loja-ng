import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('ProdutosEmFaltaComponent', () => {
  let component: ProdutosEmFaltaComponent;
  let fixture: ComponentFixture<ProdutosEmFaltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutosEmFaltaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutosEmFaltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
