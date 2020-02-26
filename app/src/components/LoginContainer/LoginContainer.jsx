import {
    TextField, Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    useHistory,
} from "react-router-dom";
import API from "../../api";
import { loginUser, loginSuccess, loginFailure } from "../../actions/authActions";
import { gotUserInfo } from "../../actions/userActions";

const checkLoginSuccess = (response) => response.status === "success";

const styles = {
    textField: {
        marginTop: "20px",
        width: 300,
    },
    button: {
        backgroundColor: "#4786FF",
        color: "white",
        marginTop: "20px",
        float: "right",
    },
    loginContainer: {
        width: 750,
        height: 550,
        margin: "auto",
        paddingTop: "87px",
    },
    registerButton: {
        color: "#5D8FFC",
        marginTop: 20,
        fontSize: 11,
    },
    loginForm: {
        width: 300,
        height: 229,
        marginLeft: 131,
    },
};

const LoginContainer = (props) => {
    // TODO validate username/password
    const { classes } = props;
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
                    props.gotUserInfo(response.user);
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

    const register = () => {
        history.push("/register");
    };

    return (
        <div className={classes.loginContainer}>
            <form className={classes.loginForm}>
                <TextField
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    className={classes.textField}
                    onChange={updateUsername}
                />
                <TextField
                    id="outlined-password-input"
                    type="password"
                    label="Password"
                    variant="outlined"
                    className={classes.textField}
                    onChange={updatePassword}
                />
                <Button className={classes.registerButton} onClick={register}>Register</Button>
                <Button variant="contained" onClick={login} className={classes.button}>Login</Button>
            </form>
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
    loginFailure: () => dispatch(loginFailure()),
});

LoginContainer.propTypes = {
    loginUser: PropTypes.func.isRequired,
    loginSuccess: PropTypes.func.isRequired,
    gotUserInfo: PropTypes.func.isRequired,
    loginFailure: PropTypes.func.isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LoginContainer));
