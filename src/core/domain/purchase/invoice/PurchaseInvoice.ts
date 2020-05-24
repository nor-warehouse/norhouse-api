import { ValueObject } from '../../../../shared/core/ValueObject';
import { InvoiceDate } from '../../invoice/InvoiceDate';
import { InvoiceNumber } from '../../invoice/InvoiceNumber';

interface PurchaseInvoiceProps {
  value: {
    date: InvoiceDate;
    number: InvoiceNumber;
  };
}

export class PurchaseInvoice extends ValueObject<PurchaseInvoiceProps> {
  private constructor(props: PurchaseInvoiceProps) {
    super(props);
  }

  public static create(props: PurchaseInvoiceProps): PurchaseInvoice {
    return new PurchaseInvoice(props);
  }

  get date(): InvoiceDate {
    return this.props.value.date;
  }

  get number(): InvoiceNumber {
    return this.props.value.number;
  }
}
