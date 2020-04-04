import { connect } from "react-redux";
import React from "react";
import { PropTypes } from "prop-types";
import useStateWithCallback from "use-state-with-callback";

import {
    Button, Checkbox, Container, Dropdown, Form, Grid,
} from "semantic-ui-react";
import { User } from "../../types/user";
import "./style.css";
import API from "../../api";
import { exercises as allExercises } from "../../api/Exercise_data";


const templateDropdownOptions = (templates) => {
    const options = [];
    for (let i = 0; i < templates.length; i++) {
        options.push({ key: i + 1, value: templates[i], text: templates[i].name });
    }
    return options;
};

const exerciseDropdownOptions = () => {
    const options = [];
    for (let i = 0; i < allExercises.length; i++) {
        options.push({ key: i + 1, value: allExercises[i], text: allExercises[i].title });
    }
    return options;
};

const emptyExerciseSelection = {
    exercise: "",
    days: {
        m: false, t: false, w: false, r: false, f: false, s: false, u: false,
    },
};

const clientOptions = () => ([
    { key: 1, value: "John Smith", text: "John Smith" },
    { key: 2, value: "Jackie Chan", text: "Jackie Chan" },
    { key: 3, value: "Randy Lahey", text: "Randy Lahey" },
    { key: 4, value: "Cory Trevor", text: "Cory Trevor" },
]);

const _MyTemplates = ({
    user,
}) => {
    const [selectedTemplate, setSelectedTemplate] = React.useState(null);
    const [selectedExercise, setSelectedExercise] = React.useState(emptyExerciseSelection);
    const [templates, setTemplates] = useStateWithCallback(null, (t) => {
        if (t == null) return;
        if (!templates.includes(selectedTemplate)) setSelectedTemplate(templates[0]);
    });

    const [fetching, setFetching] = React.useState(false);

    const deleteExercise = (id) => {
        selectedTemplate.exercises = selectedTemplate.exercises.filter((e) => e.exercise.id !== id);
        setSelectedTemplate({
            ...selectedTemplate,
            // refresh is a dummy attribute to force the component to rerender
            refresh: selectedTemplate.refresh === undefined ? 0 : selectedTemplate.refresh + 1,
        });
    };

    if (templates === null) {
        if (!fetching) {
            setFetching(true);
            API.getTemplates(user).then(
                (response) => {
                    if (!response.success) {
                        console.log("Error getting templates");
                        setTemplates([]);
                        return;
                    }
                    setFetching(false);
                    setTemplates(response.templates);
                },
            );
        }
        return (<div className="center">Loading</div>);
    }

    if (templates.length === 0) return (<h1 className="center">You have no templates</h1>);

    if (selectedTemplate === null) {
        setSelectedTemplate(templates[0]);
        return (<div className="center">Loading</div>);
    }

    const addExercise = () => {
        if (selectedExercise === "") return;
        const days = [];
        if (selectedExercise.days.m) days.push("Monday");
        if (selectedExercise.days.t) days.push("Tuesday");
        if (selectedExercise.days.w) days.push("Wednesday");
        if (selectedExercise.days.r) days.push("Thursday");
        if (selectedExercise.days.f) days.push("Friday");
        if (selectedExercise.days.s) days.push("Saturday");
        if (selectedExercise.days.u) days.push("Sunday");
        selectedTemplate.exercises.push(
            {
                exercise: selectedExercise.exercise,
                days,
            },
        );
        setSelectedTemplate({
            ...selectedTemplate,
            render: selectedTemplate.render === undefined ? 0 : selectedTemplate.render + 1,
        });
        setSelectedExercise(emptyExerciseSelection);
    };

    const addExerciseRow = () => (
        <Grid.Row id="new-exercise-row" centered>
            <Form>
                <Form.Group inline>
                    <Dropdown
                        id="exercise-dropdown"
                        selection
                        inline
                        options={exerciseDropdownOptions()}
                        value={selectedExercise.exercise}
                        onChange={(_, v) => setSelectedExercise({ ...selectedExercise, exercise: v.value })}
                    />
                    <Form.Field
                        control={Checkbox}
                        checked={selectedExercise.days.m}
                        label="M"
                        onChange={(_, v) => {
                            setSelectedExercise(
                                { ...selectedExercise, days: { ...selectedExercise.days, m: v.checked } },
                            );
                        }}
                    />
                    <Form.Field
                        control={Checkbox}
                        checked={selectedExercise.days.t}
                        label="T"
                        onChange={(_, v) => {
                            setSelectedExercise(
                                { ...selectedExercise, days: { ...selectedExercise.days, t: v.checked } },
                            );
                        }}
                    />
                    <Form.Field
                        control={Checkbox}
                        checked={selectedExercise.days.w}
                        label="W"
                        onChange={(_, v) => {
                            setSelectedExercise(
                                { ...selectedExercise, days: { ...selectedExercise.days, w: v.checked } },
                            );
                        }}
                    />
                    <Form.Field
                        control={Checkbox}
                        checked={selectedExercise.days.r}
                        label="R"
                        onChange={(_, v) => {
                            setSelectedExercise(
                                { ...selectedExercise, days: { ...selectedExercise.days, r: v.checked } },
                            );
                        }}
                    />
                    <Form.Field
                        control={Checkbox}
                        checked={selectedExercise.days.f}
                        label="F"
                        onChange={(_, v) => {
                            setSelectedExercise(
                                { ...selectedExercise, days: { ...selectedExercise.days, f: v.checked } },
                            );
                        }}
                    />
                    <Form.Field
                        control={Checkbox}
                        checked={selectedExercise.days.s}
                        label="S"
                        onChange={(_, v) => {
                            setSelectedExercise(
                                { ...selectedExercise, days: { ...selectedExercise.days, s: v.checked } },
                            );
                        }}
                    />
                    <Form.Field
                        control={Checkbox}
                        checked={selectedExercise.days.u}
                        label="U"
                        onChange={(_, v) => {
                            setSelectedExercise(
                                { ...selectedExercise, days: { ...selectedExercise.days, u: v.checked } },
                            );
                        }}
                    />
                    <Button positive onClick={addExercise}>Add Exercise</Button>
                </Form.Group>
            </Form>
        </Grid.Row>
    );

    return (
        <Container>
            <h1 id="template-name">{selectedTemplate.name}</h1>
            <div id="template-header">
                <div id="template-header-left">
                    <Dropdown
                        selection
                        inline
                        defaultValue={templates[0]}
                        options={templateDropdownOptions(templates)}
                        onChange={(_, v) => setSelectedTemplate(v.value)}
                    />
                    <Button
                        negative
                        onClick={() => setTemplates(templates.filter((t) => t.id !== selectedTemplate.id))}
                        id="delete-template-btn"
                    >
                        Delete
                    </Button>
                </div>
                <div id="template-header-right">
                    <Dropdown selection options={clientOptions(user)} defaultValue={clientOptions(user)[0].value} />
                    <Button id="assign-template-button">Assign</Button>
                </div>
            </div>
            <Grid columns={3} celled>
                <Grid.Row columns={3}>
                    <Grid.Column>
                        <h3>Exercise</h3>
                    </Grid.Column>
                    <Grid.Column>
                        <h3>Days</h3>
                    </Grid.Column>
                    <Grid.Column>
                        <h3>Manage</h3>
                    </Grid.Column>
                </Grid.Row>
                {
                    selectedTemplate.exercises.map(
                        (exercise) => (
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    {exercise.exercise.exerciseName === undefined
                                        ? exercise.exercise.title : exercise.exercise.exerciseName}
                                </Grid.Column>
                                <Grid.Column>{exercise.days.reduce((acc, v) => `${acc} ${v}`)}</Grid.Column>
                                <Grid.Column>
                                    <Button
                                        negative
                                        onClick={() => deleteExercise(exercise.exercise.id)}
                                    >
                                        Remove
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        ),
                    )
                }
                {addExerciseRow()}
            </Grid>
        </Container>
    );
};

const mapStateToProps = (state) => ({
    user: state.userReducer,
});

_MyTemplates.propTypes = {
    user: PropTypes.instanceOf(User).isRequired,
};


export const MyTemplates = connect(mapStateToProps)(_MyTemplates);

export default MyTemplates;
