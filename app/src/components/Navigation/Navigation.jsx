/*
 * Navigation component
 * Included on all pages
 */

import React from "react";
import { withRouter, Link, useHistory } from "react-router-dom";

import { Button, Dropdown, Menu } from "semantic-ui-react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";


import { User } from "../../types/user";
import { loggedOut as loggedOutAction } from "../../actions/userActions";
import "./style.css";

const userMenuOptions = [{ key: 1, value: "profile", text: "Me" }, { key: 2, value: "logout", text: "Log Out" }];

function _Navigation({ user, loggedOut, location }) {
    const currentPage = location.pathname;
    const history = useHistory();

    const moreMenuOptions = () => {
        const options = [];
        if (user.isTrainer) {
            options.push({ key: 2, value: "clients", text: "My Clients" });
            options.push({ key: 3, value: "templates", text: "My Templates" });
        } else {
            options.push({ key: 4, value: "my_trainers", text: "My Trainers" });
        }
        return options;
    };


    return (
        <Menu inverted attached>
            <Menu.Menu position="left">
                <Link to="/">
                    <Menu.Item active={currentPage === "/"}>
                        Home
                    </Menu.Item>
                </Link>
                <Link to="/trainers">
                    <Menu.Item active={currentPage === "/trainers"}>
                        Trainers
                    </Menu.Item>
                </Link>
                <Link to="/exercises">
                    <Menu.Item active={currentPage === "/exercises"}>
                        Exercises
                    </Menu.Item>
                </Link>
                {user != null && (
                    <Link to="/calendar">
                        <Menu.Item active={currentPage === "/calendar"}>
                            Calendar
                        </Menu.Item>
                    </Link>
                )}
                { user != null && (
                    <Link to="/mail">
                        <Menu.Item active={currentPage === "/mail"}>
                            Mail
                        </Menu.Item>
                    </Link>
                )}

                {/* eslint-disable jsx-a11y/click-events-have-key-events */
                    user != null && (
                        <Dropdown
                            item
                            text="More"
                            simple
                            closeOnChange
                            options={moreMenuOptions()}
                            onChange={(_, v) => history.push(`/${v.value}`)}
                        />
                    )
                /* eslint-enable */
                }
            </Menu.Menu>
            <Menu.Menu position="right">
                {user == null && (
                    <Link to="/login">
                        <Button inverted id="login-btn">
                            Log In
                        </Button>
                    </Link>
                )}
                {/* eslint-disable jsx-a11y/click-events-have-key-events */
                    user != null && (
                        <Dropdown
                            item
                            text={user.firstname}
                            simple
                            options={userMenuOptions}
                            onChange={(_, v) => (v.value === "logout"
                                ? loggedOut() && history.push("/") : history.push(`/user/${user.id}`))}
                        />
                    )
                /* eslint-enable */
                }
            </Menu.Menu>
        </Menu>
    );
}

_Navigation.propTypes = {
    user: PropTypes.instanceOf(User),
    loggedOut: PropTypes.func.isRequired,
    location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
};

_Navigation.defaultProps = {
    user: null,
};

const mapStateToProps = (state) => ({ user: state.userReducer });

const mapDispatchToProps = (dispatch) => ({
    loggedOut: (user) => dispatch(loggedOutAction(user)),
});

export const Navigation = withRouter(connect(mapStateToProps, mapDispatchToProps)(_Navigation));
export default Navigation;
