import React from "react";
import { Route, Router } from "react-router-dom";
import { Provider } from "react-redux";

import { Navigation } from "./Navigation";
import { Home } from "./Home";

import { history } from "../store/history";
import { store } from "../store";

export const Main = () => (
    <Router history={history}>
        <Provider store={store}>
            <div className="container mt-3">
                <Navigation />
                <Route
                    exact
                    path="/"
                    component={Home}
                />
            </div>
        </Provider>
    </Router>
);

export default Main;
