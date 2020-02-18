import { connect } from "react-redux";
import React from "react";
import {
    Avatar, CircularProgress, Grid, Paper, Typography,
} from "@material-ui/core";
import {
    Email, Equalizer, LocationOn, Phone,
} from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import { PropTypes } from "prop-types";
import { getProfile as getProfileAction, gotProfile as gotProfileAction } from "../../actions/profileActions";
import { User } from "../../types";

import { clientUser, trainerUser } from "../../data";


// TODO replace this with a server call in Phase 2
const getProfileFromServer = async (id) => {
    switch (id) {
    case 1:
        return clientUser;
    case 2:
        return trainerUser;
    default:
        console.log(`INVALID ID ${id}`);
        return {};
    }
};

// TODO make this really check success in Phase 2
const checkGetProfileSuccess = (response) => true || response;

const _Profile = ({
    match, profile, getProfile, gotProfile,
}) => {
    const id = parseInt(match.params.id, 10);
    if (profile.user == null && !profile.gettingProfile) {
        getProfile(id); // Just an action, doesn't actually get the profile
        getProfileFromServer(id).then( // Actually get the profile from the server
            (response) => {
                const success = checkGetProfileSuccess(response);
                if (!success) {
                    // TODO tell the user something went wrong
                    console.log("error getting profile");
                }
                gotProfile(response);
            },
        );
    }

    // Loading profile from server
    if (profile.user == null) {
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
                </Grid>
            </Paper>
        </div>
    );
};

const mapStateToProps = (state) => ({
    profile: state.profileReducer,
});

const mapDispatchToProps = (dispatch) => ({
    getProfile: (id) => dispatch(getProfileAction(id)),
    gotProfile: (userProfile) => dispatch(gotProfileAction(userProfile)),
});

_Profile.propTypes = {
    // react-router gives a string for URL parameters so id is a string
    // However, we constrain it to be only digits in Main.jsx so we can safely parseInt _Profile
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
    profile: PropTypes.shape({ gettingProfile: PropTypes.bool, user: PropTypes.instanceOf(User) }).isRequired,
    getProfile: PropTypes.func.isRequired,
    gotProfile: PropTypes.func.isRequired,
};

export const Profile = connect(mapStateToProps, mapDispatchToProps)(_Profile);

export default Profile;
