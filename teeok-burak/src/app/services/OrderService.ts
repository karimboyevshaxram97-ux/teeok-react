import axios from "axios";
import { serverApi } from "../../lib/config";
import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../../lib/types/order";
import { CartItem } from "../../lib/types/search";

class OrderService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async createOrder(input: CartItem[]): Promise<Order> {
    try {
      const orderItems: OrderItemInput[] = input.map((cartItem: CartItem) => ({
        itemQuantity: cartItem.quantity,
        itemPrice: cartItem.price,
        productId: cartItem._id,
      }));
      const url = `${this.path}/order/create`;
      const result = await axios.post<Order>(url, orderItems, { withCredentials: true });
      console.log("createOrder:", result);
      return result.data;
    } catch (err) {
      console.log("Error, createOrder:", err);
      throw err;
    }
  }

  public async getMyOrders(input: OrderInquiry): Promise<Order[]> {
    try {
      const url = `${this.path}/order/all?page=${input.page}&limit=${input.limit}&orderStatus=${input.orderStatus}`;
      const result = await axios.get<Order[]>(url, { withCredentials: true });
      console.log("getMyOrders:", result);
      return result.data;
    } catch (err) {
      console.log("Error, getMyOrders:", err);
      throw err;
    }
  }

  public async updateOrder(input: OrderUpdateInput): Promise<Order> {
    try {
      const url = `${this.path}/order/update`;
      const result = await axios.post<Order>(url, input, { withCredentials: true });
      console.log("updateOrder:", result);
      return result.data;
    } catch (err) {
      console.log("Error, updateOrder:", err);
      throw err;
    }
  }
}

export default OrderService;
