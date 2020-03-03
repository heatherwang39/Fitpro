import { connect } from "react-redux";
import React from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";

import {
    Button, Container, Grid, Input, Label, Rating, Segment,
} from "semantic-ui-react";
import { User } from "../../types/user";
import { gotUserInfo as gotUserInfoAction } from "../../actions/userActions";
import { testReviews, testOffers } from "../../api/test_data";
import API from "../../api";
import "./style.css";

const profileFormFields = ["firstname", "lastname", "phone", "email", "location", "height", "weight"];

// eslint-disable-next-line max-len
const defaultProfileImage = "data:image/png;base64,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";

const errorComponent = (errorMessage) => (
    <div>
        <Container textAlign="center">
            <h1>Error</h1>
            <p>{errorMessage}</p>
        </Container>
    </div>
);


const reviewsColumn = () => (
    <Grid.Column>
        <Container id="profile-reviews" divided>
            <h4 id="profile-reviews-header">Reviews</h4>
            {testReviews.map((review) => (
                <Segment className="profile-review">
                    <div className="review-body">
                        {review.review}
                        <br />
                        <Rating
                            className="review-rating"
                            disabled
                            icon="star"
                            maxRating={review.rating}
                            defaultRating={review.rating}
                        />
                    </div>
                    <div className="review-name">{`— ${review.name}`}</div>
                </Segment>
            ))}
        </Container>
    </Grid.Column>
);

const offersColumn = () => (
    <Grid.Column>
        <Container id="profile-offers" divided>
            <h4 id="profile-offers-header">Specials</h4>
            {testOffers.map((offer) => (
                <Segment className="profile-offer">
                    <div className="offer-title"><h5>{offer.title}</h5></div>
                    <div className="offer-body">{offer.details}</div>
                    <div className="offer-price">{offer.price}</div>
                </Segment>
            ))}
        </Container>
    </Grid.Column>

);

const _Profile = ({
    match, user, gotUserInfo,
}) => {
    const id = parseInt(match.params.id, 10);
    const [profile, setProfile] = React.useState(null);
    const [fetchingProfile, setFetchingProfile] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [editing, setEditing] = React.useState(false);
    const [uneditedProfile, setUneditedProfile] = React.useState(null);

    // Show error message
    if (error != null) return errorComponent(error);

    if (Number.isNaN(id)) {
        setError("Invalid user id");
        return errorComponent(error);
    }

    // Fetch profile
    if (profile == null) {
        if (!fetchingProfile) {
            API.getProfile(id).then(
                (response) => {
                    if (!response.success) {
                        const errorMessage = typeof response.error !== "undefined"
                            ? response.error : "Error loading profile";
                        setError(errorMessage);
                    }
                    setProfile(response.profile);
                    setUneditedProfile(response.profile);
                    setFetchingProfile(false);
                },
            );
        }
        if (error != null) return errorComponent();
        return errorComponent("Invalid user");
    }

    // Loading profile from server
    if (profile == null || fetchingProfile) {
        return (
            <div className="center">
                Loading...
            </div>
        );
    }

    const validProfileAttr = (attr) => {
        if (typeof profile[attr] === "undefined" || profile[attr].length === 0) return false;
        switch (attr) {
        case "phone":
            if (profile[attr].match(/\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})/) == null) return false;
            break;
        case "email":
            if (profile[attr].match(/[\w\-.]+@{1}([A-Za-z0-9-]+)+\.[A-Za-z]+/) == null) return false;
            break;
        case "height":
            if (profile[attr].match(/^[\d"' (cm)(ft)(in)m.]+$/m) === null) return false;
            break;
        case "weight":
            if (profile[attr].match(/^\d+\s?((lb)|(kg)|(pounds)|(kilos)|(kilograms)|(lbs))?$/m) === null) return false;
            break;
        // no default
        }
        return true;
    };

    const updateUserReducerWithProfile = (p) => {
        gotUserInfo(User.fromJSON({ ...user, ...p }));
    };

    const saveEdits = () => {
        for (let i = 0; i < profileFormFields.length; i++) {
            if (!validProfileAttr(profileFormFields[i])) return;
        }
        API.updateProfile(profile).then((response) => {
            if (!response.success) {
                // TODO show error to user
                console.log("Error updating profile, got response ", response);
            } else {
                setProfile(response.profile);
                updateUserReducerWithProfile(response.profile);
            }
            setEditing(false);
        });
    };

    const cancelEdits = () => {
        setProfile(uneditedProfile);
        setEditing(false);
    };

    // Got profile and currently editing
    if (editing) {
        return (
            <Container>
                <Grid className="profile-editing aligned" stackable>
                    <Grid.Column width={6} textAlign="center">
                        <Grid.Row>
                            {
                                // TODO allow editing profile picture
                            }
                            <img
                                alt={`${profile.firstname} ${profile.lastname}`}
                                src={typeof profile.imageUrl === "undefined" || profile.imageUrl == null
                                                                             || profile.imageUrl.length === 0
                                    ? defaultProfileImage : profile.imageUrl}
                                className="profile-avatar"
                            />
                        </Grid.Row>
                        {profile.id === user.id && (
                            <Grid.Row>
                                <Button onClick={cancelEdits} negative>Cancel</Button>
                                <Button onClick={saveEdits} positive>Save</Button>
                            </Grid.Row>
                        )}
                        <Grid.Row>
                            <Input
                                value={profile.firstname}
                                onChange={(_, v) => setProfile({ ...profile, firstname: v.value })}
                                error={!validProfileAttr("firstname")}
                                labelPosition="left"
                            >
                                <Label>First Name</Label>
                                <input />
                                {!validProfileAttr("firstname") && (
                                    <Label pointing="left">
                                        Invalid name
                                    </Label>
                                )}
                            </Input>
                            <Input
                                value={profile.lastname}
                                onChange={(_, v) => setProfile({ ...profile, lastname: v.value })}
                                error={!validProfileAttr("lastname")}
                                labelPosition="left"
                            >
                                <Label>Last Name</Label>
                                <input />
                                {!validProfileAttr("lastname") && (
                                    <Label pointing="left">
                                        Invalid name
                                    </Label>
                                )}
                            </Input>
                        </Grid.Row>
                        <Grid.Row>
                            <Input
                                value={profile.height}
                                onChange={(_, v) => setProfile({ ...profile, height: v.value })}
                                error={!validProfileAttr("lastname")}
                                labelPosition="left"
                            >
                                <Label>Height</Label>
                                <input />
                                {!validProfileAttr("height") && (
                                    <Label pointing="left">
                                        Invalid height
                                    </Label>
                                )}
                            </Input>
                            <Input
                                value={profile.weight}
                                onChange={(_, v) => setProfile({ ...profile, weight: v.value })}
                                error={!validProfileAttr("weight")}
                                labelPosition="left"
                            >
                                <Label>Height</Label>
                                <input />
                                {!validProfileAttr("weight") && (
                                    <Label pointing="left">
                                        Invalid weight
                                    </Label>
                                )}
                            </Input>
                        </Grid.Row>
                        <Grid.Row>
                            <Input
                                value={profile.email}
                                onChange={(_, v) => setProfile({ ...profile, email: v.value })}
                                error={!validProfileAttr("email")}
                                labelPosition="left"
                            >
                                <Label>Email</Label>
                                <input />
                                {!validProfileAttr("email") && (
                                    <Label pointing="left">
                                        Invalid email
                                    </Label>
                                )}
                            </Input>
                            <Input
                                value={profile.phone}
                                onChange={(_, v) => setProfile({ ...profile, phone: v.value })}
                                error={!validProfileAttr("phone")}
                                labelPosition="left"
                            >
                                <Label>Phone</Label>
                                <input />
                                {!validProfileAttr("phone") && (
                                    <Label pointing="left">
                                        Phone number must be a valid North American number
                                    </Label>
                                )}
                            </Input>
                        </Grid.Row>
                        <Grid.Row>
                            <Input
                                value={profile.location}
                                onChange={(_, v) => setProfile({ ...profile, location: v.value })}
                                error={!validProfileAttr("location")}
                                labelPosition="left"
                            >
                                <Label>Location</Label>
                                <input />
                                {!validProfileAttr("location") && (
                                    <Label pointing="left">
                                        Invalid location
                                    </Label>
                                )}
                            </Input>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }

    // Got profile and viewing
    return (
        <Container>
            <Grid className="profile" stackable>
                <Grid.Column width={8} textAlign="center">
                    <Grid.Row>
                        <img
                            alt={`${profile.firstname} ${profile.lastname}`}
                            // eslint-disable-next-line max-len
                            src={typeof profile.imageUrl === "undefined" || profile.imageUrl == null
                                || profile.imageUrl.length === 0
                                ? defaultProfileImage : profile.imageUrl}
                            className="profile-avatar"
                        />
                    </Grid.Row>
                    {profile.id === user.id && (
                        <Grid.Row>
                            <p><Button onClick={() => setEditing(true)}>Edit</Button></p>
                        </Grid.Row>
                    )}
                    <Grid.Row inline>
                        <p>{`${profile.firstname} ${profile.lastname}`}</p>
                    </Grid.Row>
                    {profile.isTrainer && (
                        <Grid.Row>
                            <p>Registered Trainer</p>
                        </Grid.Row>
                    )}
                    <Grid.Row>
                        <p>{`${profile.height} ${profile.weight}`}</p>
                    </Grid.Row>
                    <Grid.Row>
                        <p>{profile.email}</p>
                    </Grid.Row>
                    <Grid.Row>
                        <p>{profile.phone}</p>
                    </Grid.Row>
                    <Grid.Row>
                        <p>{profile.location}</p>
                    </Grid.Row>
                    <Grid.Row>
                        <Rating icon="star" disabled maxRating={profile.rating} defaultRating={profile.rating} />
                    </Grid.Row>
                    <Grid.Row>
                        {user != null && profile.trainers.includes(user.id) && (
                            <p>
                                <Link to={{ pathname: "/calendar", state: { userId: profile.id } }}>
                                    <Button>Calendar</Button>
                                </Link>
                            </p>
                        )}
                    </Grid.Row>
                </Grid.Column>
            </Grid>
            {user.isTrainer && (
                <Grid>
                    <Grid.Row columns={2}>
                        {offersColumn()}
                        {reviewsColumn()}
                    </Grid.Row>
                </Grid>
            )}
        </Container>
    );
};

const mapStateToProps = (state) => ({
    user: state.userReducer,
    profile: state.profileReducer,
});

const mapDispatchToProps = (dispatch) => ({
    gotUserInfo: (userInfo) => dispatch(gotUserInfoAction(userInfo)),
});

_Profile.propTypes = {
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
    user: PropTypes.instanceOf(User),
    gotUserInfo: PropTypes.func.isRequired,
};

_Profile.defaultProps = {
    user: null,
};

export const Profile = connect(mapStateToProps, mapDispatchToProps)(_Profile);

export default Profile;
