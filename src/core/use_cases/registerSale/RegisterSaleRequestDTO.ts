export interface RegisterSaleRequestDTOClient {
  id?: string;
  new?: {
    name: string;
    cuit: string;
    phone: string;
    mail: string;
  };
}

export interface RegisterSaleRequestDTOInvoice {
  number: string;
  date: Date;
}

export interface RegisterSaleRequestDTOProduct {
  id: string;
  price: number;
  quantity: number;
}

export interface RegisterSaleRequestDTO {
  client: RegisterSaleRequestDTOClient;
  invoice: RegisterSaleRequestDTOInvoice;
  // products: RegisterSaleRequestDTOProduct[];
}
