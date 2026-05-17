import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";

export interface AppRootState {
  homePage: HomePageState;
  productsPage: ProductsPageState;
  ordersPage: OrdersPageState;
}

export interface HomePageState {
  popularProducts: Product[];
  newProducts: Product[];
  topUsers: Member[];
}

export interface ProductsPageState {
  chosenProduct: Product | null;
  products: Product[];
}

export interface OrdersPageState {
  pausedOrders: Order[];
  processOrders: Order[];
  finishedOrders: Order[];
}
