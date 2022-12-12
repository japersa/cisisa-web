import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { isLogin, logout } from "../middlewares/auth";
import { PermissionContext } from "./PermissionContext";

const PrivateRoute = ({ component: Component, when, ...rest }) => {
  const { hasPermission } = useContext(PermissionContext);

  // const isAllowed = hasPermission(when);

  // if (isAllowed) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
  /*  }
  else {
    logout();
    return (<Redirect to="/" />)
  } */
};

export default PrivateRoute;
