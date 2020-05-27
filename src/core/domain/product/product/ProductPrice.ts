import { ValueObject } from '../../../../shared/core/ValueObject';

interface ProductPriceProps {
  value: number;
}

export class ProductPrice extends ValueObject<ProductPriceProps> {
  private constructor(props: ProductPriceProps) {
    super(props);
  }

  public static create(props: ProductPriceProps): ProductPrice {
    return new ProductPrice(props);
  }

  get value(): number {
    return this.props.value;
  }
}
