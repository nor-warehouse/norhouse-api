import { ValueObject } from '../../../shared/core/ValueObject';

interface SupplierPhoneProps {
  value: string;
}

export class SupplierPhone extends ValueObject<SupplierPhoneProps> {
  private constructor(props: SupplierPhoneProps) {
    super(props);
  }

  public static create(props: SupplierPhoneProps): SupplierPhone {
    return new SupplierPhone(props);
  }

  get value(): string {
    return this.props.value;
  }
}
