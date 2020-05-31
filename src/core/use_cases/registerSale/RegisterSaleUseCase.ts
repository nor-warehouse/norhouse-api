import { UseCase } from '../../../shared/application/UseCase';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Client } from '../../domain/client/Client';
import { ClientId } from '../../domain/client/ClientId';
import { ClientName } from '../../domain/client/ClientName';
import { ClientsRepository } from '../../domain/client/ClientsRepository';
import { Sale } from '../../domain/sale/Sale';
import { SalesRepository } from '../../domain/sale/SalesRepository';
import { Cuit } from '../../domain/shared/Cuit';
import { Mail } from '../../domain/shared/Mail';
import { Phone } from '../../domain/shared/Phone';
import { RegisterSaleRequestDTO, RegisterSaleRequestDTOClient } from './RegisterSaleRequestDTO';

export class RegisterSaleUseCase implements UseCase<RegisterSaleRequestDTO, Sale> {
  constructor(private salesRepo: SalesRepository, private clientsRepo: ClientsRepository) {}

  async execute(request: RegisterSaleRequestDTO): Promise<Sale> {
    const client = await this.handleRequestClient(request.client);
    const sale = Sale.create({ client });
    await this.salesRepo.save(sale);
    return sale;
  }

  private async handleRequestClient(request: RegisterSaleRequestDTOClient): Promise<Client> {
    if (request.id) {
      const clientId = ClientId.create(new UniqueEntityID(request.id));
      return await this.clientsRepo.findById(clientId);
    } else if (request.new) {
      const { cuit, mail, name, phone } = request.new;
      const client = Client.create({
        cuit: Cuit.create({ value: cuit }),
        mail: Mail.create({ value: mail }),
        name: ClientName.create({ value: name }),
        phone: Phone.create({ value: phone }),
      });
      await this.clientsRepo.save(client);
      return client;
    }
  }
}
