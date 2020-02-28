/*
 * Navigation component
 * Included on all pages
 */

import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import {
    AppBar, IconButton, Menu, MenuItem, Toolbar, Typography,
} from "@material-ui/core";
import {
    AccountCircle, DirectionsRun, Home, Mail, MoreHoriz, People, Today,
} from "@material-ui/icons";

import { User } from "../../types/user";
import { loggedOut as loggedOutAction } from "../../actions/userActions";
import "./style.css";

function _Navigation({ user, loggedOut }) {
    const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);
    const openUserMenu = (event) => {
        if (userMenuAnchorEl !== event.currentTarget) setUserMenuAnchorEl(event.currentTarget);
    };
    const closeUserMenu = () => setUserMenuAnchorEl(null);
    const [moreMenuAnchorEl, setMoreMenuAnchorEl] = React.useState(null);
    const openMoreMenu = (event) => {
        if (moreMenuAnchorEl !== event.currentTarget) setMoreMenuAnchorEl(event.currentTarget);
    };
    const closeMoreMenu = () => setMoreMenuAnchorEl(null);

    const logout = () => {
        // TODO actually log out (reset token, etc.)
        closeUserMenu();
        closeMoreMenu();
        loggedOut(user);
    };

    return (
        <AppBar position="static" className="navbar-container">
            <Toolbar>
                <div className="navbar-left">
                    <Link to="/" className="navbar-link">
                        <Typography variant="h5">
                            FitPro
                        </Typography>
                    </Link>
                </div>

                <div className="navbar-center">
                    <div className="navbar-always">
                        <Link to="/" className="navbar-link">
                            <IconButton>
                                <Home />
                                <Typography className="navbar-label">
                                    Home
                                </Typography>
                            </IconButton>
                        </Link>
                    </div>
                    {user != null && (
                        <div className="navbar-logged-in">
                            <Link to="/calendar" className="navbar-link">
                                <IconButton>
                                    <Today />
                                    <Typography className="navbar-label">
                                        Calendar
                                    </Typography>
                                </IconButton>
                            </Link>
                            <Link to="/mail" className="navbar-link">
                                <IconButton>
                                    <Mail />
                                    <Typography className="navbar-label">
                                        Mail
                                    </Typography>
                                </IconButton>
                            </Link>
                        </div>
                    )}
                    <div className="navbar-always">
                        <IconButton
                            aria-owns={moreMenuAnchorEl ? "navbar-more-menu" : undefined}
                            aria-haspopup="true"
                            onMouseEnter={openMoreMenu}
                            onClick={openMoreMenu}
                        >
                            <MoreHoriz />
                            <Typography className="navbar-label">
                                More
                            </Typography>
                        </IconButton>
                        <Menu
                            id="navbar-more-menu"
                            anchorEl={moreMenuAnchorEl}
                            getContentAnchorEl={null} // Vertical positioning doesn't work without this
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            open={Boolean(moreMenuAnchorEl)}
                            onClose={closeMoreMenu}
                            MenuListProps={{ onMouseLeave: closeMoreMenu }}
                        >
                            <Link to="/exercises" className="navbar-menu-link">
                                <MenuItem>
                                    <DirectionsRun />
                                    <Typography className="navbar-label">
                                        Exercises
                                    </Typography>
                                </MenuItem>
                            </Link>
                            {user != null && user.isTrainer
                            && (
                                <Link to="/clients" className="navbar-menu-link">
                                    <MenuItem>
                                        <People />
                                        <Typography className="navbar-label">
                                            Clients
                                        </Typography>
                                    </MenuItem>
                                </Link>
                            )}
                            {user != null && !user.isTrainer
                        && (
                            <Link to="/trainers" className="navbar-menu-link">
                                <MenuItem>
                                    <People />
                                    <Typography className="navbar-label">
                                        Trainers
                                    </Typography>
                                </MenuItem>
                            </Link>
                        )}
                        </Menu>
                    </div>
                </div>
                <div className="navbar-right">
                    {user == null && (
                        <Link to="/login" className="navbar-link">
                            <div className="navbar-logged-out">
                                <Typography>Log In</Typography>
                            </div>
                        </Link>
                    )}
                    {user != null && (
                        <div className="navbar-logged-in">
                            <IconButton
                                aria-owns={userMenuAnchorEl ? "navbar-user-menu" : undefined}
                                aria-haspopup="true"
                                onMouseEnter={openUserMenu}
                                onClick={openUserMenu}
                            >
                                <AccountCircle />
                                <Typography className="navbar-label">
                                    {user.firstname}
                                </Typography>
                            </IconButton>
                            <Menu
                                id="navbar-user-menu"
                                anchorEl={userMenuAnchorEl}
                                getContentAnchorEl={null} // Vertical positioning doesn't work without this
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                }}
                                open={Boolean(userMenuAnchorEl)}
                                onClose={closeUserMenu}
                                MenuListProps={{ onMouseLeave: closeUserMenu }}
                            >
                                <Link to={`/user/${user.id}`} className="navbar-menu-link">
                                    <MenuItem onClick={closeUserMenu}>Profile</MenuItem>
                                </Link>
                                <div className="navbar-menu-link">
                                    <MenuItem onClick={logout}>Sign Out</MenuItem>
                                </div>
                            </Menu>
                        </div>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
}

_Navigation.propTypes = {
    user: PropTypes.instanceOf(User),
    loggedOut: PropTypes.func.isRequired,
};

_Navigation.defaultProps = {
    user: null,
};

const mapStateToProps = (state) => ({ user: state.userReducer });

const mapDispatchToProps = (dispatch) => ({
    loggedOut: (user) => dispatch(loggedOutAction(user)),
});

export const Navigation = connect(mapStateToProps, mapDispatchToProps)(_Navigation);
export default Navigation;
