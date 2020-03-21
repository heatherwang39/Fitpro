import { connect } from "react-redux";
import React from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";

import {
    Button, Checkbox, Container, Dropdown, Form, Grid, Label, Segment, Rail, List, Input,
} from "semantic-ui-react";
import { User } from "../../types/user";
import "./style.css";
import API from "../../api";

const testWorkouts = [
    {
        id: 1,
        name: "Workout 1",
        description: "Very nice workout",
        exercises: [
            {
                name: "Nice exercise",
            },
            {
                name: "Run",
            },
            {
                name: "Very good exercise",
            },
        ],
    },
    {
        id: 2,
        name: "Workout 2",
        description: "Very nice workout",
        exercises: [
            {
                name: "Nice exercise",
            },
            {
                name: "Run",
            },
            {
                name: "Very good exercise",
            },
        ],
    },
    {
        id: 3,
        name: "Workout 3",
        description: "Very nice workout",
        exercises: [
            {
                name: "Nice exercise",
            },
            {
                name: "Run",
            },
            {
                name: "Very good exercise",
            },
        ],
    },
];

const workoutListItem = (w) => (
    <Segment>
        <Grid columns={2}>
            <Grid.Column>
                <Grid.Row className="workout-name">
                    <Link to={`/workouts/${w.id}`}>{w.name}</Link>
                </Grid.Row>
                <Grid.Row classname="workout-description">
                    {w.description}
                </Grid.Row>
            </Grid.Column>
            <Grid.Column>
                <List bulleted>
                    {w.exercises.map((e) => (<List.Item>{e.name}</List.Item>))}
                </List>
            </Grid.Column>
        </Grid>
    </Segment>
);

const WorkoutsComponent = ({
    user,
}) => {
    const [filters, setFilters] = React.useState({});
    const [workouts, setWorkouts] = React.useState(testWorkouts);

    return (
        <Grid columns={2} centered padded>
            <Grid.Column>
                <Grid.Row>
                    <Segment id="search-header">
                        <Form>
                            <Form.Group inline>
                                <Form.Checkbox toggle label="My Workouts" />
                                <Form.Input icon="search" placeholder="Search..." id="search-input" />
                            </Form.Group>
                        </Form>
                    </Segment>
                </Grid.Row>
                <Grid.Row>
                    <Segment.Group>
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
