import { useEffect, useState } from "react";
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
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import SendIcon from "@mui/icons-material/Send";
import useLikes from "../../hooks/useLikes";
import { useGlobals } from "../../hooks/useGlobals";

const actionDispatch = (dispatch: Dispatch) => ({
  setChosenProduct: (data: Product | null) => dispatch(setChosenProduct(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct })
);

interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  date: string;
}


interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct({ onAdd }: ChosenProductProps) {
  const { productId } = useParams<{ productId: string }>();
  const { setChosenProduct } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { toggleLike, isLiked, getLikeCount } = useLikes();
  const { authMember, setFreshView, updateCommentDelta } = useGlobals();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  // Fetch product — server typically increments productViews on GET
  useEffect(() => {
    if (!productId) return;
    new ProductService().getProduct(productId)
      .then((data) => {
        setChosenProduct(data);
        // Share fresh view count with card list via GlobalContext
        setFreshView(productId, data.productViews);
      })
      .catch((err) => console.log(err));
    return () => { setChosenProduct(null); };
  }, [productId]);

  // Load locally stored comments for this product
  useEffect(() => {
    if (!productId) return;
    try {
      const stored = localStorage.getItem(`comments_${productId}`);
      if (stored) {
        const parsed: Comment[] = JSON.parse(stored);
        setComments(parsed);
      }
    } catch {}
  }, [productId]);

  if (!chosenProduct) return <div className="loading">불러오는 중...</div>;

  const img = `${serverApi}/${chosenProduct.productImages[0]}`;
  const liked = isLiked(chosenProduct._id);
  const likeCount = getLikeCount(chosenProduct._id, chosenProduct.productLikes ?? 0);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authMember || !commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      author: authMember.memberNick,
      avatar: authMember.memberNick[0].toUpperCase(),
      text: commentText.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    const updatedLocal = [newComment, ...comments];
    localStorage.setItem(`comments_${productId}`, JSON.stringify(updatedLocal));
    setComments([newComment, ...comments]);
    updateCommentDelta(productId!);
    setCommentText("");
  };

  return (
    <div className="chosen-product">
      <Container>
        {/* Product detail */}
        <Box className="chosen-inner">
          <Box className="chosen-img" sx={{ backgroundImage: `url(${img})` }} />

          <Box className="chosen-info">
            <Box className="chosen-collection">{chosenProduct.productCollection}</Box>
            <h2 className="chosen-name">{chosenProduct.productName}</h2>
            <p className="chosen-desc">{chosenProduct.productDesc ?? "전통 방식으로 만든 건강한 떡입니다."}</p>

            <Box className="chosen-price">
              <MonetizationOnIcon />
              <span>{chosenProduct.productPrice.toLocaleString()}원</span>
            </Box>

            <Box className="chosen-meta">
              <span>재고: {chosenProduct.productLeftCount}개</span>
              <span>·</span>
              <span>크기: {chosenProduct.productSize}</span>
              <span>·</span>
              <span className="chosen-views">
                <RemoveRedEyeIcon sx={{ fontSize: 15 }} />
                {chosenProduct.productViews}
              </span>
              <span>·</span>
              <span className="chosen-likes-count">
                <FavoriteIcon sx={{ fontSize: 15, color: liked ? "#ff6b6b" : "inherit" }} />
                {likeCount}
              </span>
            </Box>

            <Box className="chosen-actions">
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

              <button
                className={`chosen-like-btn${liked ? " liked" : ""}${!authMember ? " disabled" : ""}`}
                onClick={(e) => {
                  if (!authMember) return;
                  toggleLike(chosenProduct._id, e);
                }}
                title={!authMember ? "로그인이 필요합니다" : liked ? "좋아요 취소" : "좋아요"}
              >
                <FavoriteIcon sx={{ fontSize: 20 }} />
                <span>{liked ? "좋아요 취소" : "찜하기"}</span>
              </button>
            </Box>
          </Box>
        </Box>

        {/* Comments */}
        <Box className="comments-section">
          <h3 className="comments-title">
            리뷰 &amp; 댓글
            <span className="comments-count">{comments.length}</span>
          </h3>

          {authMember ? (
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <Box className="comment-input-row">
                <input
                  className="comment-text-input"
                  placeholder={`${authMember.memberNick}님, 댓글을 남겨주세요...`}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
                <button type="submit" className="comment-submit-btn">
                  <SendIcon sx={{ fontSize: 18 }} />
                </button>
              </Box>
            </form>
          ) : (
            <Box className="comment-login-notice">
              <ChatBubbleOutlineIcon sx={{ fontSize: 18, opacity: 0.5 }} />
              댓글 작성은 로그인이 필요합니다
            </Box>
          )}

          <Box className="comments-list">
            {comments.map((comment) => (
              <Box key={comment.id} className="comment-card">
                <Box className="comment-avatar-box">{comment.avatar}</Box>
                <Box className="comment-body">
                  <Box className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-date">{comment.date}</span>
                  </Box>
                  <p className="comment-text">{comment.text}</p>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </div>
  );
}
