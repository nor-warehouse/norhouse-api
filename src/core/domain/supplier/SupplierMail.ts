import { ValueObject } from '../../../shared/core/ValueObject';

interface SupplierMailProps {
  value: string;
}

export class SupplierMail extends ValueObject<SupplierMailProps> {
  private constructor(props: SupplierMailProps) {
    super(props);
  }

  public static create(props: SupplierMailProps): SupplierMail {
    return new SupplierMail(props);
  }

  get value(): string {
    return this.props.value;
  }
}
