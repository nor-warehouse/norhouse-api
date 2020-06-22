import { Express } from 'express';
import { productsRouter } from './products';
import { purchaseRouter } from './purchase';

export default function setupRoutes(api: Express): void {
  api.use('/api/purchase', purchaseRouter);
  api.use('/api/products', productsRouter);
}
