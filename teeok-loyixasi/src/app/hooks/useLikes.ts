import { useGlobals } from "./useGlobals";

export default function useLikes() {
  const { toggleLike, isLiked, getLikeCount, clearLikes } = useGlobals();
  return { toggleLike, isLiked, getLikeCount, clearLikes };
}
