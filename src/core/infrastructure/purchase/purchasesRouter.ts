import { Router } from 'express';
import { registerPurchaseController } from '../../use_cases/registerPurchase';

const purchasesRouter = Router();

purchasesRouter.post('/create', (req, res) => registerPurchaseController.execute(req, res));

export { purchasesRouter };
