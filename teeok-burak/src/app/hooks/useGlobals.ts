import { createContext, useContext } from "react";
import { Member } from "../../lib/types/member";

interface GlobalInterface {
  authMember: Member | null;
  setAuthMember: (member: Member | null) => void;
  orderBuilder: Date;
  setOrderBuilder: (input: Date) => void;
}

export const GlobalContext = createContext<GlobalInterface | undefined>(undefined);

export const useGlobals = (): GlobalInterface => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobals must be used within GlobalProvider");
  }
  return context;
};
