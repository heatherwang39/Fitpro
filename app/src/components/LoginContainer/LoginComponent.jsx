import {
    TextField, Button, withStyles,
} from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

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

// A pure function to render the login component
const LoginComponent = (props) => {
    const {
        linkToRegister, loginUser, updateUsername, updatePassword, classes,
    } = props;
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
                <Button className={classes.registerButton} onClick={linkToRegister}>Register</Button>
                <Button variant="contained" onClick={loginUser} className={classes.button}>Login</Button>
            </form>
        </div>
    );
};


LoginComponent.propTypes = {
    linkToRegister: PropTypes.func.isRequired,
    loginUser: PropTypes.func.isRequired,
    updateUsername: PropTypes.func.isRequired,
    updatePassword: PropTypes.func.isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(LoginComponent);
