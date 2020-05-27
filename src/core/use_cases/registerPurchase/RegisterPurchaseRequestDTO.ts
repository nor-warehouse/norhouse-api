export interface RegisterPurchaseRequestDTO {
  invoice: {
    number: string;
    date: Date;
  };
  products: {
    category: {
      id?: string;
      new?: string;
    };
    product: {
      id?: string;
      new?: string;
    };
    price: number;
    quantity: number;
  }[];
  supplier: {
    id?: string;
    new?: {
      name: string;
      cuit: string;
      phone: string;
      mail: string;
    };
  };
}
