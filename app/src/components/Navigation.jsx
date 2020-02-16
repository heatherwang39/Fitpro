/*
 * Navigation component
 * Included on all pages
 */

import React from "react";
import { connect } from "react-redux";
import {
    AppBar, IconButton, Toolbar, Typography,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";

const _Navigation = ({ user }) => (
    <AppBar position="static">
        <Toolbar>
            <Typography variant="h5">
                FitPro
            </Typography>
            <div className="navbar-right">
                {user != null
            && (
                <div>
                    <IconButton>
                        <AccountCircle />
                        <Typography className="navbar-name">
                            {user.firstname}
                        </Typography>
                    </IconButton>
                </div>
            )}
            </div>
        </Toolbar>
    </AppBar>
);

const mapStateToProps = (state) => ({ user: state.user });

export const Navigation = connect(mapStateToProps)(_Navigation);
export default Navigation;
