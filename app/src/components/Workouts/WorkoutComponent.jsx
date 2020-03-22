import React from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import {
    Button, Dropdown, Form, Input, Label, Modal, Checkbox, Grid, Segment, List, Container,
} from "semantic-ui-react";
import { User } from "../../types/user";
import API from "../../api/api";

const exerciseListItem = (e) => (
    <Segment key={e._id}>
        <Grid>
            <Grid.Column width={3}>
                <Grid.Row className="exercise-name">
                    <Link to={`/exercises/${e._id}`}>{e.exercise.name}</Link>
                </Grid.Row>
                <Grid.Row className="workout-description">
                    {e.exercise.description}
                </Grid.Row>
            </Grid.Column>
            <Grid.Column width={3}>
                <Grid.Row className="exercise-image-container">
                    <img src={e.exercise.images[0]} className="exercise-image" />
                </Grid.Row>
            </Grid.Column>
            <Grid.Column width={4}>
                {e.instructions}
            </Grid.Column>
        </Grid>
    </Segment>
);

const WorkoutComponent = ({
    user, match,
}) => {
    const [loading, setLoading] = React.useState(false);
    const [workout, setWorkout] = React.useState(null);

    const gotWorkout = (w) => {
        setWorkout(w);
        setLoading(false);
    };

    if (workout === null) {
        if (!loading) {
            setLoading(true);
            API.getWorkout(match.params.id).then(gotWorkout);
        }
        return (<div>Loading...</div>);
    }

    return (
        <Grid centered padded>
            <Grid.Column width={4} id="workout-info-container">
                <Segment>
                    <Grid.Row id="workout-name">
                        {workout.name}
                    </Grid.Row>
                    <Grid.Row id="workout-description">
                        {workout.description}
                    </Grid.Row>
                </Segment>
            </Grid.Column>
            <Grid.Column width={12}>
                <Segment.Group id="exercises-list-container">
                    {
                        workout.exercises.map(exerciseListItem)
                    }
                </Segment.Group>
            </Grid.Column>
        </Grid>
    );
};

WorkoutComponent.propTypes = {
    user: PropTypes.instanceOf(User),
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
};

WorkoutComponent.defaultProps = {
    user: null,
};

export default WorkoutComponent;
