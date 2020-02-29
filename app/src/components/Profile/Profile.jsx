import { connect } from "react-redux";
import React from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";

import { getProfile as getProfileAction, gotProfile as gotProfileAction } from "../../actions/profileActions";
import { User } from "../../types/user";
import API from "../../api";
import "./style.css";

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
                Unable to load profile:
                {error}
            </div>
        );
    }

    // Loading profile from server
    if (profile.user == null || profile.gettingProfile) {
        return (
            <div className="center">
                Loading...
            </div>
        );
    }

    // Already got profile from server
    return (
        <div className="ui grid center">
            <div className="column">
                <div className="row">
                    <img className="ui small img" alt={`${profile.user.firstname} ${profile.user.lastname}`} />
                </div>
                <div className="row">
                    {`${profile.user.firstname} ${profile.user.lastname} (${profile.user.username})`}
                </div>
                <div className="row">
                    {profile.user.isTrainer && (
                        <span>Registered Trainer</span>
                    )}
                    {!profile.user.isTrainer && (
                        <span>Not Trainer</span>
                    )}
                </div>
                <div className="row">
                    {`${profile.user.height} ${profile.user.weight}`}
                </div>
                <div className="row">
                    {profile.user.email}
                </div>
                <div className="row">
                    {profile.user.phone}
                </div>
                <div className="row">
                    {profile.user.location}
                </div>
                <div className="row">
                    <div
                        className="ui star rating"
                        interactive="false"
                        clearable="false"
                        data-rating={profile.user.rating}
                    />
                </div>
                {user != null && profile.user.trainers.includes(user.id) && (
                    <div className="row">
                        <Link to={{ pathname: "/calendar", state: { userId: profile.user.id } }}>Calendar</Link>
                    </div>
                )}
            </div>
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
