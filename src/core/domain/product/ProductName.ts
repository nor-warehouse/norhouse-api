import { ValueObject } from '../../../shared/core/ValueObject';

interface ProductNameProps {
  value: string;
}

export class ProductName extends ValueObject<ProductNameProps> {
  private constructor(props: ProductNameProps) {
    super(props);
  }

  public static create(props: ProductNameProps): ProductName {
    return new ProductName(props);
  }

  get value(): string {
    return this.props.value;
  }
}
