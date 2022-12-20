export interface FilterProductRequest {
  categoryIds: number[];
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
