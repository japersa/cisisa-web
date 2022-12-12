import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Country from "./pages/Country";
import Department from "./pages/Department";
import City from "./pages/City";
import Role from "./pages/Role";
import Neighborhood from "./pages/Neighborhood";
import PublicRoute from "./hooks/PublicRoute";
import PrivateRoute from "./hooks/PrivateRoute";
import Permission from "./pages/Permission";
import User from "./pages/User";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import PostalCode from "./pages/PostalCode";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <PublicRoute path="/" exact restricted={true} component={SignIn} />
      <PublicRoute path="/signUp" exact restricted={true} component={SignUp} />
      <PublicRoute
        path="/forgotPassword"
        exact
        restricted={true}
        component={ForgotPassword}
      />
      <PrivateRoute
        exact
        path="/dashboard"
        component={Dashboard}
        when="feature:see-dashboard"
      />
      <PrivateRoute
        exact
        path="/countries"
        component={Country}
        when="feature:read-country"
      />
      <PrivateRoute
        exact
        path="/departments"
        component={Department}
        when="feature:read-department"
      />
      <PrivateRoute
        exact
        path="/cities"
        component={City}
        when="feature:read-city"
      />
      <PrivateRoute
        exact
        path="/neighborhoods"
        component={Neighborhood}
        when="feature:read-neighborhood"
      />
      <PrivateRoute
        exact
        path="/roles"
        component={Role}
        when="feature:read-role"
      />
      <PrivateRoute
        exact
        path="/permissions"
        component={Permission}
        when="feature:read-permission"
      />
      <PrivateRoute
        exact
        path="/users"
        component={User}
        when="feature:read-user"
      />
      <Route path="*" component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
