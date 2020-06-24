import { Express } from 'express';
import { productsRouter } from './products';
import { purchaseRouter } from './purchase';

export default function setupRoutes(api: Express): void {
  api.get('/api', (req, res) => res.send('<h1>NorHouse</h1>'));
  api.use('/api/purchase', purchaseRouter);
  api.use('/api/products', productsRouter);
}
