import { useEffect } from "react";
import { Box, Button, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setChosenProduct } from "./slice";
import { retrieveChosenProduct } from "./selector";
import { useParams } from "react-router-dom";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import ProductService from "../../services/ProductService";
import { CartItem } from "../../../lib/types/search";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const actionDispatch = (dispatch: Dispatch) => ({
  setChosenProduct: (data: Product | null) => dispatch(setChosenProduct(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct })
);

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct({ onAdd }: ChosenProductProps) {
  const { productId } = useParams<{ productId: string }>();
  const { setChosenProduct } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);

  useEffect(() => {
    if (!productId) return;
    const product = new ProductService();
    product.getProduct(productId)
      .then((data) => setChosenProduct(data))
      .catch((err) => console.log(err));

    return () => { setChosenProduct(null); };
  }, [productId]);

  if (!chosenProduct) return <div className="loading">Loading...</div>;

  const img = `${serverApi}/${chosenProduct.productImages[0]}`;

  return (
    <div className="chosen-product">
      <Container>
        <Box className="chosen-inner" sx={{ display: "flex" }}>
          <Box className="chosen-img" sx={{ backgroundImage: `url(${img})` }} />

          <Box className="chosen-info" sx={{ display: "flex", flexDirection: "column" }}>
            <Box className="chosen-collection">{chosenProduct.productCollection}</Box>
            <h2 className="chosen-name">{chosenProduct.productName}</h2>
            <p className="chosen-desc">{chosenProduct.productDesc ?? "전통 방식으로 만든 건강한 떡입니다."}</p>

            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }} className="chosen-price">
              <MonetizationOnIcon />
              <span>{chosenProduct.productPrice.toLocaleString()}원</span>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }} className="chosen-meta">
              <span>재고: {chosenProduct.productLeftCount}개</span>
              <span>·</span>
              <span>크기: {chosenProduct.productSize}</span>
            </Box>

            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              className="chosen-cart-btn"
              onClick={() => onAdd({
                _id: chosenProduct._id,
                quantity: 1,
                name: chosenProduct.productName,
                price: chosenProduct.productPrice,
                image: chosenProduct.productImages[0],
              })}
            >
              장바구니에 담기
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
