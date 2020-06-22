import { ValueObject } from '../../../shared/core/ValueObject';
import * as InvoiceErrors from './errors/InvoiceErrors';

interface InvoiceDateProps {
  value: Date;
}

export class InvoiceDate extends ValueObject<InvoiceDateProps> {
  private constructor(props: InvoiceDateProps) {
    super(props);
  }

  public static create(props: InvoiceDateProps): InvoiceDate {
    if (!(props.value instanceof Date)) {
      // throw InvoiceErrors.InvalidDateError;
    }
    return new InvoiceDate(props);
  }

  get value(): Date {
    return this.props.value;
  }
}
