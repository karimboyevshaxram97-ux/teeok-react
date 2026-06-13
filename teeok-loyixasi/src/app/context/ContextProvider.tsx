import React, { ReactNode, useState, useEffect } from "react";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authMember, setAuthMemberState] = useState<Member | null>(() => {
    const saved = localStorage.getItem("memberData");
    if (!saved) return null;
    try { return JSON.parse(saved); } catch { return null; }
  });

  const setAuthMember = (member: Member | null) => {
    if (member) localStorage.setItem("memberData", JSON.stringify(member));
    else localStorage.removeItem("memberData");
    setAuthMemberState(member);
  };

  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  // Views: fresh counts fetched from product detail (server increments on GET /product/:id)
  const [freshViews, setFreshViewsMap] = useState<Record<string, number>>({});
  const setFreshView = (id: string, count: number) =>
    setFreshViewsMap((prev) => ({ ...prev, [id]: count }));

  // Comment deltas: how many comments were locally added (persisted)
  const [commentDeltas, setCommentDeltasMap] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem("commentDeltas") || "{}"); } catch { return {}; }
  });
  const updateCommentDelta = (id: string) => {
    setCommentDeltasMap((prev) => {
      const updated = { ...prev, [id]: (prev[id] ?? 0) + 1 };
      localStorage.setItem("commentDeltas", JSON.stringify(updated));
      return updated;
    });
  };

  const getLikeKey = (member: Member | null) =>
    member ? `likedProducts_${member._id}` : null;

  // Global like counts — shared across all users
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem("productLikeCounts") || "{}"); } catch { return {}; }
  });

  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("memberData");
    if (!saved) return new Set();
    try {
      const member = JSON.parse(saved);
      const key = `likedProducts_${member._id}`;
      return new Set(JSON.parse(localStorage.getItem(key) || "[]"));
    } catch { return new Set(); }
  });

  useEffect(() => {
    const key = getLikeKey(authMember);
    if (key) {
      try {
        setLikedIds(new Set(JSON.parse(localStorage.getItem(key) || "[]")));
      } catch { setLikedIds(new Set()); }
    } else {
      setLikedIds(new Set());
    }
  }, [authMember]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = getLikeKey(authMember);
    if (!key) return;
    setLikedIds((prev) => {
      const updated = new Set(prev);
      const wasLiked = updated.has(id);
      wasLiked ? updated.delete(id) : updated.add(id);
      localStorage.setItem(key, JSON.stringify([...updated]));

      // Update global counts
      setLikeCounts((counts) => {
        const next = { ...counts, [id]: Math.max(0, (counts[id] ?? 0) + (wasLiked ? -1 : 1)) };
        localStorage.setItem("productLikeCounts", JSON.stringify(next));
        return next;
      });

      return updated;
    });
  };

  const isLiked = (id: string) => likedIds.has(id);
  const getLikeCount = (id: string, baseCount: number) => baseCount + (likeCounts[id] ?? 0);
  const clearLikes = () => {
    const key = getLikeKey(authMember);
    if (key) localStorage.removeItem(key);
    setLikedIds(new Set());
  };

  return (
    <GlobalContext.Provider value={{
      authMember, setAuthMember,
      orderBuilder, setOrderBuilder,
      freshViews, setFreshView,
      commentDeltas, updateCommentDelta,
      likedIds, toggleLike, isLiked, getLikeCount, clearLikes,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
