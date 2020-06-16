export interface PurchaseDTO {
  invoice: {
    id: string;
    number: string;
  };
  supplier: {
    id: string;
  };
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }[];
}
