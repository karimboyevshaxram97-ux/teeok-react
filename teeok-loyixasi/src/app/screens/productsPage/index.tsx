import { Routes, Route } from "react-router-dom";
import Products from "./Products";
import ChosenProduct from "./ChosenProduct";
import { CartItem } from "../../../lib/types/search";
import "../../../css/products.css";

interface ProductsPageProps {
  onAdd: (item: CartItem) => void;
}

export default function ProductsPage({ onAdd }: ProductsPageProps) {
  return (
    <div className="products-page">
      <Routes>
        <Route path=":productId" element={<ChosenProduct onAdd={onAdd} />} />
        <Route path="" element={<Products onAdd={onAdd} />} />
      </Routes>
    </div>
  );
}
