import React from "react";
import { Route, Router } from "react-router-dom";
import { Provider } from "react-redux";

import Navigation from "./Navigation";
import Home from "./Home";
import LoginContainer from "./LoginContainer";
import Profile from "./Profile";
import MailContainer from "./MailContainer";
import Calendar from "./Calendar";
import ViewClientsContainer from "./ViewClientsContainer";
import SearchTrainer from "./SearchTrainer";
import SearchExercise from "./SearchExercise";
import ExerciseByName from "./SearchExercise/ExerciseByName";
import WorkoutList from "./WorkoutList";
import Workout from "./Workout";

import { history } from "../store/history";
import { store } from "../store";
import RegisterContainer from "./RegisterContainer";
import ProtectedRoute from "./ProtectedRoute";
import ErrorBoundary from "./ErrorBoundary";
import UserContainer from "./UserContainer";

const Main = () => (
    <ErrorBoundary>
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
                    path="/user/:id"
                    component={Profile}
                />
                <Route
                    path="/calendar"
                    component={Calendar}
                />
                <Route
                    path="/my_trainers"
                    component={ViewClientsContainer}
                />
                <Route
                    path="/exercises"
                    component={SearchExercise}
                />
                <Route
                    path="/exercise/:name"
                    component={ExerciseByName}
                />
                <Route
                    path="/register"
                    component={RegisterContainer}
                />
                <ProtectedRoute
                    path="/mail"
                    component={MailContainer}
                />
                <ProtectedRoute
                    path="/clients"
                    component={ViewClientsContainer}
                />
                <ProtectedRoute
                    path="/client"
                    component={UserContainer}
                />
                <Route
                    path="/trainers"
                    component={SearchTrainer}
                />
                <Route
                    path="/workouts"
                    component={WorkoutList}
                />
                <Route
                    path="/workout/:id"
                    component={Workout}
                />
            </Provider>
        </Router>
    </ErrorBoundary>
);

export default Main;
