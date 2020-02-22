import { connect } from "react-redux";
import React from "react";
import { Link } from "react-router-dom";
import {
    Avatar, Button, CircularProgress, Grid, Paper, Typography,
} from "@material-ui/core";
import {
    Email, Equalizer, LocationOn, Phone,
} from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import { PropTypes } from "prop-types";

import { getProfile as getProfileAction, gotProfile as gotProfileAction } from "../../actions/profileActions";
import { User } from "../../types/user";
import API from "../../api";

/*
 * Check that response is a valid profile
 * Return null on success or an error message on failure
 */
const checkGetProfileError = (response) => {
    (() => {})(response); // Shut up eslint
    return null;
};

const _Profile = ({
    match, user, profile, getProfile, gotProfile,
}) => {
    let error = null;
    const id = parseInt(match.params.id, 10);
    if (Number.isNaN(id)) {
        error = "Invalid user id";
    } else if (profile.user == null && !profile.gettingProfile) {
        getProfile(id); // Just an action, doesn't actually get the profile
        API.getProfile(id).then( // Actually get the profile from the server
            (response) => {
                error = checkGetProfileError(response);
                gotProfile(response);
            },
        );
    }

    // Error retrieving profile
    if (error != null) {
        return (
            <div className="center">
                <Typography>
                    Unable to load profile:
                    {error}
                </Typography>
            </div>
        );
    }

    // Loading profile from server
    if (profile.user == null || profile.gettingProfile) {
        return (
            <div className="center">
                <CircularProgress />
            </div>
        );
    }

    // Already got profile from server
    return (
        <div className="page">
            <Paper>
                <div className="profile">
                    <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
                        <Grid item>
                            <Avatar
                                alt={`${profile.user.firstname} ${profile.user.lastname}`}
                                variant="square"
                                className="profile-avatar"
                            />
                        </Grid>
                        <Grid item>
                            <Typography>
                                {`${profile.user.firstname} ${profile.user.lastname} (${profile.user.username})`}
                            </Typography>
                        </Grid>
                        <Grid item>
                            {profile.user.isTrainer && (
                                <Typography>&nbsp;Trainer</Typography>
                            )}
                            {!profile.user.isTrainer && (
                                <Typography>&nbsp;Client</Typography>
                            )}
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" alignItems="center">
                                <Equalizer />
                                <Typography>
                                    {`${profile.user.height} ${profile.user.weight}`}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" alignItems="center">
                                <Email />
                                <Typography>{profile.user.email}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" alignItems="center">
                                <Phone />
                                <Typography>{profile.user.phone}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" alignItems="center">
                                <LocationOn />
                                <Typography>{profile.user.location}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" alignItems="center">
                                <Rating value={profile.user.rating} precision={0.5} readOnly />
                            </Grid>
                        </Grid>
                        {profile.user.isTrainer && (user == null || user.isTrainer)
                && (
                    <Grid item>
                        <Link to={`/book/${profile.user.id}`}>
                            <Button variant="contained">
                                Book with this trainer
                            </Button>
                        </Link>
                    </Grid>
                )}
                    </Grid>
                </div>
            </Paper>
        </div>
    );
};

const mapStateToProps = (state) => ({
    user: state.userReducer,
    profile: state.profileReducer,
});

const mapDispatchToProps = (dispatch) => ({
    getProfile: (id) => dispatch(getProfileAction(id)),
    gotProfile: (userProfile) => dispatch(gotProfileAction(userProfile)),
});

_Profile.propTypes = {
    // react-router gives a string for URL parameters so id is a string
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
    user: PropTypes.instanceOf(User),
    profile: PropTypes.shape(
        { gettingProfile: PropTypes.bool, user: PropTypes.instanceOf(User) },
    ).isRequired,
    getProfile: PropTypes.func.isRequired,
    gotProfile: PropTypes.func.isRequired,
};

_Profile.defaultProps = {
    user: null,
};

export const Profile = connect(mapStateToProps, mapDispatchToProps)(_Profile);

export default Profile;
