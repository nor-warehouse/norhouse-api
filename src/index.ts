import * as express from 'express';
import { purchaseRouter } from './delivery/http/api/routes';

const app = express();
const port = 8080;

app.use(express.json());

app.use('/api/purchase', purchaseRouter);

app.listen(port, () => console.log(`Typescript app listening on port ${port}!`));
