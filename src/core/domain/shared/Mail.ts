import { ValueObject } from '../../../shared/core/ValueObject';

interface MailProps {
  value: string;
}

export class Mail extends ValueObject<MailProps> {
  private constructor(props: MailProps) {
    super(props);
  }

  public static create(props: MailProps): Mail {
    return new Mail(props);
  }

  get value(): string {
    return this.props.value;
  }
}
