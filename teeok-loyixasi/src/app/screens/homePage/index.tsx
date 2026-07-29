import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPopularProducts, setNewProducts, setTopUsers } from "./slice";
import { Product } from "../../../lib/types/product";
import { Member } from "../../../lib/types/member";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import PopularProducts from "./PopularProducts";
import NewProducts from "./NewProducts";
import TteokVideo from "./TteokVideo";
import BrandFeatures from "./BrandFeatures";
import MapSection from "./MapSection";
import { CartItem } from "../../../lib/types/search";
import "../../../css/home.css";

const actionDispatch = (dispatch: Dispatch) => ({
  setPopularProducts: (data: Product[]) => dispatch(setPopularProducts(data)),
  setNewProducts: (data: Product[]) => dispatch(setNewProducts(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

interface HomePageProps {
  onAdd: (item: CartItem) => void;
}

export default function HomePage({ onAdd }: HomePageProps) {
  const { setPopularProducts, setNewProducts, setTopUsers } = actionDispatch(useDispatch());

  useEffect(() => {
    const product = new ProductService();

    product.getProducts({ page: 1, limit: 10, order: "productViews" })
      .then((data) => setPopularProducts(data))
      .catch((err) => console.log(err));

    product.getProducts({ page: 1, limit: 4, order: "createdAt" })
      .then((data) => setNewProducts(data))
      .catch((err) => console.log(err));

    const member = new MemberService();
    member.getTopUsers()
      .then((data: Member[]) => setTopUsers(data))
      .catch((err) => console.log(err));
    // setPopularProducts/setNewProducts/setTopUsers are dispatch wrappers recreated each render; dispatch itself is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="homepage">
      {/* Section 1: 인기 상품 */}
      <PopularProducts onAdd={onAdd} />

      {/* Section 2: 브랜드 영상 */}
      <TteokVideo />

      {/* Section 3: 신상품 */}
      <NewProducts onAdd={onAdd} />

      {/* Section 4: 브랜드 특징 */}
      <BrandFeatures />

      {/* Section 5: 매장 지도 */}
      <MapSection />
    </div>
  );
}
