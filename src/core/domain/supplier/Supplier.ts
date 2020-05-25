import { Entity } from '../../../shared/core/Entity';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { SupplierCuit } from './SupplierCuit';
import { SupplierId } from './SupplierId';
import { SupplierMail } from './SupplierMail';
import { SupplierName } from './SupplierName';
import { SupplierPhone } from './SupplierPhone';

interface SupplierProps {
  cuit: SupplierCuit;
  mail: SupplierMail;
  name: SupplierName;
  phone: SupplierPhone;
}

export class Supplier extends Entity<SupplierProps> {
  private constructor(props: SupplierProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: SupplierProps, id?: UniqueEntityID): Supplier {
    return new Supplier(props, id);
  }

  get supplierId(): SupplierId {
    return SupplierId.create(this._id);
  }

  get cuit(): SupplierCuit {
    return this.props.cuit;
  }

  get mail(): SupplierMail {
    return this.props.mail;
  }

  get name(): SupplierName {
    return this.props.name;
  }

  get phone(): SupplierPhone {
    return this.props.phone;
  }
}
