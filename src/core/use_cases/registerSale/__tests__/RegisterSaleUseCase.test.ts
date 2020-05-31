/* eslint-disable @typescript-eslint/no-use-before-define */
import { UniqueEntityID } from '../../../../shared/core/UniqueEntityID';
import { Client } from '../../../domain/client/Client';
import { ClientName } from '../../../domain/client/ClientName';
import { ClientsRepository } from '../../../domain/client/ClientsRepository';
import { Sale } from '../../../domain/sale/Sale';
import { SaleId } from '../../../domain/sale/SaleId';
import { SalesRepository } from '../../../domain/sale/SalesRepository';
import { Cuit } from '../../../domain/shared/Cuit';
import { Mail } from '../../../domain/shared/Mail';
import { Phone } from '../../../domain/shared/Phone';
import { InMemoryClientsRepository } from '../../../infrastructure/client/InMemoryClientsRepository';
import { InMemorySalesRepository } from '../../../infrastructure/sale/InMemorySalesRepository';
import { RegisterSaleRequestDTO, RegisterSaleRequestDTOClient } from '../RegisterSaleRequestDTO';
import { RegisterSaleUseCase } from '../RegisterSaleUseCase';

let request: RegisterSaleRequestDTO = { client: { id: '5' } };
let salesRepo: SalesRepository = new InMemorySalesRepository();
let clientsRepo: ClientsRepository = new InMemoryClientsRepository();
let registerSale = new RegisterSaleUseCase(salesRepo, clientsRepo);

beforeEach(() => {
  salesRepo = new InMemorySalesRepository();
  clientsRepo = new InMemoryClientsRepository();
  registerSale = new RegisterSaleUseCase(salesRepo, clientsRepo);
});

test('Given a RegisterSaleRequestDTO, when sale is registered, then should create a Sale', async () => {
  const sale = await registerSale.execute(request);
  expect(sale).toBeInstanceOf(Sale);
});

test('Given a RegisterSaleRequestDTO, when sale is registered, then created Sale should have a SaleId', async () => {
  const sale = await registerSale.execute(request);
  expect(sale.saleId).toBeDefined();
  expect(sale.saleId).toBeInstanceOf(SaleId);
});

test('Given a RegisterSaleRequestDTO, when sale is registered, then created Sale should be persisted', async () => {
  const sale = await registerSale.execute(request);
  const persistedSale = await salesRepo.findById(sale.saleId);
  expect(persistedSale).toBeInstanceOf(Sale);
  expect(persistedSale.saleId.equals(sale.saleId)).toBe(true);
});

test('Given a RegisterSaleRequestDTO with client id, when sale is registered, then created Sale should have a Client', async () => {
  clientsRepo.findById = jest.fn().mockImplementationOnce(() => Promise.resolve(createFakeClient(request.client.id)));
  const sale = await registerSale.execute(request);
  expect(sale.client).toBeDefined();
  expect(sale.client).toBeInstanceOf(Client);
});

test('Given a RegisterSaleRequestDTO with new client, when sale is registered, then created Sale should have a Client', async () => {
  enhanceRequest({ client: { new: rawFakeClient } as RegisterSaleRequestDTOClient });
  const sale = await registerSale.execute(request);
  expect(sale.client).toBeDefined();
  expect(sale.client).toBeInstanceOf(Client);
});

test('Given a RegisterSaleRequestDTO with new client, when sale is registered, then created Client should be persisted', async () => {
  enhanceRequest({ client: { new: rawFakeClient } as RegisterSaleRequestDTOClient });
  const sale = await registerSale.execute(request);
  const persistedClient = await clientsRepo.findById(sale.client.clientId);
  expect(persistedClient).toBeInstanceOf(Client);
});

function enhanceRequest(props: object): void {
  request = { ...request, ...props };
}

const rawFakeClient: RegisterSaleRequestDTOClient['new'] = {
  cuit: 'some-cuit',
  mail: 'some-mail',
  name: 'some-name',
  phone: 'some-phone',
};

function createFakeClient(id?: string): Client {
  const idOrNot = id ? new UniqueEntityID(id) : undefined;
  return Client.create(
    {
      cuit: Cuit.create({ value: rawFakeClient.cuit }),
      mail: Mail.create({ value: rawFakeClient.mail }),
      name: ClientName.create({ value: rawFakeClient.name }),
      phone: Phone.create({ value: rawFakeClient.phone }),
    },
    idOrNot,
  );
}
