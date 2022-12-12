import React, { useContext } from "react";
import { PermissionContext } from "./PermissionContext";

export const Show = ({ when = "", fallback, children, ...rest }) => {
  const { hasPermission } = useContext(PermissionContext);

  const show = hasPermission(when);

  /*  if (show) {
    return React.Children.map(children, child =>
      React.cloneElement(child, rest)
    );
  }

  return fallback || null; */

  return React.Children.map(children, (child) =>
    React.cloneElement(child, rest)
  );
};
