import { Entity } from '../../../shared/core/Entity';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';

export class SaleId extends Entity<any> {
  get id(): UniqueEntityID {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): SaleId {
    return new SaleId(id);
  }
}
