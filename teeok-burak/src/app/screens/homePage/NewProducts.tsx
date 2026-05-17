import { Box, Container, Stack } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveNewProducts } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { useNavigate } from "react-router-dom";

const newProductsRetriever = createSelector(
  retrieveNewProducts,
  (newProducts) => ({ newProducts })
);

export default function NewProducts() {
  const { newProducts } = useSelector(newProductsRetriever);
  const navigate = useNavigate();

  return (
    <div className="new-products">
      <Container>
        <Box className="section-title">신상품</Box>
        <Box className="section-sub">Newly Added Tteok</Box>
        <Stack className="products-row">
          {newProducts.length !== 0 ? (
            newProducts.map((product: Product) => {
              const img = `${serverApi}/${product.productImages[0]}`;
              return (
                <Stack
                  key={product._id}
                  className="product-card"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  <Box className="product-img new-badge-wrap" sx={{ backgroundImage: `url(${img})` }}>
                    <Box className="new-badge">NEW</Box>
                  </Box>
                  <Box className="product-info">
                    <p className="product-name">{product.productName}</p>
                    <span className="product-price">
                      <MonetizationOnIcon sx={{ fontSize: 14 }} />
                      {product.productPrice.toLocaleString()}
                    </span>
                  </Box>
                </Stack>
              );
            })
          ) : (
            <Box className="no-data">신상품이 없습니다</Box>
          )}
        </Stack>
      </Container>
    </div>
  );
}
