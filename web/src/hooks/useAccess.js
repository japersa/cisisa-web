import { useContext, useMemo } from "react";
import { PermissionContext } from "./PermissionContext";

export const useAccess = () => {
  const {
    hasPermission: checkPermission,
    definePermission,
    isLoaded
  } = useContext(PermissionContext);

  const hasPermission = (permissions) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => checkPermission(permissions), [permissions]);
  };

  return { isLoaded, hasPermission, definePermission };
}
