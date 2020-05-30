import { ValueObject } from '../../../shared/core/ValueObject';

interface ProductStockProps {
  value: number;
}

export class ProductStock extends ValueObject<ProductStockProps> {
  private constructor(props: ProductStockProps) {
    super(props);
  }

  public static create(props: ProductStockProps): ProductStock {
    return new ProductStock(props);
  }

  get value(): number {
    return this.props.value;
  }

  public add(value: number): ProductStock {
    return ProductStock.create({ value: this.value + value });
  }
}
