import { Client } from './Client';
import { ClientId } from './ClientId';

export interface ClientsRepository {
  findById(id: ClientId): Promise<Client | undefined>;
  save(client: Client): Promise<void>;
}
