import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPopularProducts, setNewProducts, setTopUsers } from "./slice";
import { Product } from "../../../lib/types/product";
import { Member } from "../../../lib/types/member";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import PopularProducts from "./PopularProducts";
import NewProducts from "./NewProducts";
import "../../../css/home.css";

const actionDispatch = (dispatch: Dispatch) => ({
  setPopularProducts: (data: Product[]) => dispatch(setPopularProducts(data)),
  setNewProducts: (data: Product[]) => dispatch(setNewProducts(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

export default function HomePage() {
  const { setPopularProducts, setNewProducts, setTopUsers } = actionDispatch(useDispatch());

  useEffect(() => {
    const product = new ProductService();

    product.getProducts({ page: 1, limit: 4, order: "productViews", productCollection: ProductCollection.GARAETTEOK })
      .then((data) => setPopularProducts(data))
      .catch((err) => console.log(err));

    product.getProducts({ page: 1, limit: 4, order: "createdAt" })
      .then((data) => setNewProducts(data))
      .catch((err) => console.log(err));

    const member = new MemberService();
    member.getTopUsers()
      .then((data: Member[]) => setTopUsers(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="homepage">
      <PopularProducts />
      <NewProducts />
    </div>
  );
}
