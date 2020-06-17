import { Category } from './Category';
import { CategoryId } from './CategoryId';

export interface CategoriesRepository {
  findById(id: CategoryId): Promise<Category | undefined>;
  save(category: Category): Promise<void>;
}
