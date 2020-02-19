import { connect } from "react-redux";
import React from "react";
import PropTypes from "prop-types";
import { loginUser, loginSuccess } from "../../actions/authActions";
import { gotUserInfo } from "../../actions/userActions";

import { clientUser, trainerUser } from "../../data";

const fakeAuth = async (username, password) => {
    switch (username) {
    case "user":
        if (password !== "user") return { status: "Invalid password" };
        return clientUser;
    case "user2":
        if (password !== "user2") return { status: "Invalid password" };
        return trainerUser;
    default:
        return { status: "Invalid user" };
    }
};

const checkLoginSuccess = (response) => true || response;

const LoginContainer = (props) => {
    // TODO get this from a TextField instead of using a constant
    const userInfo = () => ({ username: "user", password: "user" });

    const login = () => {
        const info = userInfo();
        props.loginUser(info);
        fakeAuth(info.username, info.password).then(
            (response) => {
                const success = checkLoginSuccess(response);
                if (success) {
                    props.loginSuccess(response);
                    props.gotUserInfo(response);
                } else console.log("TODO LOGIN FAIL");
            },
        );
    };

    return (
        <div className="login-container">
            <button type="button" onClick={login}>Login</button>
        </div>
    );
};

const mapStateToProps = (state) => ({
    auth: state.authReducer,
    user: state.userReducer,
});

const mapDispatchToProps = (dispatch) => ({
    loginUser: (user) => dispatch(loginUser(user)),
    loginSuccess: (user) => dispatch(loginSuccess(user)),
    gotUserInfo: (userInfo) => dispatch(gotUserInfo(userInfo)),
});

LoginContainer.propTypes = {
    loginUser: PropTypes.func.isRequired,
    loginSuccess: PropTypes.func.isRequired,
    gotUserInfo: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
