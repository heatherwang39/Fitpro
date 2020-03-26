import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import {
    Button, Form, Grid, Segment, Image, Rating,
} from "semantic-ui-react";
import { User } from "../../types/user";
import API from "../../api";

const exerciseListItem = (e, editing, deleteExercise, deleted, undoDelete) => (deleted ? (
    <Segment key={e._id}>
        <Button fluid onClick={undoDelete}>Undo</Button>
    </Segment>
) : (
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
                    <Image src={e.exercise.images[0]} className="exercise-image" bordered />
                </Grid.Row>
            </Grid.Column>
            <Grid.Column width={4}>
                {e.instructions}
            </Grid.Column>
            {editing && (
                <Grid.Column as={Button} negative icon="delete" onClick={() => deleteExercise(e)} />
            )}
        </Grid>
    </Segment>
));

const workoutInfoFixed = (workout, showEditButton, setEditing) => (
    <Grid.Column width={4} id="workout-info-container">
        <Segment>
            <Grid.Row id="workout-name">
                {workout.name}
            </Grid.Row>
            <Grid.Row id="workout-description">
                {workout.description}
            </Grid.Row>
            <Grid.Row id="workout-rating">
                {workout.rating || workout.rating === 0 ? (
                    <Rating rating={workout.rating} maxRating={10} />
                ) : "No Ratings Yet"}
            </Grid.Row>
            <Grid.Row id="workout-level">
                {workout.level}
            </Grid.Row>
            {showEditButton && (
                <Grid.Row>
                    <Button onClick={() => setEditing(true)}>Edit</Button>
                </Grid.Row>
            )}
        </Segment>
    </Grid.Column>
);

const workoutInfoEditing = (workout, saveEdit, cancelEdit) => (
    <Grid.Column width={4} id="workout-info-container">
        <Segment>
            <Form onSubmit={saveEdit}>
                <Form.Input id="workout-name" defaultValue={workout.name} />
                <Form.Input id="workout-description" defaultValue={workout.description} />
                <Form.Group>
                    <Form.Button type="button" onClick={cancelEdit}>Cancel</Form.Button>
                    <Form.Button type="submit" positive>Save</Form.Button>
                </Form.Group>
            </Form>
        </Segment>
    </Grid.Column>
);

const _WorkoutComponent = ({
    user, match,
}) => {
    const [loading, setLoading] = React.useState(false);
    const [workout, setWorkout] = React.useState(null);
    const [editing, setEditing] = React.useState(false);
    const [toDelete, setToDelete] = React.useState({});

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

    const deleteExercise = (e) => {
        setToDelete({ ...toDelete, [e._id]: true });
    };

    const saveEdit = (ev) => {
        ev.preventDefault();
        setEditing(false);
        const newWorkout = {
            ...workout,
            name: ev.target[0].value,
            description: ev.target[1].value,
            exercises: workout.exercises.filter((e) => !toDelete[e._id]),
        };
        API.updateWorkout(newWorkout).then(() => {
            setToDelete({});
            setWorkout(newWorkout);
        });
    };
    const cancelEdit = () => {
        setToDelete({});
        setEditing(false);
    };
    return (
        <Grid centered padded>
            {editing
                ? workoutInfoEditing(workout, saveEdit, cancelEdit)
                : workoutInfoFixed(workout, user && workout.creator && user.id === workout.creator, setEditing)}
            <Grid.Column width={12}>
                <Segment.Group id="exercises-list-container">
                    {
                        workout.exercises.map(
                            (e) => exerciseListItem(
                                e,
                                editing,
                                () => deleteExercise(e),
                                toDelete[e._id],
                                () => setToDelete({ ...toDelete, [e._id]: false }),
                            ),
                        )
                    }
                </Segment.Group>
            </Grid.Column>
        </Grid>
    );
};

const mapStateToProps = (state) => ({
    user: state.userReducer,
});

_WorkoutComponent.propTypes = {
    user: PropTypes.instanceOf(User),
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
};

_WorkoutComponent.defaultProps = {
    user: null,
};

const WorkoutComponent = connect(mapStateToProps)(_WorkoutComponent);

export default WorkoutComponent;
