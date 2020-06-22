import { Request, Response } from 'express';

export abstract class BaseController {
  protected abstract async executeImpl(req: Request, res: Response): Promise<void | any>;

  public async execute(req: Request, res: Response): Promise<void> {
    try {
      await this.executeImpl(req, res);
    } catch (err) {
      console.log('[BaseController]: Uncaught controller error');
      console.log(err);
      this.fail(res, 'An unexpected error occurred');
    }
  }

  public static jsonResponse(res: Response, code: number, message: string): Response {
    return res.status(code).json({ message });
  }

  public ok<T>(res: Response, dto?: T, status = 200): Response {
    if (!!dto) {
      res.type('application/json');
      console.log(dto);
      return res.status(status).json(dto);
    } else {
      return res.sendStatus(status);
    }
  }

  public created<T>(res: Response, dto?: T): Response {
    return this.ok<T>(res, dto, 201);
  }

  public clientError(res: Response, message?: string): Response {
    return BaseController.jsonResponse(res, 400, message ? message : 'Unauthorized');
  }

  public unauthorized(res: Response, message?: string): Response {
    return BaseController.jsonResponse(res, 401, message ? message : 'Unauthorized');
  }

  public forbidden(res: Response, message?: string): Response {
    return BaseController.jsonResponse(res, 403, message ? message : 'Forbidden');
  }

  public notFound(res: Response, message?: string): Response {
    return BaseController.jsonResponse(res, 404, message ? message : 'Not found');
  }

  public fail(res: Response, error: Error | string): Response {
    console.log(error);
    return res.status(500).json({
      message: error.toString(),
    });
  }
}
