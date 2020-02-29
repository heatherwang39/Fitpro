/*
 * Navigation component
 * Included on all pages
 */

import React from "react";
import { withRouter, Link } from "react-router-dom";

import { connect } from "react-redux";
import { PropTypes } from "prop-types";

import { User } from "../../types/user";
import { loggedOut as loggedOutAction } from "../../actions/userActions";
import "./style.css";

function _Navigation({ user, loggedOut, location }) {
    const currentPage = location.pathname;

    return (
        <div className="ui inverted menu attached">
            <div className="menu left">
                <Link to="/" className={`item ${currentPage === "/" ? "active" : ""}`}>
                    Home
                </Link>
                {user != null && (
                    <Link to="/calendar" className={`item ${currentPage === "/calendar" ? "active" : ""}`}>
                        Calendar
                    </Link>
                )}
                { user != null && (
                    <Link to="/mail" className={`item ${currentPage === "/mail" ? "active" : ""}`}>
                        Mail
                    </Link>
                )}

                {/* eslint-disable jsx-a11y/click-events-have-key-events */
                    user != null && (
                        <div className="ui simple dropdown item">
                            More
                            <i className="dropdown icon" />
                            <div className="menu">
                                <Link to="/exercises" className="item">Exercises</Link>
                                { user.isTrainer && (
                                    <Link to="/clients" className="item">
                                        My Clients
                                    </Link>
                                )}
                                { !user.isTrainer && (
                                    <Link to="/my_trainers" className="item">
                                        My Trainers
                                    </Link>
                                )}
                            </div>
                        </div>
                    )
                /* eslint-enable */
                }

                { user == null && (
                    <Link to="/exercises" className={`item ${currentPage === "/exercises" ? "active" : ""}`}>
                        Exercises
                    </Link>
                )}
                { user == null && (
                    <Link to="/trainers" className={`item ${currentPage === "/trainers" ? "active" : ""}`}>
                        Trainers
                    </Link>
                )}
            </div>
            <div className="menu right">
                {user == null && (
                    <Link to="/login" className="item ui inverted button">
                        Log In
                    </Link>
                )}
                {/* eslint-disable jsx-a11y/click-events-have-key-events */
                    user != null && (
                        <div className="ui simple dropdown item">
                            {user.firstname}
                            <i className="dropdown icon" />
                            <div className="menu">
                                <Link to={`/user/${user.id}`} className="item">Me</Link>
                                <div role="none" onClick={loggedOut} className="item">Log Out</div>
                            </div>
                        </div>
                    )
                /* eslint-enable */
                }
            </div>
        </div>
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
