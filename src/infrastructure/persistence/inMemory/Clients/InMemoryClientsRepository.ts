import { Client } from '../../../../core/domain/client/Client';
import { ClientId } from '../../../../core/domain/client/ClientId';
import { ClientsRepository } from '../../../../core/domain/client/ClientsRepository';

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
