import { connect } from "react-redux";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";

import {
    Button, Checkbox, Container, Dropdown, Form, Grid, Label, Segment, Rail, List, Input, Image,
} from "semantic-ui-react";
import { User } from "../../types/user";
import "./style.css";
import API from "../../api";

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
                <List bulleted>
                    {
                        // Might have more than 3 exercises if another workout on this page has repeats
                        w.exercises.slice(0, 3).map(
                            (e) => (<List.Item key={e.exercise._id}>{e.exercise.name}</List.Item>),
                        )
                    }
                </List>
                {w.numExercises && w.numExercises > 3 && <Link to={`/workout/${w._id}`}>More...</Link>}
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

const WorkoutsComponent = ({
    user,
}) => {
    const [filters, setFilters] = React.useState({ myWorkouts: false, name: "" });
    const prevFilters = usePrevious(filters);
    const [loading, setLoading] = React.useState(false);
    const [workouts, setWorkouts] = React.useState(null);

    const gotWorkouts = (res) => {
        setWorkouts(res.status ? [] : res.docs);
        setLoading(false);
    };

    React.useEffect(() => {
        if (prevFilters !== filters && prevFilters !== undefined) {
            API.getWorkouts(filters).then(gotWorkouts);
        }
    }, [filters]);

    if (loading) return (<div>Loading</div>);

    if (!workouts || workouts.length === undefined) {
        if (!loading) {
            setLoading(true);
            API.getWorkouts(filters).then(gotWorkouts);
        }
        return (<div>Loading</div>);
    }

    return (
        <Grid columns={2} centered padded>
            <Grid.Column>
                <Grid.Row>
                    <Segment id="search-header">
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
                            </Form.Group>
                        </Form>
                    </Segment>
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

WorkoutsComponent.propTypes = {
    user: PropTypes.instanceOf(User).isRequired,
};


export const Workouts = connect(mapStateToProps)(WorkoutsComponent);

export default Workouts;
