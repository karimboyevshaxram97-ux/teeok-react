import { createContext, useContext } from "react";
import { Member } from "../../lib/types/member";
import React from "react";

interface GlobalInterface {
  authMember: Member | null;
  setAuthMember: (member: Member | null) => void;
  orderBuilder: Date;
  setOrderBuilder: (input: Date) => void;
  freshViews: Record<string, number>;
  setFreshView: (id: string, count: number) => void;
  commentDeltas: Record<string, number>;
  updateCommentDelta: (id: string) => void;
  likedIds: Set<string>;
  toggleLike: (id: string, e: React.MouseEvent) => Promise<void>;
  isLiked: (id: string) => boolean;
  getLikeCount: (id: string, baseCount: number) => number;
  clearLikes: () => void;
  loginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  signupOpen: boolean;
  setSignupOpen: (open: boolean) => void;
}

export const GlobalContext = createContext<GlobalInterface | undefined>(undefined);

export const useGlobals = (): GlobalInterface => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobals must be used within GlobalProvider");
  }
  return context;
};
