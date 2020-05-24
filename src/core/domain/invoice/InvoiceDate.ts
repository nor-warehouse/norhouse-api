import { ValueObject } from '../../../shared/core/ValueObject';

interface InvoiceDateProps {
  value: Date;
}

export class InvoiceDate extends ValueObject<InvoiceDateProps> {
  private constructor(props: InvoiceDateProps) {
    super(props);
  }

  public static create(props: InvoiceDateProps): InvoiceDate {
    return new InvoiceDate(props);
  }

  get value(): Date {
    return this.props.value;
  }
}
