import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  installments?: number[];
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  items: any[];
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment-component.component.html',
  styleUrls: ['./payment-component.component.scss']
})
export class PaymentComponent implements OnInit {
  checkoutForm: FormGroup;
  selectedPaymentMethod: string = 'credit';
  selectedInstallments: number = 1;
  isProcessing: boolean = false;
  
  paymentMethods: PaymentMethod[] = [
    {
      id: 'credit',
      name: 'Cartão de Crédito',
      icon: '💳',
      installments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    {
      id: 'debit',
      name: 'Cartão de Débito',
      icon: '💳'
    },
    {
      id: 'pix',
      name: 'PIX',
      icon: '📱'
    },
    {
      id: 'boleto',
      name: 'Boleto Bancário',
      icon: '🧾'
    }
  ];

  orderSummary: OrderSummary = {
    subtotal: 293.60,
    shipping: 15.90,
    discount: 29.36,
    total: 280.14,
    items: [
      { name: 'Whey Protein Concentrado', quantity: 2, price: 179.80 },
      { name: 'Creatina Monohidratada', quantity: 1, price: 45.90 },
      { name: 'Termogênico Extreme', quantity: 1, price: 67.90 }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.checkoutForm = this.createForm();
  }

  ngOnInit(): void {
    // Carregar dados do carrinho se necessário
    // this.loadOrderSummary();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Dados pessoais
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      
      // Endereço
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      
      // Pagamento
      cardNumber: [''],
      cardName: [''],
      cardExpiry: [''],
      cardCvv: ['']
    });
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod = methodId;
    this.selectedInstallments = 1;
    
    // Atualizar validações do cartão
    if (methodId === 'credit' || methodId === 'debit') {
      this.setCardValidators();
    } else {
      this.removeCardValidators();
    }
  }

  private setCardValidators(): void {
    this.checkoutForm.get('cardNumber')?.setValidators([
      Validators.required,
      Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)
    ]);
    this.checkoutForm.get('cardName')?.setValidators([Validators.required]);
    this.checkoutForm.get('cardExpiry')?.setValidators([
      Validators.required,
      Validators.pattern(/^\d{2}\/\d{2}$/)
    ]);
    this.checkoutForm.get('cardCvv')?.setValidators([
      Validators.required,
      Validators.pattern(/^\d{3,4}$/)
    ]);
    
    this.updateCardValidators();
  }

  private removeCardValidators(): void {
    this.checkoutForm.get('cardNumber')?.clearValidators();
    this.checkoutForm.get('cardName')?.clearValidators();
    this.checkoutForm.get('cardExpiry')?.clearValidators();
    this.checkoutForm.get('cardCvv')?.clearValidators();
    
    this.updateCardValidators();
  }

  private updateCardValidators(): void {
    this.checkoutForm.get('cardNumber')?.updateValueAndValidity();
    this.checkoutForm.get('cardName')?.updateValueAndValidity();
    this.checkoutForm.get('cardExpiry')?.updateValueAndValidity();
    this.checkoutForm.get('cardCvv')?.updateValueAndValidity();
  }

  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }

  getInstallmentPrice(): number {
    return this.orderSummary.total / this.selectedInstallments;
  }

  // Máscaras para inputs
  onPhoneInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
      event.target.value = value;
      this.checkoutForm.get('phone')?.setValue(value);
    }
  }

  onCpfInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
      event.target.value = value;
      this.checkoutForm.get('cpf')?.setValue(value);
    }
  }

  onCepInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
      event.target.value = value;
      this.checkoutForm.get('cep')?.setValue(value);
      
      // Buscar endereço por CEP (implementar integração com API)
      if (value.length === 9) {
        this.searchAddressByCep(value);
      }
    }
  }

  onCardNumberInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      value = value.replace(/^(\d{4})(\d{4})(\d{4})(\d{4})$/, '$1 $2 $3 $4');
      event.target.value = value;
      this.checkoutForm.get('cardNumber')?.setValue(value);
    }
  }

  onCardExpiryInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      value = value.replace(/^(\d{2})(\d{2})$/, '$1/$2');
      event.target.value = value;
      this.checkoutForm.get('cardExpiry')?.setValue(value);
    }
  }

  private searchAddressByCep(cep: string): void {
    // Implementar busca de endereço por CEP
    // Exemplo com ViaCEP:
    /*
    this.http.get(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`)
      .subscribe((address: any) => {
        if (!address.erro) {
          this.checkoutForm.patchValue({
            street: address.logradouro,
            neighborhood: address.bairro,
            city: address.localidade,
            state: address.uf
          });
        }
      });
    */
  }

  processPayment(): void {
    if (this.checkoutForm.valid) {
      this.isProcessing = true;
      
      // Simular processamento
      setTimeout(() => {
        this.isProcessing = false;
        
        // Redirecionar para página de sucesso
        this.router.navigate(['/pedido-confirmado']);
        
        // Ou mostrar modal de sucesso
        // this.showSuccessModal();
      }, 3000);
    } else {
      this.markFormGroupTouched();
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      this.checkoutForm.get(key)?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/carrinho']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Campo obrigatório';
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['pattern']) return 'Formato inválido';
      if (field.errors['minlength']) return 'Muito curto';
    }
    return '';
  }
}