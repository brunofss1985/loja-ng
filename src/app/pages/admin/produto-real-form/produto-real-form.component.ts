import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProdutoReal } from 'src/app/core/models/produto-real.model';

@Component({
  selector: 'app-produto-real-form',
  templateUrl: './produto-real-form.component.html',
  styleUrls: ['./produto-real-form.component.scss'],
})
export class ProdutoRealFormComponent implements OnInit {
  @Input() produtoId!: number;
  @Input() loteId!: number;
  @Output() produtoSalvo = new EventEmitter<ProdutoReal>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      codigoBarras: ['', Validators.required],
      validade: [''],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const produtoReal: ProdutoReal = {
      produtoId: this.produtoId,
      loteId: this.loteId,
      quantidade: 1, // valor padrão
      ...this.form.value,
    };

    this.produtoSalvo.emit(produtoReal);
    this.form.reset();
  }
}
