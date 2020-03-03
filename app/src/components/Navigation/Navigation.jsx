/*
 * Navigation component
 * Included on all pages
 */

import React from "react";
import { withRouter, Link } from "react-router-dom";

import { Button, Dropdown, Menu } from "semantic-ui-react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";


import { User } from "../../types/user";
import { loggedOut as loggedOutAction } from "../../actions/userActions";
import "./style.css";

function _Navigation({ user, loggedOut, location }) {
    const currentPage = location.pathname;

    return (
        <Menu inverted attached>
            <Menu.Menu position="left">
                <Link to="/">
                    <Menu.Item active={currentPage === "/"}>
                        Home
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
                        <Dropdown item text="More" simple>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/exercises" text="Exercises" />
                                { user.isTrainer && (
                                    <Dropdown.Item as={Link} to="/clients">
                                        My Clients
                                    </Dropdown.Item>
                                )}
                                { !user.isTrainer && (
                                    <Dropdown.Item as={Link} to="/my_trainers">
                                        My Trainers
                                    </Dropdown.Item>
                                )}
                                { user.isTrainer && (
                                    <Dropdown.Item as={Link} to="/templates">
                                        My Templates
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    )
                /* eslint-enable */
                }

                { user == null && (
                    <Link to="/exercises">
                        <Menu.Item active={currentPage === "/exercises"}>
                            Exercises
                        </Menu.Item>
                    </Link>
                )}
                { user == null && (
                    <Link to="/trainers">
                        <Menu.Item active={currentPage === "/trainers"}>
                            Trainers
                        </Menu.Item>
                    </Link>
                )}
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
                        <Dropdown item text={user.firstname} simple>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/user/${user.id}`} text="Me" />
                                <Dropdown.Item onClick={loggedOut} text="Log Out" />
                            </Dropdown.Menu>
                        </Dropdown>
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
