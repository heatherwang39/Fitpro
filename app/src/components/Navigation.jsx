/*
 * Navigation component
 * Included on all pages
 */

import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    AppBar, IconButton, Menu, MenuItem, Toolbar, Typography,
} from "@material-ui/core";
import {
    AccountCircle, DirectionsRun, Home, People, Today,
} from "@material-ui/icons";

function _Navigation({ user }) {
    const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);
    const isOpen = Boolean(userMenuAnchorEl);
    const menuOpen = (event) => setUserMenuAnchorEl(event.currentTarget);
    const menuClose = () => setUserMenuAnchorEl(null);

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
                        <Link to="/exercises" className="navbar-link">
                            <IconButton>
                                <DirectionsRun />
                                <Typography className="navbar-label">
                                    Exercises
                                </Typography>
                            </IconButton>
                        </Link>
                    </div>
                    {user.isTrainer
                        && (
                            <div className="navbar-trainer">
                                <Link to="/clients" className="navbar-link">
                                    <IconButton>
                                        <People />
                                        <Typography className="navbar-label">
                                            Clients
                                        </Typography>
                                    </IconButton>
                                </Link>
                            </div>
                        )}
                    {!user.isTrainer
                        && (
                            <div className="navbar-client">
                                <Link to="/trainers" className="navbar-link">
                                    <IconButton>
                                        <People />
                                        <Typography className="navbar-label">
                                            Trainers
                                        </Typography>
                                    </IconButton>
                                </Link>
                            </div>
                        )}
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
                </div>

                <div className="navbar-right">
                    {user == null && (
                        <Link to="/register" className="navbar-link">
                            <div className="navbar-logged-out">
                                <Typography>Sign Up</Typography>
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
                                <Link to="/me" className="navbar-menu-link">
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

const mapStateToProps = (state) => ({ user: state.user });

export const Navigation = connect(mapStateToProps)(_Navigation);
export default Navigation;
