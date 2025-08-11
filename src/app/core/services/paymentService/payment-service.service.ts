// payment.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CheckoutPayload {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  method: 'CREDIT' | 'DEBIT' | 'PIX' | 'BOLETO';
  installments?: number;
  cardToken?: string;
  cardLast4?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
}


export interface PaymentResponse {
  status: 'APPROVED' | 'DECLINED' | 'PENDING';
  orderId?: string;
  qrCodeBase64?: string;
  qrCode?: string;
  boletoUrl?: string;
  message?: string;
}


@Injectable({ providedIn: 'root' })
export class PaymentService {
  private base = `${environment.apiUrl}/checkout`;
  constructor(private http: HttpClient) {}
  checkout(payload: CheckoutPayload): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.base}`, payload);
  }
}
