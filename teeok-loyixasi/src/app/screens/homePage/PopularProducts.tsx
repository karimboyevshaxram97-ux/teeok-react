import { useState } from "react";
import {
  Box, Container, Grid,
  Card, CardContent, CardActions,
  IconButton, Typography, Pagination, Skeleton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularProducts } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { useNavigate } from "react-router-dom";
import useLikes from "../../hooks/useLikes";
import { useGlobals } from "../../hooks/useGlobals";
import { CartItem } from "../../../lib/types/search";

const PER_PAGE = 4;

const SIZE_KO: Record<string, string> = {
  SMALL: "소",
  NORMAL: "중",
  LARGE: "대",
  FAMILY: "가족",
};

const COLLECTION_KO: Record<string, string> = {
  TTEOK: "떡",
  HANGWA: "한과",
  SIKHYE: "식혜",
  SUJEONGGWA: "수정과",
  OMIJA: "오미자",
  SET: "세트",
};

const popularProductsRetriever = createSelector(
  retrievePopularProducts,
  (popularProducts) => ({ popularProducts })
);

interface PopularProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function PopularProducts({ onAdd }: PopularProductsProps) {
  const { popularProducts } = useSelector(popularProductsRetriever);
  const navigate = useNavigate();
  const { toggleLike, isLiked, getLikeCount } = useLikes();
  const { authMember, freshViews, commentDeltas } = useGlobals();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(popularProducts.length / PER_PAGE);
  const paged = popularProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const skeletons = Array.from({ length: 4 });

  return (
    <div className="popular-products">
      <Container>
        <Box className="section-title">인기 상품</Box>
        <Box className="section-sub">가장 많이 찾는 베스트 떡</Box>

        <Grid container spacing={3}>
          {paged.length !== 0
            ? paged.map((product: Product) => {
                const imgSrc = product.productImages?.[0]
                  ? `${serverApi}/${product.productImages[0]}`
                  : "/images/tteok1.jpg";
                const liked = isLiked(product._id);
                const views = freshViews[product._id] ?? product.productViews;
                const commentCount = (product.productComments ?? 0) + (commentDeltas[product._id] ?? 0);

                return (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product._id}>
                    <Card
                      className="home-card"
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      {/* Image */}
                      <Box className="home-card-img-wrap">
                        <Box
                          className="home-card-media"
                          sx={{ backgroundImage: `url(${imgSrc})` }}
                        />
                        <span className="home-cat-tag">
                          {COLLECTION_KO[product.productCollection] ?? product.productCollection}
                        </span>
                        <button
                          className={`home-like-float${liked ? " liked" : ""}${!authMember ? " locked" : ""}`}
                          onClick={(e) => { e.stopPropagation(); toggleLike(product._id, e); }}
                          title={!authMember ? "로그인이 필요합니다" : liked ? "좋아요 취소" : "좋아요"}
                        >
                          <FavoriteIcon sx={{ fontSize: 15 }} />
                        </button>
                      </Box>

                      <CardContent className="home-card-content">
                        {/* Name + size */}
                        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
                          <Typography className="home-card-name" sx={{ flex: 1 }}>
                            {product.productName}
                          </Typography>
                          <span className="home-card-size">
                            {SIZE_KO[product.productSize] ?? product.productSize}
                          </span>
                        </Box>

                        {/* Price */}
                        <Box className="home-card-price">
                          ₩{product.productPrice.toLocaleString()}
                        </Box>

                        {/* Stats row */}
                        <Box className="home-card-stats">
                          <span style={{ color: liked ? "#ff6b6b" : undefined }}>
                            <FavoriteIcon sx={{ fontSize: 11 }} />
                            {getLikeCount(product._id, product.productLikes ?? 0)}
                          </span>
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/products/${product._id}`); }}
                            title="댓글 보기"
                          >
                            <ChatBubbleOutlineIcon sx={{ fontSize: 11 }} />
                            {commentCount}
                          </span>
                          <span>
                            <RemoveRedEyeIcon sx={{ fontSize: 11 }} />
                            {views}
                          </span>
                        </Box>
                      </CardContent>

                      <CardActions className="home-card-actions">
                        <IconButton
                          className={`home-like-btn${liked ? " liked" : ""}`}
                          onClick={(e) => { e.stopPropagation(); toggleLike(product._id, e); }}
                          size="small"
                        >
                          <FavoriteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton
                          className="home-cart-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAdd({
                              _id: product._id,
                              quantity: 1,
                              name: product.productName,
                              price: product.productPrice,
                              image: product.productImages?.[0] ?? "",
                            });
                          }}
                          size="small"
                          title="장바구니에 담기"
                        >
                          <ShoppingCartIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            : /* skeleton placeholders while empty */
              skeletons.map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <Card className="home-card">
                    <Skeleton variant="rectangular" height={210} />
                    <CardContent>
                      <Skeleton width="75%" height={22} />
                      <Skeleton width="45%" height={20} sx={{ mt: 0.5 }} />
                      <Skeleton width="60%" height={16} sx={{ mt: 0.5 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="secondary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </div>
  );
}
