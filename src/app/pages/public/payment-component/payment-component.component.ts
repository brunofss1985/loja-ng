import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  PaymentService,
  PaymentResponse,
  CheckoutPayload,
} from 'src/app/core/services/paymentService/payment-service.service';
import { CartService } from 'src/app/core/services/cartService/cart-service.service';
import { CartItem } from 'src/app/core/models/cart-item.model';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import { environment } from 'src/environments/environment';

declare var MercadoPago: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment-component.component.html',
  styleUrls: ['./payment-component.component.scss'],
})
export class PaymentComponent implements OnInit, AfterViewInit {
  checkoutForm: FormGroup;
  selectedPaymentMethod: string = 'credit';
  selectedInstallments: number = 1;
  isProcessing: boolean = false;
  pixModalOpen = false;
  pixQrBase64 = '';
  pixCopiaCola = '';
  userId = '';
  isLoggedIn: boolean = false;

  orderSummary = {
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    items: [] as CartItem[],
  };

  paymentMethods = [
    {
      id: 'credit',
      name: 'Cartão de Crédito',
      icon: '💳',
      installments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    { id: 'debit', name: 'Cartão de Débito', icon: '💳' },
    { id: 'pix', name: 'PIX', icon: '📱' },
    { id: 'boleto', name: 'Boleto Bancário', icon: '🧾' },
  ];

  private mp: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private paymentService: PaymentService,
    private cartService: CartService,
    private auth: AuthService
  ) {
    this.checkoutForm = this.createForm();
  }

  ngOnInit(): void {
    const user = this.auth.getUser();
    this.isLoggedIn = !!user;

    if (this.isLoggedIn) {
      this.userId = user.email;
      this.checkoutForm.patchValue({
        fullName: user.name,
        email: user.email,
      });
    }

    this.orderSummary = {
      subtotal: this.cartService.getSubtotal(),
      shipping: this.cartService.getShipping(),
      discount: this.cartService.getDiscount(),
      total: this.cartService.getTotal(),
      items: this.cartService.getCartItemsSnapshot(),
    };
  }

  ngAfterViewInit(): void {
    this.mp = new MercadoPago(environment.mercadoPagoPublicKey, {
      locale: 'pt-BR',
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)],
      ],
      cpf: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
        ],
      ],
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
      cardCvv: [''],
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
    Object.keys(this.checkoutForm.controls).forEach((key) => {
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
    this.checkoutForm
      .get('cardNumber')
      ?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/),
      ]);
    this.checkoutForm.get('cardName')?.setValidators([Validators.required]);
    this.checkoutForm
      .get('cardExpiry')
      ?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{2}\/\d{2}$/),
      ]);
    this.checkoutForm
      .get('cardCvv')
      ?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    this.updateCardValidators();
  }

  private removeCardValidators(): void {
    ['cardNumber', 'cardName', 'cardExpiry', 'cardCvv'].forEach((field) => {
      this.checkoutForm.get(field)?.clearValidators();
      this.checkoutForm.get(field)?.updateValueAndValidity();
    });
  }

  private updateCardValidators(): void {
    ['cardNumber', 'cardName', 'cardExpiry', 'cardCvv'].forEach((field) => {
      this.checkoutForm.get(field)?.updateValueAndValidity();
    });
  }

  // Novo método para limpar o formulário completo
  private resetForm(): void {
    this.checkoutForm.reset();
    // Re-inicia o formulário com o estado inicial e as validações
    this.checkoutForm = this.createForm();
    if (this.isLoggedIn) {
        this.checkoutForm.patchValue({
          fullName: this.auth.getUser().name,
          email: this.auth.getUser().email,
        });
    }
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

  private searchAddressByCep(cep: string): void {}

  showPixModal(qrBase64: string, copiaCola?: string) {
    if (!qrBase64) return;
    this.pixQrBase64 = qrBase64;
    this.pixCopiaCola = copiaCola || '';
    this.pixModalOpen = true;
  }

  // Atualizado para navegar para a tela de resultado ao fechar o modal
  closePixModal() {
    this.pixModalOpen = false;
    this.router.navigate(['/payment-result'], {
      // Você pode adicionar queryParams aqui, se necessário
      queryParams: { paymentMethod: 'pix' },
    });
  }

  copyPix() {
    // Implementação para copiar o código PIX para a área de transferência
    const textarea = document.createElement('textarea');
    textarea.value = this.pixCopiaCola;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  async processPayment(): Promise<void> {
    if (!this.checkoutForm.valid) {
      this.markFormGroupTouched();
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.isProcessing = true;
    const user = this.auth.getUser();
    const userEmail = this.checkoutForm.value.email;

    const methodMap: any = {
      credit: 'CREDIT',
      debit: 'DEBIT',
      pix: 'PIX',
      boleto: 'BOLETO',
    };

    const paymentMethod = this.selectedPaymentMethod;
    let cardToken = '';
    let paymentMethodId = '';

    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      try {
        const cardData = {
          cardNumber: this.checkoutForm.value.cardNumber.replace(/\s/g, ''),
          cardholderName: this.checkoutForm.value.cardName,
          cardExpirationMonth: this.checkoutForm.value.cardExpiry.substring(0, 2),
          cardExpirationYear: this.checkoutForm.value.cardExpiry.substring(3, 5),
          securityCode: this.checkoutForm.value.cardCvv,
        };

        const cardBin = cardData.cardNumber.substring(0, 6);
        const paymentMethods = await this.mp.getPaymentMethods({ bin: cardBin });

        if (paymentMethods && paymentMethods.results && paymentMethods.results.length > 0) {
          paymentMethodId = paymentMethods.results[0].id;
        } else {
          this.isProcessing = false;
          alert('Bandeira do cartão não encontrada.');
          return;
        }

        const tokenResult = await this.mp.createCardToken(cardData);
        cardToken = tokenResult.id;

      } catch (err: any) {
        this.isProcessing = false;
        alert('Erro ao gerar token do cartão. Verifique os dados.');
        console.error('Erro ao criar token do cartão:', err);
        return;
      }
    }

    const payload: CheckoutPayload = {
      fullName: this.checkoutForm.value.fullName,
      email: userEmail,
      phone: this.checkoutForm.value.phone,
      cpf: this.checkoutForm.value.cpf.replace(/\D/g, ''),
      cep: this.checkoutForm.value.cep.replace(/\D/g, ''),
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
      method: methodMap[paymentMethod],
      installments: paymentMethod === 'credit' ? this.selectedInstallments : undefined,
      cardToken: cardToken,
      paymentMethodId: paymentMethodId,
    };

    this.paymentService.checkout(payload).subscribe({
      next: (resp: PaymentResponse) => {
        this.cartService.clearCartLocal();
        if (user) {
          this.cartService.clearCartBack(user.email).subscribe({
            next: () => console.log('Carrinho no backend limpo com sucesso!'),
            error: (err: any) =>
              console.error('Erro ao limpar o carrinho no backend:', err),
          });
        }

        this.isProcessing = false;
        switch (resp.status) {
          case 'APPROVED':
            this.resetForm();
            this.router.navigate(['/payment-result'], {
              queryParams: { orderId: resp.orderId },
            });
            break;
          case 'DECLINED':
            alert(
              resp.message ||
                'Pagamento recusado. Verifique os dados ou tente outro método.'
            );
            break;
          case 'PENDING':
            this.resetForm();
            if (this.selectedPaymentMethod === 'pix' && resp.qrCodeBase64) {
              this.showPixModal(resp.qrCodeBase64, resp.qrCode);
              // A navegação agora acontece ao fechar o modal ou por webhook
            } else if (this.selectedPaymentMethod === 'boleto' && resp.boletoUrl) {
              window.open(resp.boletoUrl, '_blank');
              alert(
                'Boleto gerado! Efetue o pagamento e aguarde a confirmação.'
              );
              this.router.navigate(['/payment-result'], {
                queryParams: { orderId: resp.orderId, paymentMethod: 'boleto' },
              });
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
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/carrinho']);
  }
}
