import { adminProductService } from "./adminProduct.service";

export const homeService = {
  getFeaturedProducts: () => adminProductService.getAll({ page: 1, limit: 8 }),
};