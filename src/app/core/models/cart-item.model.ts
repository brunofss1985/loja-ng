// src/app/shared/models/cart-item.model.ts
export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  icon: string; // pode ser emoji ou URL/dataURL
}
