import { Router } from 'express';
import { getAllProductsRoute } from './getAllProducts';

const productsRouter = Router();

getAllProductsRoute(productsRouter);

export { productsRouter };
