import { Request, Response } from 'express';
import { PurchaseDTO } from '../../../../../../core/domain/Purchase/PurchaseDTO';
import { PurchaseMapper } from '../../../../../../core/domain/Purchase/PurchaseMapper';
import { RegisterPurchase } from '../../../../../../core/use_cases/registerPurchase/RegisterPurchase';
import { RegisterPurchaseRequestDTO } from '../../../../../../core/use_cases/registerPurchase/RegisterPurchaseRequestDTO';
import { BaseController } from '../../../../../../shared/delivery/http/api/models/BaseController';

export class RegisterPurchaseController extends BaseController {
  constructor(private useCase: RegisterPurchase) {
    super();
  }

  protected async executeImpl(request: Request, response: Response): Promise<any> {
    try {
      const requestDTO = request.body as RegisterPurchaseRequestDTO;
      const purchase = await this.useCase.execute(requestDTO);
      const responseDTO = PurchaseMapper.toDTO(purchase);
      return this.created<PurchaseDTO>(response, responseDTO);
    } catch (error) {
      return this.fail(response, error);
    }
  }
}
