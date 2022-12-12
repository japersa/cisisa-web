import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLogin } from '../middlewares/auth';

const PublicRoute = ({
  component: Component,
  restricted,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      isLogin() && restricted ? (
        <Redirect to="/dashboard" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

export default PublicRoute;
