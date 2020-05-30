import { Entity } from '../../../shared/core/Entity';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { SaleId } from './SaleId';

interface SaleProps {}

export class Sale extends Entity<SaleProps> {
  private constructor(props: SaleProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: SaleProps, id?: UniqueEntityID): Sale {
    return new Sale(props, id);
  }

  get saleId(): SaleId {
    return SaleId.create(this._id);
  }
}
