import { ValueObject } from '../../../../shared/core/ValueObject';

interface CategoryNameProps {
  value: string;
}

export class CategoryName extends ValueObject<CategoryNameProps> {
  private constructor(props: CategoryNameProps) {
    super(props);
  }

  public static create(props: CategoryNameProps): CategoryName {
    return new CategoryName(props);
  }

  get value(): string {
    return this.props.value;
  }
}
