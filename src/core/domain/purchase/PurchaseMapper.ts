import { Purchase } from './Purchase';
import { PurchaseDTO } from './PurchaseDTO';

export class PurchaseMapper {
  static toDTO(purchase: Purchase): PurchaseDTO {
    return {
      invoice: {
        date: purchase.invoice.date.value,
        number: purchase.invoice.number.value,
      },
      supplierId: purchase.supplierId.id.toString(),
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
