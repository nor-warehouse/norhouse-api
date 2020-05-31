import { ValueObject } from '../../../shared/core/ValueObject';

interface PhoneProps {
  value: string;
}

export class Phone extends ValueObject<PhoneProps> {
  private constructor(props: PhoneProps) {
    super(props);
  }

  public static create(props: PhoneProps): Phone {
    return new Phone(props);
  }

  get value(): string {
    return this.props.value;
  }
}
