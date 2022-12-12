import React, { useState } from "react";
import { AuthContext } from "./AuthContext";
import jwt from "jsonwebtoken";

export const AuthProvider = (props) => {
    const { store, children, reducerKey = "authReducer" } = props;

    if (!store) {
        return null;
    }

    const { dispatch, getState, subscribe } = store;

    const state = getState();
    const sessionSelector = (state) =>
        state[reducerKey] && state[reducerKey].session;
    const isAuthenticatedSelector = (state) =>
        state[reducerKey] && state[reducerKey].isAuthenticated;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [session, setSession] = useState(sessionSelector(state));
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isAuthenticated, setIsAuthenticated] = useState(isAuthenticatedSelector(state));

    subscribe(() => {
        const newState = getState();
        const newSession = sessionSelector(newState);
        const newIsAuthenticated = isAuthenticatedSelector(newState);
        if (JSON.stringify(newSession) !== JSON.stringify(session)) {
            setSession(newSession);
        }

        if (newIsAuthenticated !== isAuthenticated) {
            setIsAuthenticated(newIsAuthenticated);
        }
    });

    const signIn = (payload) =>
        dispatch({
            type: "SIGN_IN",
            payload
        });

    const signOut = () =>
        dispatch({
            type: "SIGN_OUT",
            payload: {}
        });

    return (
        <AuthContext.Provider
            value={{
                session,
                isAuthenticated,
                signIn,
                signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
