import * as express from 'express';
import setupRoutes from './routes';
import setupMiddlewares from './middlewares';

const api = express();

setupMiddlewares(api);
setupRoutes(api);

export default function runAPI(port = 8080): void {
  api.listen(port, () => console.log(`API listening on port ${port}!`));
}
