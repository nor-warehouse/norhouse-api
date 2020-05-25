import { ValueObject } from '../../../shared/core/ValueObject';

interface SupplierNameProps {
  value: string;
}

export class SupplierName extends ValueObject<SupplierNameProps> {
  private constructor(props: SupplierNameProps) {
    super(props);
  }

  public static create(props: SupplierNameProps): SupplierName {
    return new SupplierName(props);
  }

  get value(): string {
    return this.props.value;
  }
}
