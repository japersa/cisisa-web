import { useContext, useMemo } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
  const {
    session,
    isAuthenticated,
    signIn,
    signOut
  } = useContext(AuthContext);

  return {
    session,
    isAuthenticated,
    signIn,
    signOut
  };
}
