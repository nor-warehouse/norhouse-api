import { Request, Response, NextFunction } from "express";

export function withPagination(req: Request, res: Response, next: NextFunction): void {
  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);
  req.pagination = {
    page: isNaN(page) ? 1 : Math.max(page, 1),
    limit: isNaN(limit) ? 10 : Math.max(Math.min(50, limit), 0),
  };
  return next();
}