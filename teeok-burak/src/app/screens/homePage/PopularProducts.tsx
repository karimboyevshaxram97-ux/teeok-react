import { Box, Container } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularProducts } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { useNavigate } from "react-router-dom";

const popularProductsRetriever = createSelector(
  retrievePopularProducts,
  (popularProducts) => ({ popularProducts })
);

export default function PopularProducts() {
  const { popularProducts } = useSelector(popularProductsRetriever);
  const navigate = useNavigate();

  return (
    <div className="popular-products">
      <Container>
        <Box className="section-title">인기 상품</Box>
        <Box className="section-sub">Most Popular Tteok</Box>
        <Box className="products-row">
          {popularProducts.length !== 0 ? (
            popularProducts.map((product: Product) => {
              const img = `${serverApi}/${product.productImages[0]}`;
              return (
                <Box
                  key={product._id}
                  className="product-card"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  <Box className="product-img" sx={{ backgroundImage: `url(${img})` }}>
                    <Box className="product-badge">{product.productCollection}</Box>
                  </Box>
                  <Box className="product-info">
                    <p className="product-name">{product.productName}</p>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="product-price">
                        <MonetizationOnIcon sx={{ fontSize: 14 }} />
                        {product.productPrice.toLocaleString()}
                      </span>
                      <span className="product-views">
                        <RemoveRedEyeIcon sx={{ fontSize: 13 }} />
                        {product.productViews}
                      </span>
                    </Box>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box className="no-data">상품이 없습니다</Box>
          )}
        </Box>
      </Container>
    </div>
  );
}
