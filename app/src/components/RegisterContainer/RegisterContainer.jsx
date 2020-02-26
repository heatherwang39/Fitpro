import {
    Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { loginSuccess } from "../../actions/authActions";
import { gotUserInfo } from "../../actions/userActions";
import { gotProfile } from "../../actions/profileActions";
import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";
import UserInfoInput from "./UserInfoInput";
import API from "../../api";

const styles = {
    RegisterContainer: {
        width: 750,
        height: 550,
        margin: "auto",
        backgroundColor: "red",
        position: "relative",
        marginTop: 10,
    },
    Footer: {
        backgroundColor: "#fcfcfb",
        height: 50,
        bottom: 0,
        width: "100%",
        position: "absolute",
    },
    NextButton: {
        backgroundColor: "#4786FF",
        color: "white",
        float: "right",
        height: 40,
        marginTop: 5,
    },
};

const RegisterContainer = (props) => {
    // TODO validate username/password
    const { classes, _loginSuccess, _gotUserInfo } = props;
    const [currentView, setCurrentView] = useState(0);
    const [userInfo, setUserInfo] = useState({ accountType: "Client" });

    const updateUserInfo = (newInfo) => {
        setUserInfo({
            ...userInfo,
            ...newInfo,
        });
    };

    const checkEnterKeyPress = (e) => {
        if (e.keyCode === 13) {
            setCurrentView(currentView + 1);
        }
    };

    const shiftView = () => {
        setCurrentView(currentView + 1);
    };

    const registerUser = async () => {
        console.log(userInfo);
        const res = await API.registerUser(userInfo);
        if (!res.success) return;
        _loginSuccess(res.user);
        _gotUserInfo(res.user);
    };

    const views = [
        <UsernameInput onChange={(e) => updateUserInfo({ username: e.target.value })} onKeyDown={checkEnterKeyPress} />,
        <PasswordInput onChange={(e) => updateUserInfo({ password: e.target.value })} onKeyDown={checkEnterKeyPress} />,
        <UserInfoInput register={registerUser} onChange={updateUserInfo} userInfo={userInfo} />,
    ];

    return (
        <div className={classes.RegisterContainer}>
            {views[currentView]}
            <div className={classes.Footer}>
                {
                    currentView === 2
                        ? (
                            <Button
                                variant="contained"
                                className={classes.NextButton}
                                onClick={registerUser}
                            >
                                Finish
                            </Button>
                        )
                        : <Button variant="contained" className={classes.NextButton} onClick={shiftView}>Next</Button>
                }

            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    auth: state.authReducer,
    user: state.userReducer,
});

const mapDispatchToProps = (dispatch) => ({
    _loginSuccess: (user) => dispatch(loginSuccess(user)),
    _gotUserInfo: (userInfo) => dispatch(gotUserInfo(userInfo)),
    _gotProfile: (profile) => dispatch(gotProfile(profile)),
});

RegisterContainer.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    _loginSuccess: PropTypes.func.isRequired,
    _gotUserInfo: PropTypes.func.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RegisterContainer));
