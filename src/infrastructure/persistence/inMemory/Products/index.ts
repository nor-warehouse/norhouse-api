import { PaginationService } from '../../../../shared/infrastructure/services/PaginationService';
import { InMemoryProductsRepository } from './InMemoryProductsRepository';

export const productsRepo = new InMemoryProductsRepository(new PaginationService());
