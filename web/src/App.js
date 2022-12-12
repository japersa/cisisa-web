import React, { useEffect } from "react";
import Routes from "./routes";
import { connect, useDispatch } from "react-redux";
import { AlertList } from "react-bs-notifier";
import { useAccess } from "./hooks/useAccess";
import jwt from "jsonwebtoken";
import Loader from "./components/Loader";
import { logout } from "./middlewares/auth";
import { useAuth } from "./hooks/useAuth";

const App = ({ alert, resetAlert, loading, validateToken }) => {
  const { definePermission, isLoaded } = useAccess();
  const dispatch = useDispatch()

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      validateToken();
    } else {
      definePermission([]);
    }
  }, []);

  // eslint-disable-next-line no-unused-vars
  const [position, setPosition] = React.useState("bottom-right");
  const [alerts, setAlerts] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [alertTimeout, setAlertTimeout] = React.useState(3000);

  const onDismissed = React.useCallback((alert) => {
    setAlerts((alerts) => {
      const idx = alerts.indexOf(alert);
      if (idx < 0) return alerts;
      return [...alerts.slice(0, idx), ...alerts.slice(idx + 1)];
    });
  }, []);

  const showAlert = (type, title, message) => {
    setAlerts((alerts) => [
      ...alerts,
      {
        id: new Date().getTime(),
        type: type,
        headline: title,
        message: message,
      },
    ]);
  };

  useEffect(() => {
    if (alert.showAlert) {
      showAlert(alert.type, alert.title, alert.message);
      resetAlert();
    }
  }, [alert]);

  if (!isLoaded)
    return (<Loader show={true}></Loader>
    );

  return (
    <>
      <Loader show={loading.show}></Loader>
      <AlertList
        position={position}
        alerts={alerts}
        timeout={alertTimeout}
        dismissTitle="Begone!"
        onDismiss={onDismissed}
      />
      <Routes />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    alert: state.alertState,
    loading: state.loadingState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetAlert: (data) =>
      dispatch({
        type: "RESET_ALERT",
      }),
    validateToken: (data) =>
      dispatch({
        type: "VALIDATE_TOKEN",
      }),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
