import React from "react";
import { Route, Router } from "react-router-dom";
import { Provider } from "react-redux";

import Navigation from "./Navigation";
import Home from "./Home";
import LoginContainer from "./LoginContainer";
import Profile from "./Profile";
import MailContainer from "./MailContainer";
import Calendar from "./Calendar";
import SearchTrainer from "./SearchTrainer";
import SearchExercise from "./SearchExercise";

import { history } from "../store/history";
import { store } from "../store";
import RegisterContainer from "./RegisterContainer";
import ProtectedRoute from "./ProtectedRoute";

export const Main = () => (
    <Router history={history}>
        <Provider store={store}>
            <Navigation />
            <Route
                exact
                path="/"
                component={Home}
            />
            <Route
                path="/login"
                component={LoginContainer}
            />
            <Route
                path="/user/:id(\d+)"
                component={Profile}
            />
            <Route
                path="/calendar"
                component={Calendar}
            />
            <Route
                path="/trainers"
                component={SearchTrainer}
            />
            <Route
                path="/exercises"
                component={SearchExercise}
            />
            <Route
                path="/register"
                component={RegisterContainer}
            />
            <ProtectedRoute
                path="/mail"
                component={MailContainer}
            />
        </Provider>
    </Router>
);

export default Main;
