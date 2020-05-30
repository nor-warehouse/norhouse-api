import { Entity } from '../../../../shared/core/Entity';
import { UniqueEntityID } from '../../../../shared/core/UniqueEntityID';
import { Invoice } from '../../invoice/Invoice';
import { SupplierId } from '../../supplier/SupplierId';
import { PurchaseProduct } from '../product/PurchaseProduct';
import { PurchaseId } from './PurchaseId';

interface PurchaseProps {
  invoice: Invoice;
  supplierId: SupplierId;
  products: PurchaseProduct[];
}

export class Purchase extends Entity<PurchaseProps> {
  private constructor(props: PurchaseProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: PurchaseProps, id?: UniqueEntityID): Purchase {
    return new Purchase(props, id);
  }

  get purchaseId(): PurchaseId {
    return PurchaseId.create(this._id);
  }

  get invoice(): Invoice {
    return this.props.invoice;
  }

  get supplierId(): SupplierId {
    return this.props.supplierId;
  }

  get products(): PurchaseProduct[] {
    return this.props.products;
  }
}
