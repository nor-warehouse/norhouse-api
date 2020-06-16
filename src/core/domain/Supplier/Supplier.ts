import { Entity } from '../../../shared/core/Entity';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Cuit } from '../shared/Cuit';
import { Mail } from '../shared/Mail';
import { Phone } from '../shared/Phone';
import { SupplierId } from './SupplierId';
import { SupplierName } from './SupplierName';

interface SupplierProps {
  cuit: Cuit;
  mail: Mail;
  name: SupplierName;
  phone: Phone;
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

  get cuit(): Cuit {
    return this.props.cuit;
  }

  get mail(): Mail {
    return this.props.mail;
  }

  get name(): SupplierName {
    return this.props.name;
  }

  get phone(): Phone {
    return this.props.phone;
  }
}
