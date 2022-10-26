import { Product } from './../entities/product';
export interface productsInCart {
  [id: string]: {
    quantities: number;
    additionalInfo: object
    product: Product;
  };
}