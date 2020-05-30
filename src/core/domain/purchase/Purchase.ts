import { Entity } from '../../../shared/core/Entity';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Invoice } from '../invoice/Invoice';
import { Supplier } from '../supplier/Supplier';
import { PurchaseProduct } from './product/PurchaseProduct';
import { PurchaseId } from './PurchaseId';
import { PurchaseTotal } from './PurchaseTotal';

interface PurchaseProps {
  invoice: Invoice;
  supplier: Supplier;
  products: PurchaseProduct[];
  total: PurchaseTotal;
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

  get supplier(): Supplier {
    return this.props.supplier;
  }

  get products(): PurchaseProduct[] {
    return this.props.products;
  }

  get total(): PurchaseTotal {
    return this.props.total;
  }
}
