import type { Product, ProductsResponse, ProductFilters, Category } from '../../entities/types';
import { getMockProducts, getMockProduct, MOCK_CATEGORIES } from './mock-data';

export async function getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
  return getMockProducts(filters);
}

export async function getProduct(id: number | string): Promise<Product> {
  const product = getMockProduct(id);
  if (!product) throw new Error('Product not found');
  return product;
}

export async function getCategories(): Promise<Category[]> {
  return MOCK_CATEGORIES;
}
