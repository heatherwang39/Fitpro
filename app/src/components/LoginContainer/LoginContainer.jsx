import { connect } from "react-redux";
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    useHistory,
} from "react-router-dom";
import API from "../../api/api";
import { loginUser, loginSuccess, loginFailure } from "../../actions/authActions";
import { gotUserInfo } from "../../actions/userActions";
import LoginComponent from "./LoginComponent";
import { User } from "../../types";

const checkLoginSuccess = (response) => response.status === "success";

const LoginContainer = (props) => {
    // TODO validate username/password
    const userInfo = (username, password) => ({ username, password });
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    // Login the user
    const login = () => {
        const info = userInfo(username, password);
        // Begin action to login the user
        props.loginUser(info);
        API.login(info.username, info.password).then(
            (response) => {
                const success = checkLoginSuccess(response);
                if (success) {
                    props.loginSuccess(response.user);
                    props.gotUserInfo(new User({ ...response.user }));
                    history.push("/");
                } else {
                    props.loginFailure();
                }
            },
        );
    };

    // Update username in local state
    const updateUsername = (e) => {
        const newUsername = e.target.value;
        // Potentially do some checks here?
        setUsername(newUsername);
    };

    // Update password in local state
    const updatePassword = (e) => {
        const newPassword = e.target.value;
        // Potentially do some checks here?
        setPassword(newPassword);
    };

    return (
        <LoginComponent
            loginUser={login}
            updateUsername={updateUsername}
            updatePassword={updatePassword}
            linkToRegister={() => { history.push("/register"); }}
        />
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
    loginFailure: () => dispatch(loginFailure()),
});

LoginContainer.propTypes = {
    loginUser: PropTypes.func.isRequired,
    loginSuccess: PropTypes.func.isRequired,
    gotUserInfo: PropTypes.func.isRequired,
    loginFailure: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
