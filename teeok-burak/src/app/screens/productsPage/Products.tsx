import { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Container, Badge, Pagination, PaginationItem } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import ProductService from "../../services/ProductService";
import { CartItem } from "../../../lib/types/search";
import { useNavigate } from "react-router-dom";

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({ products }));

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products({ onAdd }: ProductsProps) {
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const navigate = useNavigate();

  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: ProductCollection.GARAETTEOK,
    search: "",
  });
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const product = new ProductService();
    product.getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "") {
      setProductSearch((prev) => ({ ...prev, search: "" }));
    }
  }, [searchText]);

  const searchCollectionHandler = (collection: ProductCollection) => {
    setProductSearch((prev) => ({ ...prev, page: 1, productCollection: collection }));
  };

  const searchOrderHandler = (order: string) => {
    setProductSearch((prev) => ({ ...prev, page: 1, order }));
  };

  const searchProductHandler = () => {
    setProductSearch((prev) => ({ ...prev, search: searchText }));
  };

  const paginationHandler = (_e: ChangeEvent<any>, value: number) => {
    setProductSearch((prev) => ({ ...prev, page: value }));
  };

  const chooseDishHandler = (id: string) => {
    navigate(`/products/${id}`);
  };

  const COLLECTIONS = [
    { label: "가래떡", value: ProductCollection.GARAETTEOK },
    { label: "송편", value: ProductCollection.SONGPYEON },
    { label: "인절미", value: ProductCollection.INJEOLMI },
    { label: "떡볶이떡", value: ProductCollection.TTEOKBOKKI },
    { label: "선물세트", value: ProductCollection.GIFT_SET },
    { label: "기타", value: ProductCollection.OTHER },
  ];

  return (
    <div className="products">
      <Container>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* 검색 */}
          <Box className="search-box">
            <Box className="search-title">떡 전문점 · TTEOK STORE</Box>
            <Box className="search-input-wrap">
              <input
                type="search"
                className="search-input"
                placeholder="검색어를 입력하세요"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") searchProductHandler(); }}
              />
              <button className="search-btn" onClick={searchProductHandler}>
                <SearchIcon />
              </button>
            </Box>
          </Box>

          {/* 정렬 */}
          <Box className="order-filter">
            {["createdAt", "productPrice", "productViews"].map((order) => (
              <Button
                key={order}
                variant="contained"
                color={productSearch.order === order ? "primary" : "inherit"}
                className="order-btn"
                onClick={() => searchOrderHandler(order)}
              >
                {order === "createdAt" ? "신상품" : order === "productPrice" ? "가격순" : "인기순"}
              </Button>
            ))}
          </Box>

          {/* 카테고리 + 상품 목록 */}
          <Box className="list-section">
            <Box className="category-list">
              {COLLECTIONS.map((col) => (
                <Button
                  key={col.value}
                  variant="contained"
                  color={productSearch.productCollection === col.value ? "primary" : "inherit"}
                  className="category-btn"
                  onClick={() => searchCollectionHandler(col.value)}
                >
                  {col.label}
                </Button>
              ))}
            </Box>

            <Box className="product-grid">
              {products.length !== 0 ? (
                products.map((product: Product) => {
                  const img = `${serverApi}/${product.productImages[0]}`;
                  return (
                    <Box
                      key={product._id}
                      className="product-card"
                      onClick={() => chooseDishHandler(product._id)}
                    >
                      <Box className="product-img" sx={{ backgroundImage: `url(${img})` }}>
                        <span className="product-size-badge">{product.productSize}</span>
                        <Button
                          className="cart-btn"
                          onClick={(e) => {
                            onAdd({
                              _id: product._id,
                              quantity: 1,
                              name: product.productName,
                              price: product.productPrice,
                              image: product.productImages[0],
                            });
                            e.stopPropagation();
                          }}
                        >
                          🛒
                        </Button>
                        <Button className="view-btn">
                          <Badge badgeContent={product.productViews} color="secondary">
                            <RemoveRedEyeIcon sx={{ color: product.productViews === 0 ? "gray" : "#fff" }} />
                          </Badge>
                        </Button>
                      </Box>
                      <Box className="product-info">
                        <span className="product-name">{product.productName}</span>
                        <div className="product-price">
                          <MonetizationOnIcon sx={{ fontSize: 15 }} />
                          {product.productPrice.toLocaleString()}원
                        </div>
                      </Box>
                    </Box>
                  );
                })
              ) : (
                <Box className="no-data">상품이 없습니다</Box>
              )}
            </Box>
          </Box>

          {/* 페이지네이션 */}
          <Box className="pagination-wrap">
            <Pagination
              count={products.length !== 0 ? productSearch.page + 1 : productSearch.page}
              page={productSearch.page}
              renderItem={(item) => (
                <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} color="secondary" />
              )}
              onChange={paginationHandler}
            />
          </Box>
        </Box>
      </Container>
    </div>
  );
}
