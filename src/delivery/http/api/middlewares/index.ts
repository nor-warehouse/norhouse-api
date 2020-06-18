import * as express from 'express';
import { Express } from 'express';

export default function setupMiddlewares(api: Express): void {
  api.use(express.json());
}
