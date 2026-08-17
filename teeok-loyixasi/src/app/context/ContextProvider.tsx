import React, { ReactNode, useState, useEffect } from "react";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";
import { setUnauthorizedHandler } from "../../lib/config";
import { sweetLoginRequiredAlert, sweetErrorHandling } from "../../lib/sweetAlert";
import ProductService from "../services/ProductService";

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

  // Keep React auth state in sync when axios interceptor clears the session on 401
  useEffect(() => {
    setUnauthorizedHandler(() => setAuthMemberState(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  // Auth modals live in context so any feature (e.g. like guard) can open them
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [signupOpen, setSignupOpen] = useState<boolean>(false);

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

  // Likes are server state (View collection), not per-browser storage — every
  // member sees the same count, on any device. `likeCounts` mirrors the
  // freshest count the server has confirmed for a product (same pattern as
  // freshViews); products not yet toggled fall back to their fetched
  // `productLikes` baseline.
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCountsMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!authMember) {
      setLikedIds(new Set());
      return;
    }
    let cancelled = false;
    new ProductService().getMyLikedProductIds()
      .then((ids) => { if (!cancelled) setLikedIds(new Set(ids)); })
      .catch(() => { if (!cancelled) setLikedIds(new Set()); });
    return () => { cancelled = true; };
  }, [authMember]);

  const toggleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!authMember) {
      const confirmed = await sweetLoginRequiredAlert();
      if (confirmed) setLoginOpen(true);
      return;
    }
    try {
      const { productLikes, liked } = await new ProductService().likeProduct(id);
      setLikeCountsMap((prev) => ({ ...prev, [id]: productLikes }));
      setLikedIds((prev) => {
        const updated = new Set(prev);
        liked ? updated.add(id) : updated.delete(id);
        return updated;
      });
    } catch (err) {
      await sweetErrorHandling(err);
    }
  };

  const isLiked = (id: string) => likedIds.has(id);
  const getLikeCount = (id: string, baseCount: number) => likeCounts[id] ?? baseCount;
  const clearLikes = () => setLikedIds(new Set());

  return (
    <GlobalContext.Provider value={{
      authMember, setAuthMember,
      orderBuilder, setOrderBuilder,
      freshViews, setFreshView,
      commentDeltas, updateCommentDelta,
      likedIds, toggleLike, isLiked, getLikeCount, clearLikes,
      loginOpen, setLoginOpen, signupOpen, setSignupOpen,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
