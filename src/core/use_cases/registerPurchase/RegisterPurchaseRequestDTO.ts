export interface RegisterPurchaseRequestDTO {
  invoice: {
    number: string;
    date: Date;
  };
  products: {
    id?: string;
    new?: {
      name: string;
      category: {
        id?: string;
        new?: string;
      };
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
