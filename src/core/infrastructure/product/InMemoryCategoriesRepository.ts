import { CategoriesRepository } from '../../domain/product/category/CategoriesRepository';
import { Category } from '../../domain/product/category/Category';
import { CategoryId } from '../../domain/product/category/CategoryId';

export class InMemoryCategoriesRepository implements CategoriesRepository {
  private categories: Category[] = [];

  findById(id: CategoryId): Promise<Category | undefined> {
    const category = this.categories.find(c => c.categoryId.equals(id));
    return Promise.resolve(category);
  }

  save(category: Category): Promise<void> {
    this.categories.push(category);
    return Promise.resolve();
  }
}
