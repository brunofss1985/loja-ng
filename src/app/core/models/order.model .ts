export interface Order {
  id: number;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  status: string;
  customer: {
    email: string;
  };
  items: any[];
  createdAt: string;
  updatedAt: string;
}
