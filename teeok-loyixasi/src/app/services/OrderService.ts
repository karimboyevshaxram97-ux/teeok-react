import { axiosInstance } from "../../lib/config";
import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../../lib/types/order";
import { CartItem } from "../../lib/types/search";

class OrderService {
  public async createOrder(input: CartItem[]): Promise<Order> {
    try {
      const orderItems: OrderItemInput[] = input.map((cartItem: CartItem) => ({
        itemQuantity: cartItem.quantity,
        itemPrice: cartItem.price,
        productId: cartItem._id,
      }));
      const result = await axiosInstance.post<Order>("/order/create", orderItems);
      return result.data;
    } catch (err) {
      console.log("Error, createOrder:", err);
      throw err;
    }
  }

  public async getMyOrders(input: OrderInquiry): Promise<Order[]> {
    try {
      const result = await axiosInstance.get("/order/all", {
        params: {
          page: input.page,
          limit: input.limit,
          orderStatus: input.orderStatus,
        },
      });
      const raw: any = result.data;
      if (Array.isArray(raw)) return raw as Order[];
      for (const key of ["value", "list", "orders", "data", "items", "result"]) {
        if (Array.isArray(raw[key])) return raw[key] as Order[];
      }
      return [];
    } catch (err) {
      console.log("Error, getMyOrders:", err);
      throw err;
    }
  }

  public async updateOrder(input: OrderUpdateInput): Promise<Order> {
    try {
      const result = await axiosInstance.post<Order>("/order/update", input);
      return result.data;
    } catch (err) {
      console.log("Error, updateOrder:", err);
      throw err;
    }
  }
}

export default OrderService;
