import { Router } from 'express';
import { GetAllProducts } from '../../../../../../core/use_cases/getAllProducts/GetAllProducts';
import { productsRepo } from '../../../../../../infrastructure/persistence/inMemory/Products';
import { GetAllProductsController } from './GetAllProductsController';
import { withPagination } from '../../../../../../shared/delivery/http/api/middlewares/withPagination';

const getAllProducts = new GetAllProducts(productsRepo);
const getAllProductsController = new GetAllProductsController(getAllProducts);

export const getAllProductsRoute = (router: Router): void => {
  router.get('/list', withPagination, (req, res) => getAllProductsController.execute(req, res));
};
