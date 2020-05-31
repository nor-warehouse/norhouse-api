import { ValueObject } from '../../../shared/core/ValueObject';

interface TransactionProductQuantityProps {
  value: number;
}

export class TransactionProductQuantity extends ValueObject<TransactionProductQuantityProps> {
  private constructor(props: TransactionProductQuantityProps) {
    super(props);
  }

  public static create(props: TransactionProductQuantityProps): TransactionProductQuantity {
    return new TransactionProductQuantity(props);
  }

  get value(): number {
    return this.props.value;
  }
}
