import { Purchase } from './Purchase';
import { PurchaseDTO } from './PurchaseDTO';

export class PurchaseMapper {
  static toDTO(purchase: Purchase): PurchaseDTO {
    return {
      invoice: {
        id: purchase.invoice.invoiceId.id.toString(),
        number: purchase.invoice.number.value,
      },
      supplier: { id: purchase.supplier.supplierId.id.toString() },
      products: purchase.products.map(product => ({
        id: product.productId.id.toString(),
        name: 'name',
        price: product.price.value,
        quantity: product.quantity.value,
        totalPrice: product.totalPrice,
      })),
    };
  }
}
