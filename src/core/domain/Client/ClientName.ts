import { ValueObject } from '../../../shared/core/ValueObject';

interface ClientNameProps {
  value: string;
}

export class ClientName extends ValueObject<ClientNameProps> {
  private constructor(props: ClientNameProps) {
    super(props);
  }

  public static create(props: ClientNameProps): ClientName {
    return new ClientName(props);
  }

  get value(): string {
    return this.props.value;
  }
}
