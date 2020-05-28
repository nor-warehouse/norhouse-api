import * as express from 'express';
import { purchasesRouter } from './core/infrastructure/purchase/purchasesRouter';

const app = express();
const port = 8080;

app.use(express.json());

app.use('/api/purchases', purchasesRouter);

app.listen(port, () => console.log(`Typescript app listening on port ${port}!`));
