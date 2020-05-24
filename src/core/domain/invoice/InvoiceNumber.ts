import { ValueObject } from '../../../shared/core/ValueObject';

interface InvoiceNumberProps {
  value: string;
}

export class InvoiceNumber extends ValueObject<InvoiceNumberProps> {
  private constructor(props: InvoiceNumberProps) {
    super(props);
  }

  public static create(props: InvoiceNumberProps): InvoiceNumber {
    return new InvoiceNumber(props);
  }

  get value(): string {
    return this.props.value;
  }
}
