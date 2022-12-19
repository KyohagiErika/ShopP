export interface FilterProductRequest {
  name: string;
  categoryId: number[];
  shopName: string;
  price: {
    min: number;
    max: number;
    orderBy: boolean;
  };
  star: {
    min: number;
    max: number;
  };
  take: number;
  skip: number;
}
