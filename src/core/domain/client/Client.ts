import { Entity } from '../../../shared/core/Entity';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Cuit } from '../shared/Cuit';
import { Mail } from '../shared/Mail';
import { Phone } from '../shared/Phone';
import { ClientId } from './ClientId';
import { ClientName } from './ClientName';

interface ClientProps {
  cuit: Cuit;
  mail: Mail;
  name: ClientName;
  phone: Phone;
}

export class Client extends Entity<ClientProps> {
  private constructor(props: ClientProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: ClientProps, id?: UniqueEntityID): Client {
    return new Client(props, id);
  }

  get clientId(): ClientId {
    return ClientId.create(this._id);
  }

  get cuit(): Cuit {
    return this.props.cuit;
  }

  get mail(): Mail {
    return this.props.mail;
  }

  get name(): ClientName {
    return this.props.name;
  }

  get phone(): Phone {
    return this.props.phone;
  }
}
