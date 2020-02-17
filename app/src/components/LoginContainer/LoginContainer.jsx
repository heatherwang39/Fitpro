import { connect } from "react-redux";
import React from "react";
import PropTypes from "prop-types";
import { loginUser, loginSuccess } from "../../actions/auth_actions";
import { gotUserInfo } from "../../actions/user_actions";

import { User } from "../../types";

const fakeAuth = async (username, password) => (
    new User(1, username, "firstname", "lastname", "email@mail.com",
        "5555555555", "Toronto", "6'0", "200lb", false, false, "goalType", 3.5)
);

const checkLoginSuccess = (response) => true;

const LoginContainer = (props) => {
    // TODO validate username/password
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
