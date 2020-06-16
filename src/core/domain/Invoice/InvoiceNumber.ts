import { ValueObject } from '../../../shared/core/ValueObject';
import * as InvoiceErrors from './errors/InvoiceErrors';

interface InvoiceNumberProps {
  value: string | number;
}

export class InvoiceNumber extends ValueObject<InvoiceNumberProps> {
  private constructor(props: InvoiceNumberProps) {
    super(props);
  }

  public static create({ value }: InvoiceNumberProps): InvoiceNumber {
    const trimmedValue = `${value}`.trim();

    if (!trimmedValue) throw InvoiceErrors.InvalidNumberError;

    return new InvoiceNumber({ value: trimmedValue });
  }

  get value(): string {
    return this.props.value as string;
  }
}
