export interface RegisterPurchaseRequestDTOProduct {
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
}

export interface RegisterPurchaseRequestDTOInvoice {
  number: string;
  date: Date;
}

export interface RegisterPurchaseRequestDTOSupplier {
  id?: string;
  new?: {
    name: string;
    cuit: string;
    phone: string;
    mail: string;
  };
}

export interface RegisterPurchaseRequestDTO {
  invoice: RegisterPurchaseRequestDTOInvoice;
  products: RegisterPurchaseRequestDTOProduct[];
  supplier: RegisterPurchaseRequestDTOSupplier;
}
