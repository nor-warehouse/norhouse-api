import { Router } from 'express';
import { registerPurchaseRoute } from './registerPurchase';

const purchaseRouter = Router();

registerPurchaseRoute(purchaseRouter);

export { purchaseRouter };
