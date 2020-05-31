import { Entity } from '../../../shared/core/Entity';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Client } from '../client/Client';
import { Invoice } from '../invoice/Invoice';
import { SaleId } from './SaleId';

interface SaleProps {
  client: Client;
  invoice: Invoice;
}

export class Sale extends Entity<SaleProps> {
  private constructor(props: SaleProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: SaleProps, id?: UniqueEntityID): Sale {
    return new Sale(props, id);
  }

  get saleId(): SaleId {
    return SaleId.create(this._id);
  }

  get client(): Client {
    return this.props.client;
  }

  get invoice(): Invoice {
    return this.props.invoice;
  }
}
