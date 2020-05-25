import { ValueObject } from '../../../shared/core/ValueObject';

interface SupplierCuitProps {
  value: string;
}

export class SupplierCuit extends ValueObject<SupplierCuitProps> {
  private constructor(props: SupplierCuitProps) {
    super(props);
  }

  public static create(props: SupplierCuitProps): SupplierCuit {
    return new SupplierCuit(props);
  }

  get value(): string {
    return this.props.value;
  }
}
