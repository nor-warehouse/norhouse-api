import { ValueObject } from '../../../shared/core/ValueObject';

interface CuitProps {
  value: string;
}

export class Cuit extends ValueObject<CuitProps> {
  private constructor(props: CuitProps) {
    super(props);
  }

  public static create(props: CuitProps): Cuit {
    return new Cuit(props);
  }

  get value(): string {
    return this.props.value;
  }
}
