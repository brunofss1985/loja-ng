export interface Order {
  id: number;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  status: string;
  paymentMethod: string;
  deliveryMethod: string;
  estimatedDelivery: string;
  trackingCode?: string;
  notes?: string;
  isGift: boolean;
  giftMessage?: string;
  createdAt: string;
  updatedAt: string;

  customer: {
    fullName: string;
    email: string;
    phone?: string;
  };

  items: {
    productId?: number;
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
    variation?: string;
  }[];

  statusHistory: {
    status: string;
    changedAt: string;
  }[];
}
