import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import useStateWithCallback from "use-state-with-callback";
import {
    Button, Form, Grid, Modal, Segment, Image, Rating, Input,
} from "semantic-ui-react";
import { history } from "../../store/history";
import { User } from "../../types/user";
import API from "../../api/api";
import AddExerciseModal from "./AddExerciseModal";
import "./style.css";

const emptyWorkout = {
    name: "My Workout",
    description: "",
    exercises: [],
};

const truncatedDescription = (desc, maxLength) => (
    !desc || desc.length < (maxLength || 100)
        ? desc
        : `${desc.slice(0, maxLength || 100)}...`
);

const exerciseListItem = (e, editing, deleteExercise, deleted, undoDelete) => (deleted ? (
    <Segment key={e._id}>
        <Button fluid onClick={undoDelete}>Undo</Button>
    </Segment>
) : (
    <Segment key={e.exercise._id}>
        <Grid>
            <Grid.Column width={3}>
                <Grid.Row className="exercise-name">
                    <Link to={`/exercises/${e._id}`}>{e.exercise.name}</Link>
                </Grid.Row>
                <Grid.Row className="workout-description">
                    {truncatedDescription(e.exercise.description)}
                </Grid.Row>
            </Grid.Column>
            <Grid.Column width={3}>
                <Grid.Row className="exercise-image-container">
                    <Image src={e.exercise.images[0]} className="exercise-image" bordered />
                </Grid.Row>
            </Grid.Column>
            <Grid.Column width={4}>
                {editing ? (<Input onChange={(_, v) => (e.instructions = v.value)} />) : e.instructions}
            </Grid.Column>
            {editing && (
                <Grid.Column as={Button} negative icon="delete" onClick={() => deleteExercise(e)} />
            )}
        </Grid>
    </Segment>
));


const workoutInfoEditing = (workout, saveEdit, cancelEdit) => (
    <Grid.Column width={4} id="workout-info-container">
        <Segment>
            <Form onSubmit={saveEdit}>
                <Form.Input id="name" label="Name" defaultValue={workout.name} />
                <Form.Input id="description" label="Description" defaultValue={workout.description} />
                <Grid centered id="save-container">
                    <Form.Group>
                        <Form.Button type="button" onClick={cancelEdit}>Cancel</Form.Button>
                        <Form.Button type="submit" positive>Save</Form.Button>
                    </Form.Group>
                </Grid>
            </Form>
        </Segment>
    </Grid.Column>
);

const ratingContainer = (rating, removeRating, updateRating) => (
    <Grid.Row id="rating-container">
        <Button
            icon="thumbs up"
            active={rating === 10}
            onClick={() => (rating === 10 ? removeRating() : updateRating(10))}
        />
        <Button
            icon="thumbs down"
            active={rating === 0}
            onClick={() => (rating === 0 ? removeRating() : updateRating(0))}
        />
    </Grid.Row>
);

const WorkoutComponent = ({
    user, match,
}) => {
    const [loading, setLoading] = React.useState(false);
    const [workout, setWorkout] = React.useState(null);
    const [editing, setEditing] = React.useState(false);
    const [newExercises, setNewExercises] = React.useState({});
    const [toDelete, setToDelete] = React.useState({});
    const [addingExercise, setAddingExercise] = React.useState(false);
    const [rating, setRating] = React.useState(null);

    const isNew = match.params.id === "new";

    const gotWorkout = (w) => {
        setWorkout(w);
        setLoading(false);
        API.getRating({ workout: w._id }).then((r) => {
            if (r.rating) {
                setRating(r.rating);
            }
        });
    };

    if (workout === null) {
        if (isNew) {
            setEditing(true);
            setWorkout(emptyWorkout);
        } else if (!loading) {
            setLoading(true);
            API.getWorkout(match.params.id).then(gotWorkout);
        }
        return (<Segment loading />);
    }

    const updateRating = (newRating) => {
        API.setRating({ workout: workout._id, rating: newRating }).then((r) => {
            if (!r.success) {
                console.log("Error rating");
                return;
            }
            setRating(newRating);
        });
    };

    const removeRating = () => {
        API.removeRating({ workout: workout._id }).then((r) => {
            if (!r.success) {
                console.log("Error deleting rating");
                return;
            }
            setRating(null);
        });
    };

    const workoutInfoFixed = (showEditButton) => (
        <Grid.Column width={4} id="workout-info-container">
            <Grid.Row id="workout-name">
                {workout.name}
            </Grid.Row>
            <Grid.Row id="workout-description">
                {workout.description}
            </Grid.Row>
            <Grid.Row id="workout-rating">
                {workout.numRatings > 0 ? (
                    `${~~(workout.rating * 10 / workout.numRatings)}% liked (of ${workout.numRatings})`
                ) : "No Ratings Yet"}
            </Grid.Row>
            <Grid.Row id="workout-level">
                {workout.level}
            </Grid.Row>
            {!showEditButton && ratingContainer(rating, removeRating, updateRating)}
            {showEditButton && (
                <Grid.Row id="edit-btn-container">
                    <Button onClick={() => setEditing(true)} id="edit-btn">Edit</Button>
                </Grid.Row>
            )}
        </Grid.Column>
    );
    const deleteExercise = (e) => {
        setToDelete({ ...toDelete, [e._id]: true });
    };

    const saveEdit = (e) => {
        e.preventDefault();
        setEditing(false);
        const newWorkout = {
            ...workout,
            name: e.target.name.value,
            description: e.target.description.value,
            exercises: workout.exercises.filter((ex) => !toDelete[ex._id]),
        };

        const done = (res) => {
            if (!res.success) {
                console.log(`Error: ${res.toString()}`);
                return;
            }
            setToDelete({});
            setNewExercises({});
            setWorkout(res.workout);
            if (isNew) {
                location.href = `/workout/${res.workout._id}`;
            }
        };
        if (isNew) {
            API.createWorkout(newWorkout).then(done);
        } else {
            API.updateWorkout(newWorkout).then(done);
        }
    };

    const addExercise = (e) => {
        workout.exercises.push({ instructions: "", exercise: e });
        setNewExercises({ ...newExercises, [e._id]: true });
    };

    const cancelEdit = () => {
        if (match.params.id === "new") {
            history.goBack();
        }
        setToDelete({});
        setWorkout({ ...workout, exercises: workout.exercises.filter((e) => !newExercises[e.exercise._id]) });
        setNewExercises({});
        setEditing(false);
    };

    return (
        <div>
            <AddExerciseModal visible={addingExercise} setVisible={setAddingExercise} addExercise={addExercise} />
            <Grid centered padded>
                {editing
                    ? workoutInfoEditing(workout, saveEdit, cancelEdit)
                    : workoutInfoFixed(
                        user && (match.params.id === "new" || (workout.owner && user.id === workout.owner)),
                    )}
                <Grid.Column width={12}>
                    {(!workout.exercises || !workout.exercises.length)
                        ? (<Segment><Grid centered>No Exercises</Grid></Segment>)
                        : (
                            <Segment.Group id="exercises-list-container">
                                {(!workout.exercises || !workout.exercises.length) && (<Segment>No Exercises</Segment>)}
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
                        )}
                    {editing && (
                        <Button positive fluid onClick={() => setAddingExercise(true)}>Add Exercise</Button>)}
                </Grid.Column>
            </Grid>
        </div>
    );
};

const mapStateToProps = (state) => ({
    user: state.userReducer,
});

WorkoutComponent.propTypes = {
    user: PropTypes.instanceOf(User),
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
};

WorkoutComponent.defaultProps = {
    user: null,
};

export const Workout = connect(mapStateToProps)(WorkoutComponent);

export default Workout;
