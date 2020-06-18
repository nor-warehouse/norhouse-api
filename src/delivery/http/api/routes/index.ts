import { Express } from 'express';
import { purchaseRouter } from './purchase';

export default function setupRoutes(api: Express): void {
  api.use('/api/purchase', purchaseRouter);
}
