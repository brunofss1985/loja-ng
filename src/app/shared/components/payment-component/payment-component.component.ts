import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  PaymentService,
  PaymentResponse,
  CheckoutPayload
} from 'src/app/core/services/paymentService/payment-service.service';
import { CartService } from 'src/app/core/services/cartService/cart-service.service';
import { CartItem } from 'src/app/core/models/cart-item.model';

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
  pixModalOpen = false;
  pixQrBase64 = '';
  pixCopiaCola = '';

  orderSummary = {
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    items: [] as CartItem[]
  };

  paymentMethods = [
    { id: 'credit', name: 'Cartão de Crédito', icon: '💳', installments: [1,2,3,4,5,6,7,8,9,10,11,12] },
    { id: 'debit', name: 'Cartão de Débito', icon: '💳' },
    { id: 'pix', name: 'PIX', icon: '📱' },
    { id: 'boleto', name: 'Boleto Bancário', icon: '🧾' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private paymentService: PaymentService,
    private cartService: CartService
  ) {
    this.checkoutForm = this.createForm();
  }

  ngOnInit(): void {
    this.orderSummary = {
      subtotal: this.cartService.getSubtotal(),
      shipping: this.cartService.getShipping(),
      discount: this.cartService.getDiscount(),
      total: this.cartService.getTotal(),
      items: this.cartService.getCartItemsSnapshot()
    };
  }

  private createForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      cardNumber: [''],
      cardName: [''],
      cardExpiry: [''],
      cardCvv: ['']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
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

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      this.checkoutForm.get(key)?.markAsTouched();
    });
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod = methodId;
    this.selectedInstallments = 1;
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
    ['cardNumber', 'cardName', 'cardExpiry', 'cardCvv'].forEach(field => {
      this.checkoutForm.get(field)?.clearValidators();
      this.checkoutForm.get(field)?.updateValueAndValidity();
    });
  }

  private updateCardValidators(): void {
    ['cardNumber', 'cardName', 'cardExpiry', 'cardCvv'].forEach(field => {
      this.checkoutForm.get(field)?.updateValueAndValidity();
    });
  }

  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }

  getInstallmentPrice(): number {
    return this.orderSummary.total / this.selectedInstallments;
  }

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
      if (value.length === 9) this.searchAddressByCep(value);
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
    // Implementar integração com API ViaCEP ou similar
  }

  showPixModal(qrBase64: string, copiaCola?: string) {
    this.pixQrBase64 = qrBase64;
    this.pixCopiaCola = copiaCola || '';
    this.pixModalOpen = true;
  }

  closePixModal() {
    this.pixModalOpen = false;
  }

  copyPix() {
    navigator.clipboard.writeText(this.pixCopiaCola);
  }

  processPayment(): void {
    if (!this.checkoutForm.valid) {
      this.markFormGroupTouched();
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.isProcessing = true;

    const methodMap: any = {
      credit: 'CREDIT',
      debit: 'DEBIT',
      pix: 'PIX',
      boleto: 'BOLETO'
    };

    const payload: CheckoutPayload = {
      fullName: this.checkoutForm.value.fullName,
      email: this.checkoutForm.value.email,
      phone: this.checkoutForm.value.phone,
      cpf: this.checkoutForm.value.cpf,
      cep: this.checkoutForm.value.cep,
      street: this.checkoutForm.value.street,
      number: this.checkoutForm.value.number,
      complement: this.checkoutForm.value.complement,
      neighborhood: this.checkoutForm.value.neighborhood,
      city: this.checkoutForm.value.city,
      state: this.checkoutForm.value.state,
      subtotal: this.orderSummary.subtotal,
      shipping: this.orderSummary.shipping,
      discount: this.orderSummary.discount,
      total: this.orderSummary.total,
      items: this.orderSummary.items,
      method: methodMap[this.selectedPaymentMethod],
      installments: this.selectedPaymentMethod === 'credit' ? this.selectedInstallments : undefined,
      cardToken: undefined,
      cardLast4: this.selectedPaymentMethod !== 'pix' && this.selectedPaymentMethod !== 'boleto'
        ? this.checkoutForm.value.cardNumber.slice(-4)
        : undefined,
      cardNumber: this.checkoutForm.value.cardNumber,
      cardName: this.checkoutForm.value.cardName,
      cardExpiry: this.checkoutForm.value.cardExpiry,
      cardCvv: this.checkoutForm.value.cardCvv
    };

    this.paymentService.checkout(payload).subscribe({
      next: (resp: PaymentResponse) => {
        this.isProcessing = false;

        switch (resp.status) {
          case 'APPROVED':
            this.router.navigate(['/pedido-confirmado'], {
              queryParams: { orderId: resp.orderId }
            });
            break;

          case 'DECLINED':
            alert('Pagamento recusado. Verifique os dados ou tente outro método.');
            break;

          case 'PENDING':
            if (payload.method === 'PIX' && resp.qrCodeBase64) {
              this.showPixModal(resp.qrCodeBase64, resp.qrCode);
            } else if (payload.method === 'BOLETO' && resp.boletoUrl) {
              window.open(resp.boletoUrl, '_blank');
              alert('Boleto gerado. Você pode efetuar o pagamento e aguardar a confirmação.');
            } else {
              alert('Pagamento pendente. Aguarde confirmação.');
            }
            break;

          default:
            alert(resp.message || 'Erro desconhecido ao processar pagamento.');
        }
      },
      error: (err: any) => {
        this.isProcessing = false;
        alert('Erro ao processar pagamento. Tente novamente.');
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/carrinho']);
  }
}
