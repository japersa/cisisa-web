import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './assets/css/sb-admin-2.css';
import './assets/css/style.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { PermissionProvider } from './hooks/PermissionProvider'
import { AuthProvider } from './hooks/AuthProvider';

ReactDOM.render(
    <Provider store={store} key="provider">
        <AuthProvider store={store} reducerKey="auth">
            <PermissionProvider store={store} reducerKey="permissions">
                <App />
            </PermissionProvider>
        </AuthProvider>
    </Provider>, document.getElementById('root'));

reportWebVitals();
