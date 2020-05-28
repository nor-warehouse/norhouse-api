export interface PurchaseDTO {
  invoice: {
    number: string;
    date: Date;
  };
  supplierId: string;
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }[];
}
