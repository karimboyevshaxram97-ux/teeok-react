import { Box, Container, Grid, Skeleton, Card, CardContent, CardActions, IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveNewProducts } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { useNavigate } from "react-router-dom";
import useLikes from "../../hooks/useLikes";
import { useGlobals } from "../../hooks/useGlobals";
import { CartItem } from "../../../lib/types/search";

const SIZE_KO: Record<string, string> = {
  SMALL: "소",
  NORMAL: "중",
  LARGE: "대",
  FAMILY: "가족",
};

const newProductsRetriever = createSelector(
  retrieveNewProducts,
  (newProducts) => ({ newProducts })
);

interface NewProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function NewProducts({ onAdd }: NewProductsProps) {
  const { newProducts } = useSelector(newProductsRetriever);
  const navigate = useNavigate();
  const { toggleLike, isLiked, getLikeCount } = useLikes();
  const { authMember, freshViews, commentDeltas } = useGlobals();

  const skeletons = Array.from({ length: 4 });

  return (
    <div className="new-products">
      <Container>
        <Box className="section-title">신상품</Box>
        <Box className="section-sub">방금 들어온 따끈따끈한 신상품</Box>

        <Grid container spacing={{ xs: 1.5, sm: 3 }}>
          {newProducts.length !== 0
            ? newProducts.map((product: Product) => {
                const imgSrc = product.productImages?.[0]
                  ? `${serverApi}/${product.productImages[0]}`
                  : "/images/tteok1.jpg";
                const liked = isLiked(product._id);
                const views = freshViews[product._id] ?? product.productViews;
                const commentCount = (product.productComments ?? 0) + (commentDeltas[product._id] ?? 0);

                return (
                  <Grid size={{ xs: 6, sm: 6, md: 3 }} key={product._id}>
                    <Card
                      className="home-card"
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      <Box className="home-card-img-wrap">
                        <Box
                          className="home-card-media"
                          sx={{ backgroundImage: `url(${imgSrc})` }}
                        />
                        <span className="home-cat-tag new">신상</span>
                        <button
                          className={`home-like-float${liked ? " liked" : ""}${!authMember ? " locked" : ""}`}
                          onClick={(e) => { e.stopPropagation(); toggleLike(product._id, e); }}
                          title={!authMember ? "로그인이 필요합니다" : liked ? "좋아요 취소" : "좋아요"}
                        >
                          <FavoriteIcon sx={{ fontSize: 15 }} />
                        </button>
                      </Box>

                      <CardContent className="home-card-content">
                        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
                          <Typography className="home-card-name" sx={{ flex: 1 }}>
                            {product.productName}
                          </Typography>
                          <span className="home-card-size">
                            {SIZE_KO[product.productSize] ?? product.productSize}
                          </span>
                        </Box>

                        <Box className="home-card-price">
                          <MonetizationOnIcon sx={{ fontSize: 15 }} />
                          ₩{product.productPrice.toLocaleString()}
                        </Box>

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
                          size="small"
                          onClick={(e) => { e.stopPropagation(); toggleLike(product._id, e); }}
                        >
                          <FavoriteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton
                          className="home-cart-btn"
                          size="small"
                          title="장바구니에 담기"
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
                        >
                          <ShoppingCartIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            : skeletons.map((_, i) => (
                <Grid size={{ xs: 6, sm: 6, md: 3 }} key={i}>
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
      </Container>
    </div>
  );
}
