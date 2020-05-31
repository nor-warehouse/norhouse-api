import { Client } from '../../domain/client/Client';
import { ClientId } from '../../domain/client/ClientId';
import { ClientsRepository } from '../../domain/client/ClientsRepository';

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
