import { axiosInstance } from "../../lib/config";
import { Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
  public async getProducts(input: ProductInquiry): Promise<Product[]> {
    try {
      const params: Record<string, string | number> = {
        order: input.order,
        page: input.page,
        limit: input.limit,
      };
      if (input.productCollection) params.productCollection = input.productCollection;
      if (input.search) params.search = input.search;

      const result = await axiosInstance.get("/product/all", { params });
      const raw: any = result.data;

      // Handle every common Express response shape
      if (Array.isArray(raw)) return raw as Product[];
      for (const key of ["value", "list", "products", "data", "items", "result"]) {
        if (Array.isArray(raw[key])) return raw[key] as Product[];
      }
      console.warn("Unexpected /product/all response shape:", raw);
      return [];
    } catch (err) {
      console.error("Error, getProducts:", err);
      throw err;
    }
  }

  public async getProduct(productId: string): Promise<Product> {
    try {
      const result = await axiosInstance.get(`/product/${productId}`);
      const raw: any = result.data;
      return (raw?.product ?? raw) as Product;
    } catch (err) {
      console.error("Error, getProduct:", err);
      throw err;
    }
  }
}

export default ProductService;
