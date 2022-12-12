import React, { useState } from "react";
import { definePermission as define } from "../redux/actions/actions";
import { PermissionContext } from "./PermissionContext";

export const PermissionProvider = (props) => {
  const { store, children, reducerKey = "permissionsReducer" } = props;

  if (!store) {
    return null;
  }

  const { dispatch, getState, subscribe } = store;

  const state = getState();
  const permissionsSelector = (state) =>
    state[reducerKey] && state[reducerKey].permissions;
  const isLoadedSelector = (state) =>
    state[reducerKey] && state[reducerKey].isLoaded;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [permissions, setPermissions] = useState(permissionsSelector(state));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoaded, setIsLoaded] = useState(isLoadedSelector(state));

  subscribe(() => {
    const newState = getState();
    const newPermissions = permissionsSelector(newState);
    const newIsLoaded = isLoadedSelector(newState);

    if (JSON.stringify(newPermissions) !== JSON.stringify(permissions)) {
      setPermissions(newPermissions);
    }

    if (newIsLoaded !== isLoaded) {
      setIsLoaded(newIsLoaded);
    }
  });

  const hasPermission = (allowedPermissions) => {
    if (permissions) {
      let checkPermission = true;

      if (typeof allowedPermissions === "string") {
        return permissions.indexOf(allowedPermissions) !== -1;
      }

      allowedPermissions.forEach(ap => {
        if (permissions.indexOf(ap) === -1) {
          checkPermission = false;
        }
      });

      return checkPermission;
    }
    return false;
  };

  const definePermission = (definePermissions) =>
    dispatch(define(definePermissions));

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        hasPermission,
        definePermission,
        isLoaded: !!isLoaded
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}
