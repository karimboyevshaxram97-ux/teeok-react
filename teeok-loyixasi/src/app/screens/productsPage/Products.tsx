import { useEffect, useState } from "react";
import {
  Box, Container,
  Card, CardMedia, CardContent, CardActions, IconButton, Typography,
  Skeleton, Pagination,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Product } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import ProductService from "../../services/ProductService";
import { CartItem } from "../../../lib/types/search";
import { useNavigate } from "react-router-dom";
import useLikes from "../../hooks/useLikes";
import { useGlobals } from "../../hooks/useGlobals";

// hero-tteokz.jpg / istockphoto-1419517660...jpg removed: unlicensed iStock
// preview images (visible watermark). tteok-2/3.jpg are Pexels License
// (free, no attribution required) — photos by Caio Pezzo and Julio Ribeiro.
const HERO_IMAGES = [
  "/images/12.jpg",
  "/images/tteok-2.jpg",
  "/images/tteok-3.jpg",
];

const PAGE_LIMIT = 4;

const SIZE_KO: Record<string, string> = {
  SMALL: "소", NORMAL: "중", LARGE: "대", FAMILY: "가족",
};

const COLLECTION_KO: Record<string, string> = {
  TTEOK: "떡", HANGWA: "한과", SIKHYE: "식혜",
  SUJEONGGWA: "수정과", OMIJA: "오미자", SET: "세트",
};

const CATEGORY_META: Record<string, { ko: string; en: string; emoji: string; desc: string; color: string }> = {
  [ProductCollection.TTEOK]:      { ko: "떡",    en: "Rice Cakes",        emoji: "🍡", desc: "쫄깃하고 담백한 전통 떡",            color: "#ff6b6b" },
  [ProductCollection.HANGWA]:     { ko: "한과",  en: "Korean Confection",  emoji: "🍯", desc: "달콤하고 바삭한 전통 한과",           color: "#feca57" },
  [ProductCollection.SIKHYE]:     { ko: "식혜",  en: "Sweet Rice Drink",   emoji: "🥤", desc: "시원하고 달콤한 전통 음료",           color: "#26de81" },
  [ProductCollection.SUJEONGGWA]: { ko: "수정과", en: "Cinnamon Punch",    emoji: "🫖", desc: "계피향이 그윽한 전통 음료",           color: "#fd9644" },
  [ProductCollection.OMIJA]:      { ko: "오미자", en: "Schisandra Tea",    emoji: "🍵", desc: "다섯 가지 맛의 건강 음료",            color: "#a29bfe" },
  [ProductCollection.SET]:        { ko: "세트",  en: "Gift Sets",          emoji: "🎁", desc: "소중한 분들께 드리는 특별 선물 세트", color: "#fd79a8" },
};

const ORDERED_CATS = [
  ProductCollection.TTEOK,
  ProductCollection.HANGWA,
  ProductCollection.SIKHYE,
  ProductCollection.SUJEONGGWA,
  ProductCollection.OMIJA,
  ProductCollection.SET,
];

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products({ onAdd }: ProductsProps) {
  const navigate = useNavigate();
  const { toggleLike, isLiked, getLikeCount } = useLikes();
  const { authMember, freshViews, commentDeltas } = useGlobals();
  /* Hero slideshow */
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((p) => (p + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* Per-section products & pagination */
  const [sectionProducts, setSectionProducts] = useState<Record<string, Product[]>>({});
  const [sectionLoading, setSectionLoading] = useState<Record<string, boolean>>(
    Object.fromEntries(ORDERED_CATS.map((c) => [c, true]))
  );
  const [sectionPage, setSectionPage] = useState<Record<string, number>>(
    Object.fromEntries(ORDERED_CATS.map((c) => [c, 1]))
  );
  const [sectionHasMore, setSectionHasMore] = useState<Record<string, boolean>>(
    Object.fromEntries(ORDERED_CATS.map((c) => [c, false]))
  );

  /* Search */
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  /* Fetch per-section with page */
  const sectionPageKey = JSON.stringify(sectionPage);
  useEffect(() => {
    const svc = new ProductService();
    ORDERED_CATS.forEach((col) => {
      setSectionLoading((prev) => ({ ...prev, [col]: true }));
      svc
        .getProducts({ page: sectionPage[col], limit: PAGE_LIMIT, order: "createdAt", productCollection: col })
        .then((data) => {
          setSectionProducts((prev) => ({ ...prev, [col]: data }));
          setSectionHasMore((prev) => ({ ...prev, [col]: data.length >= PAGE_LIMIT }));
          setSectionLoading((prev) => ({ ...prev, [col]: false }));
        })
        .catch(() => setSectionLoading((prev) => ({ ...prev, [col]: false })));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionPageKey]);

  const handleSearch = (q = searchText) => {
    const query = q.trim();
    if (!query) { setIsSearching(false); return; }
    setIsSearching(true);
    setSearchLoading(true);
    new ProductService()
      .getProducts({ page: 1, limit: 24, order: "createdAt", search: query })
      .then((data) => { setSearchResults(data); setSearchLoading(false); })
      .catch(() => setSearchLoading(false));
  };

  useEffect(() => {
    if (searchText.trim().length < 2) { if (!searchText) setIsSearching(false); return; }
    const timer = setTimeout(() => handleSearch(searchText), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const clearSearch = () => { setSearchText(""); setIsSearching(false); setSearchResults([]); };

  const renderCard = (product: Product, keyPrefix = "") => {
    const id = (product as Product)._id;
    const name = (product as Product).productName;
    const price = (product as Product).productPrice;
    const imgSrc = `${serverApi}/${(product as Product).productImages[0]}`;
    const serverViews = (product as Product).productViews;
    const views = freshViews[id] ?? serverViews;
    const colKey = (product as Product).productCollection;
    const liked = isLiked(id);
    const commentCount = ((product as Product).productComments ?? 0) + (commentDeltas[id] ?? 0);

    return (
      <Card key={keyPrefix + id} className="prod-card" onClick={() => navigate(`/products/${id}`)}>
        <Box className="prod-card-img-wrap">
          <CardMedia className="prod-card-img" sx={{ backgroundImage: `url(${imgSrc})` }} />
          <span className="prod-cat-badge">{COLLECTION_KO[colKey] ?? colKey}</span>
          <button
            className={`like-btn${liked ? " liked" : ""}${!authMember ? " locked" : ""}`}
            onClick={(e) => toggleLike(id, e)}
            title={!authMember ? "로그인이 필요합니다" : liked ? "좋아요 취소" : "좋아요"}
          >
            <FavoriteIcon sx={{ fontSize: 15 }} />
          </button>
        </Box>
        <CardContent className="prod-card-content">
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
            <Typography className="prod-card-name" sx={{ flex: 1 }}>{name}</Typography>
            <span className="home-card-size">{SIZE_KO[(product as Product).productSize] ?? (product as Product).productSize}</span>
          </Box>
          <Box className="prod-card-price">
            <MonetizationOnIcon sx={{ fontSize: 14 }} />
            ₩{price.toLocaleString()}
          </Box>
          <Box className="home-card-stats" sx={{ mt: 0.5 }}>
            <span style={{ color: liked ? "#ff6b6b" : undefined }}>
              <FavoriteIcon sx={{ fontSize: 11 }} />
              {getLikeCount(id, (product as Product).productLikes ?? 0)}
            </span>
            <span
              className="stat-comment-link"
              onClick={(e) => { e.stopPropagation(); navigate(`/products/${id}`); }}
              title="댓글 보기"
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: 11 }} />
              {commentCount}
            </span>
            <span><RemoveRedEyeIcon sx={{ fontSize: 11 }} />{views}</span>
          </Box>
        </CardContent>
        <CardActions className="prod-card-actions">
          <IconButton className={`home-like-btn${liked ? " liked" : ""}`} size="small"
            onClick={(e) => { e.stopPropagation(); toggleLike(id, e); }}>
            <FavoriteIcon sx={{ fontSize: 17 }} />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton className="home-cart-btn" size="small"
            onClick={(e) => {
              e.stopPropagation();
              onAdd({ _id: id, quantity: 1, name, price, image: (product as Product).productImages[0] });
            }}>
            <ShoppingCartIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </CardActions>
      </Card>
    );
  };

  const renderSkeletons = (n = 4) =>
    Array.from({ length: n }).map((_, i) => (
      <Card key={i} className="prod-card">
        <Skeleton variant="rectangular" height={210} />
        <CardContent>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" />
        </CardContent>
      </Card>
    ));

  return (
    <div className="products-page">

      {/* ── Hero with slideshow ── */}
      <Box className="products-hero">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={i}
            className={`ph-bg${i === heroIdx ? " active" : ""}`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
        <div className="ph-overlay" />
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Box className="ph-inner">
            <span className="ph-badge">🍡 전통 떡 전문점</span>
            <h1 className="ph-title">전통의 맛,<br />현대의 감성</h1>
            <p className="ph-sub">매일 새벽 직접 빚어낸 정성 가득한 떡</p>
            <Box className="search-input-wrap" sx={{ maxWidth: 520, margin: "0 auto" }}>
              <input
                type="search"
                className="search-input"
                placeholder="검색어를 입력하세요"
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); if (!e.target.value) clearSearch(); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              />
              <button className="search-btn" onClick={() => handleSearch()}><SearchIcon /></button>
            </Box>
            {/* Hero dots */}
            <Box className="ph-dots">
              {HERO_IMAGES.map((_, i) => (
                <button key={i} className={`ph-dot${i === heroIdx ? " active" : ""}`}
                  onClick={() => setHeroIdx(i)} />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Sticky category nav ── */}
      <Box className="prod-cat-nav">
        {ORDERED_CATS.map((col) => {
          const m = CATEGORY_META[col];
          return (
            <a key={col} href={`#sec-${col}`} className="prod-cat-pill">
              {m.emoji} {m.ko}
            </a>
          );
        })}
      </Box>

      {/* ── Content ── */}
      {isSearching ? (
        <Box sx={{ py: 6, background: "#f9f7f4", minHeight: "60vh" }}>
          <Container>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#1a1a1a", letterSpacing: "-0.5px" }}>
                "{searchText}" 검색 결과
              </h2>
              <button className="prod-clear-search" onClick={clearSearch}>✕ 초기화</button>
            </Box>
            {searchLoading ? (
              <Box className="prod-grid">{renderSkeletons(8)}</Box>
            ) : searchResults.length > 0 ? (
              <Box className="prod-grid">{searchResults.map((p) => renderCard(p, "sr-"))}</Box>
            ) : (
              <Box className="no-data" sx={{ py: 12 }}>검색 결과가 없습니다</Box>
            )}
          </Container>
        </Box>
      ) : (
        <>
          {ORDERED_CATS.map((col, idx) => {
            const meta = CATEGORY_META[col];
            const items = sectionProducts[col] ?? [];
            const loading = sectionLoading[col];
            const pg = sectionPage[col] ?? 1;
            const more = sectionHasMore[col] ?? false;

            return (
              <Box key={col} id={`sec-${col}`}
                className={`prod-section${idx % 2 === 1 ? " prod-section-alt" : ""}`}>
                <Container>
                  <Box className="prod-section-head">
                    <Box className="prod-section-main-row">
                      <Box className="prod-section-icon-wrap"
                        style={{ background: `${meta.color}1a`, color: meta.color }}>
                        {meta.emoji}
                      </Box>
                      <Box className="prod-section-text">
                        <h2 className="prod-section-ko">{meta.ko}</h2>
                        <span className="prod-section-en">{meta.en}</span>
                      </Box>
                    </Box>
                    <p className="prod-section-desc">{meta.desc}</p>
                  </Box>

                  <Box className="prod-grid">
                    {loading
                      ? renderSkeletons(4)
                      : items.length > 0
                        ? items.map((p) => renderCard(p, `${col}-`))
                        : <Box className="no-data" sx={{ gridColumn: "1/-1", py: 6 }}>상품이 없습니다</Box>
                    }
                  </Box>

                  {/* Per-section pagination */}
                  {(pg > 1 || more) && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                      <Pagination
                        count={more ? pg + 1 : pg}
                        page={pg}
                        onChange={(_, v) => setSectionPage((prev) => ({ ...prev, [col]: v }))}
                        color="secondary"
                        size="large"
                      />
                    </Box>
                  )}
                </Container>
              </Box>
            );
          })}
        </>
      )}

    </div>
  );
}
