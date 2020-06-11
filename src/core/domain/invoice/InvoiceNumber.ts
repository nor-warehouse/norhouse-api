import { ValueObject } from '../../../shared/core/ValueObject';
import * as InvoiceErrors from './errors/InvoiceErrors';

interface InvoiceNumberProps {
  value: string;
}

export class InvoiceNumber extends ValueObject<InvoiceNumberProps> {
  private constructor(props: InvoiceNumberProps) {
    super(props);
  }

  public static create(props: InvoiceNumberProps): InvoiceNumber {
    if (!props.value) {
      throw InvoiceErrors.InvalidNumberError;
    }

    return new InvoiceNumber(props);
  }

  get value(): string {
    return this.props.value;
  }
}
