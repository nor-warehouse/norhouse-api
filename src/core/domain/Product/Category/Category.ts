import { Entity } from '../../../../shared/core/Entity';
import { UniqueEntityID } from '../../../../shared/core/UniqueEntityID';
import { CategoryId } from './CategoryId';
import { CategoryName } from './CategoryName';

interface CategoryProps {
  name: CategoryName;
}

export class Category extends Entity<CategoryProps> {
  private constructor(props: CategoryProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: CategoryProps, id?: UniqueEntityID): Category {
    return new Category(props, id);
  }

  get categoryId(): CategoryId {
    return CategoryId.create(this._id);
  }

  get name(): CategoryName {
    return this.props.name;
  }
}
