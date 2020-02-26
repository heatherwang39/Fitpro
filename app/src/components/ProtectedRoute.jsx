import React from "react";
import {
    Route,
    Redirect,
} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { user } = { ...rest };
    let isAuth = false;
    if (user) {
        isAuth = true;
    }
    return (
        <Route
            {...rest}
            render={(props) => (
                isAuth
                    ? <Component {...props} />
                    : <Redirect to="/login" />
            )}
        />
    );
};

const mapStateToProps = (state) => ({
    user: state.userReducer,
});

ProtectedRoute.propTypes = {
    component: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(ProtectedRoute);
