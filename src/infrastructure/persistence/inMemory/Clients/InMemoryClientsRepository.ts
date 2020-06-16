import { Client } from '../../../../core/domain/Client/Client';
import { ClientId } from '../../../../core/domain/Client/ClientId';
import { ClientsRepository } from '../../../../core/domain/Client/ClientsRepository';

export class InMemoryClientsRepository implements ClientsRepository {
  private clients: Client[] = [];

  findById(id: ClientId): Promise<Client | undefined> {
    const client = this.clients.find(client => client.clientId.equals(id));
    return Promise.resolve(client);
  }

  save(client: Client): Promise<void> {
    this.clients = this.clients.concat(client);
    return Promise.resolve();
  }
}
