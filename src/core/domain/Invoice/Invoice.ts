import { Entity } from '../../../shared/core/Entity';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { InvoiceDate } from './InvoiceDate';
import { InvoiceId } from './InvoiceId';
import { InvoiceNumber } from './InvoiceNumber';
import { InvoiceType } from './InvoiceType';

interface InvoiceProps {
  date: InvoiceDate;
  number: InvoiceNumber;
  type: InvoiceType;
}

export class Invoice extends Entity<InvoiceProps> {
  private constructor(props: InvoiceProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: InvoiceProps, id?: UniqueEntityID): Invoice {
    return new Invoice(props, id);
  }

  get invoiceId(): InvoiceId {
    return InvoiceId.create(this._id);
  }

  get date(): InvoiceDate {
    return this.props.date;
  }

  get number(): InvoiceNumber {
    return this.props.number;
  }

  get type(): InvoiceType {
    return this.props.type;
  }
}
