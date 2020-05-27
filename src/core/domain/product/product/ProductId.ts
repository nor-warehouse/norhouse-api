import { Entity } from '../../../../shared/core/Entity';
import { UniqueEntityID } from '../../../../shared/core/UniqueEntityID';

export class ProductId extends Entity<any> {
  get id(): UniqueEntityID {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): ProductId {
    return new ProductId(id);
  }
}
