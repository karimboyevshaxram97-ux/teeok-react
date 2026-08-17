import { useState, useEffect } from "react";
import { Box, Container, Grid, Button, IconButton, Card, CardContent, CardActions, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";
import ProductService from "../../services/ProductService";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import useLikes from "../../hooks/useLikes";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/holiday.css";
import "../../../css/home.css";

// hero-tteokz.jpg / istockphoto-1419517660...jpg removed: unlicensed iStock
// preview images (visible watermark). tteok-2/3.jpg are Pexels License
// (free, no attribution required) — photos by Caio Pezzo and Julio Ribeiro.
const HERO_IMAGES = [
  "/images/12.jpg",
  "/images/tteok-2.jpg",
  "/images/tteok-3.jpg",
];

const HOLIDAY_CATEGORIES = [
  { emoji: "🌕", label: "추석 선물세트", desc: "한가위를 빛내는 전통 떡 선물" },
  { emoji: "🎋", label: "설날 선물세트", desc: "새해 복 많이 받으세요" },
  { emoji: "🎂", label: "생일 선물세트", desc: "특별한 날을 더욱 달콤하게" },
  { emoji: "💍", label: "결혼·돌잔치", desc: "소중한 순간을 함께" },
];

const OFFERS = [
  { title: "10만원 이상", badge: "5% 할인", color: "#e8f5e9", badgeColor: "#2e7d32" },
  { title: "20만원 이상", badge: "10% 할인", color: "#fff3e0", badgeColor: "#e65100" },
  { title: "기업 대량 주문", badge: "별도 협의", color: "#fce4ec", badgeColor: "#c62828" },
];

const SIZE_KO: Record<string, string> = {
  SMALL: "소", NORMAL: "중", LARGE: "대", FAMILY: "가족",
};

const PAGE_LIMIT = 4;

interface HolidayPageProps {
  onAdd: (item: CartItem) => void;
}

export default function HolidayPage({ onAdd }: HolidayPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { toggleLike, isLiked, getLikeCount } = useLikes();
  const { authMember, freshViews, commentDeltas } = useGlobals();
  const navigate = useNavigate();

  /* Hero slideshow */
  const [heroIdx, setHeroIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setHeroIdx((prev) => (prev + 1) % HERO_IMAGES.length);
        setFade(true);
      }, 600);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goHero = (idx: number) => {
    setFade(false);
    setTimeout(() => { setHeroIdx(idx); setFade(true); }, 300);
  };

  /* Products pagination */
  useEffect(() => {
    const service = new ProductService();
    service
      .getProducts({ page, limit: PAGE_LIMIT, order: "createdAt", productCollection: ProductCollection.SET })
      .then((data) => {
        setProducts(data);
        setHasMore(data.length >= PAGE_LIMIT);
      })
      .catch(console.log);
  }, [page]);

  return (
    <div className="holiday-page">
      {/* ── Hero ── */}
      <Box className="holiday-hero">
        {/* Slideshow layers */}
        {HERO_IMAGES.map((src, i) => (
          <div
            key={i}
            className={`holiday-hero-bg${i === heroIdx ? " active" : ""}`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
        <div className="holiday-hero-overlay" />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Box className="holiday-hero-inner">
            {/* Left: text */}
            <Box className="holiday-hero-text">
              <Box className="holiday-badge-tag">🎁 명절 · 기념일 특선</Box>
              <h1 className="holiday-title">특별한 날,<br />특별한 선물</h1>
              <p className="holiday-sub">소중한 사람에게 전통의 맛을 선물하세요</p>
              <Box className="holiday-hero-btns">
                <Button variant="contained" className="holiday-cta-btn" onClick={() => navigate("/products")}>
                  전체 상품 보기
                </Button>
                <Button variant="outlined" className="holiday-inquiry-btn" onClick={() => navigate("/help")}>
                  문의하기
                </Button>
              </Box>

              {/* Dot indicators */}
              <Box className="holiday-hero-dots">
                {HERO_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    className={`holiday-hero-dot${i === heroIdx ? " active" : ""}`}
                    onClick={() => goHero(i)}
                  />
                ))}
              </Box>
            </Box>

            {/* Right: framed photo */}
            <Box className="holiday-hero-photo-wrap">
              <img
                key={heroIdx}
                src={HERO_IMAGES[heroIdx]}
                alt="선물세트"
                className={`holiday-hero-photo-img${fade ? " visible" : ""}`}
              />
              <Box className="holiday-hero-photo-tag holiday-hero-photo-tag-top">🎋 전통 보자기 포장</Box>
              <Box className="holiday-hero-photo-tag holiday-hero-photo-tag-bot">✨ 프리미엄 선물세트</Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Offer banners */}
      <Box className="holiday-offers">
        <Container>
          <Grid container spacing={3}>
            {OFFERS.map((offer, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Box className="holiday-offer-card" sx={{ background: offer.color }}>
                  <span className="holiday-offer-title">{offer.title}</span>
                  <Box className="holiday-offer-badge" sx={{ background: offer.badgeColor }}>{offer.badge}</Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories */}
      <Box className="holiday-categories">
        <Container>
          <Box className="section-title">선물 종류</Box>
          <Box className="section-sub">소중한 분께 딱 맞는 선물을 골라보세요</Box>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {HOLIDAY_CATEGORIES.map((cat, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Box className="holiday-cat-card">
                  <span className="holiday-cat-emoji">{cat.emoji}</span>
                  <h3 className="holiday-cat-title">{cat.label}</h3>
                  <p className="holiday-cat-desc">{cat.desc}</p>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Gift Products */}
      <Box className="holiday-products">
        <Container>
          <Box className="section-title">선물 세트 모음</Box>
          <Box className="section-sub">정성 가득한 프리미엄 선물세트를 만나보세요</Box>
          <Grid container spacing={{ xs: 1.5, sm: 3 }} sx={{ mt: 1 }}>
            {products.length !== 0 ? (
              products.map((product) => {
                const imgSrc = product.productImages?.[0]
                  ? `${serverApi}/${product.productImages[0]}`
                  : "/images/tteok1.jpg";
                const liked = isLiked(product._id);
                const likeCount = getLikeCount(product._id, product.productLikes ?? 0);
                const views = freshViews[product._id] ?? product.productViews;
                const commentCount = (product.productComments ?? 0) + (commentDeltas[product._id] ?? 0);

                return (
                  <Grid size={{ xs: 6, sm: 6, md: 3 }} key={product._id}>
                    <Card className="home-card" onClick={() => navigate(`/products/${product._id}`)}>
                      {/* Image */}
                      <Box className="home-card-img-wrap">
                        <Box className="home-card-media" sx={{ backgroundImage: `url(${imgSrc})` }} />
                        <span className="home-cat-tag">선물세트</span>
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
                          ₩{product.productPrice.toLocaleString()}
                        </Box>

                        <Box className="home-card-stats">
                          <span style={{ color: liked ? "#ff6b6b" : undefined }}>
                            <FavoriteIcon sx={{ fontSize: 11 }} />
                            {likeCount}
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
                          className={`home-like-btn${liked ? " liked" : ""}${!authMember ? " locked" : ""}`}
                          size="small"
                          onClick={(e) => { e.stopPropagation(); toggleLike(product._id, e); }}
                          title={!authMember ? "로그인이 필요합니다" : liked ? "좋아요 취소" : "좋아요"}
                        >
                          <FavoriteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton
                          className="home-cart-btn"
                          size="small"
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
            ) : (
              <Grid size={{ xs: 12 }}>
                <Box className="no-data" sx={{ textAlign: "center", py: 10, color: "#9b7b6a", fontSize: 16 }}>
                  선물세트 상품이 준비 중입니다
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Pagination */}
          {(page > 1 || hasMore) && (
            <Box className="holiday-pagination">
              <IconButton
                className="holiday-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
              </IconButton>

              <span className="holiday-page-num">{page}</span>

              <IconButton
                className="holiday-page-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          )}
        </Container>
      </Box>

      {/* Bottom CTA banner */}
      <Box className="holiday-cta-banner">
        <Container>
          <Box className="holiday-cta-inner">
            <Box>
              <h2 className="holiday-cta-title">기업·단체 대량 주문</h2>
              <p className="holiday-cta-sub">명절 선물, 직원 복지 등 대량 주문 시 특별 혜택을 드립니다</p>
            </Box>
            <Button variant="outlined" className="holiday-cta-contact-btn" onClick={() => navigate("/help")}>
              지금 문의하기
            </Button>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
