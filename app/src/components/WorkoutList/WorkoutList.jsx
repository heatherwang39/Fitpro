import { connect } from "react-redux";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import {
    Form, Grid, Segment, List,
} from "semantic-ui-react";
import { User } from "../../types/user";
import "./style.css";
import API from "../../api/api";

const workoutListItem = (w) => (
    <Segment key={w._id}>
        <Grid columns={2}>
            <Grid.Column>
                <Grid.Row className="workout-name">
                    <Link to={`/workout/${w._id}`}>{w.name}</Link>
                </Grid.Row>
                <Grid.Row className="workout-description">
                    {w.description}
                </Grid.Row>
            </Grid.Column>
            <Grid.Column>
                {w.exercises && w.numExercises
                    ? (
                        <List bulleted>
                            {
                                // Might have more than 3 exercises if another workout on this page has repeats
                                w.exercises.slice(0, 3).map(
                                    (e) => (e.exercise ? (<List.Item key={e.exercise._id}>{e.exercise.name}</List.Item>) : <span />),
                                )
                            }
                        </List>
                    ) : "No exercises"}
                {w.numExercises && w.numExercises > 3
                    ? (<Link to={`/workout/${w._id}`}>More...</Link>) : <span />}
            </Grid.Column>
        </Grid>
    </Segment>
);

const usePrevious = (v) => {
    const ref = React.useRef();
    useEffect(() => {
        ref.current = v;
    });
    return ref.current;
};

const WorkoutListComponent = ({
    user,
}) => {
    const [filters, setFilters] = React.useState({ myWorkouts: false, name: "" });
    const prevFilters = usePrevious(filters);
    const [loading, setLoading] = React.useState(false);
    const [workouts, setWorkouts] = React.useState(null);

    const gotWorkouts = (res) => {
        setWorkouts(res.status ? [] : res);
        setLoading(false);
    };

    React.useEffect(() => {
        if (prevFilters !== filters && prevFilters !== undefined) {
            API.getWorkouts(filters).then(gotWorkouts);
        }
    }, [filters]);

    if (loading) return (<Segment loading />);

    if (!workouts || workouts.length === undefined) {
        if (!loading) {
            setLoading(true);
            API.getWorkouts(filters).then(gotWorkouts);
        }
        return (<Segment loading />);
    }

    return (
        <Grid columns={2} centered padded>
            <Grid.Column>
                <Grid.Row>
                    <Grid container centered id="search-header">
                        <Segment>
                            <Form>
                                <Form.Group inline>
                                    <Form.Checkbox
                                        toggle
                                        label="My Workouts"
                                        disabled={!user}
                                        checked={filters.myWorkouts}
                                        onChange={(_, v) => {
                                            setFilters({ ...filters, myWorkouts: v.checked });
                                        }}
                                    />
                                    <Form.Input
                                        icon="search"
                                        placeholder="Search..."
                                        id="search-input"
                                        value={filters.name}
                                        onChange={(_, v) => setFilters({ ...filters, name: v.value })}
                                    />
                                    {user
                                    && (
                                        <Link to="/workout/new">
                                            <Form.Button icon="add" id="add-workout" />
                                        </Link>
                                    )}
                                </Form.Group>
                            </Form>
                        </Segment>
                    </Grid>
                </Grid.Row>
                <Grid.Row>
                    <Segment.Group>
                        {workouts.length === 0 && (
                            <Segment id="no-workouts-container">
                                No Workouts
                            </Segment>
                        )}
                        {
                            workouts.map(workoutListItem)
                        }
                    </Segment.Group>
                </Grid.Row>
            </Grid.Column>
        </Grid>
    );
};

const mapStateToProps = (state) => ({
    user: state.userReducer,
});

WorkoutListComponent.propTypes = {
    user: PropTypes.instanceOf(User),
};

WorkoutListComponent.defaultProps = {
    user: null,
};


export const WorkoutList = connect(mapStateToProps)(WorkoutListComponent);

export default WorkoutList;
