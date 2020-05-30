import { UseCase } from '../../../shared/application/UseCase';
import { Sale } from '../../domain/sale/Sale';
import { SalesRepository } from '../../domain/sale/SalesRepository';
import { RegisterSaleRequestDTO } from './RegisterSaleRequestDTO';

export class RegisterSaleUseCase implements UseCase<RegisterSaleRequestDTO, Sale> {
  constructor(private salesRepo: SalesRepository) {}

  async execute(request: RegisterSaleRequestDTO): Promise<Sale> {
    const sale = Sale.create({});
    await this.salesRepo.save(sale);
    return sale;
  }
}
