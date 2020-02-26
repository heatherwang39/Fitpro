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
    AccountCircle, DirectionsRun, Home, MoreHoriz, People, Today,
} from "@material-ui/icons";

import { User } from "../../types/user";
import "./style.css";

function _Navigation({ user }) {
    const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);
    const isOpen = Boolean(userMenuAnchorEl);
    const menuOpen = (event) => setUserMenuAnchorEl(event.currentTarget);
    const menuClose = () => setUserMenuAnchorEl(null);
    const [moreMenuAnchorEl, setMoreMenuAnchorEl] = React.useState(null);
    const moreIsOpen = Boolean(moreMenuAnchorEl);
    const moreMenuOpen = (event) => setMoreMenuAnchorEl(event.currentTarget);
    const moreMenuClose = () => setMoreMenuAnchorEl(null);

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
                        </div>
                    )}
                    <div className="navbar-always">
                        <IconButton aria-controls="navbar-more-menu" aria-haspopup="true" onClick={moreMenuOpen}>
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
                            open={moreIsOpen}
                            onClose={moreMenuClose}
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
                            <IconButton aria-controls="navbar-user-menu" aria-haspopup="true" onClick={menuOpen}>
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
                                open={isOpen}
                                onClose={menuClose}
                            >
                                <Link to={`/user/${user.id}`} className="navbar-menu-link">
                                    <MenuItem onClick={menuClose}>Profile</MenuItem>
                                </Link>
                                <Link to="/logout" className="navbar-menu-link">
                                    <MenuItem onClick={menuClose}>Sign Out</MenuItem>
                                </Link>
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
};

_Navigation.defaultProps = {
    user: null,
};

const mapStateToProps = (state) => ({ user: state.userReducer });

export const Navigation = connect(mapStateToProps)(_Navigation);
export default Navigation;
