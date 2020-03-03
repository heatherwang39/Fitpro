import { connect } from "react-redux";
import React from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import useStateWithCallback from "use-state-with-callback";

import {
    Button, Container, Dropdown, Grid,
} from "semantic-ui-react";
import { User } from "../../types/user";
import "./style.css";
import API from "../../api";


const templateDropdownOptions = (templates) => {
    const options = [];
    for (let i = 0; i < templates.length; i++) {
        options.push({ key: i + 1, value: templates[i], text: templates[i].name });
    }
    return options;
};

const _MyTemplates = ({
    user,
}) => {
    const [selectedTemplate, setSelectedTemplate] = React.useState(null);
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

    const addExerciseRow = () => (<Grid.Row id="new-exercise-row" centered><Button>New</Button></Grid.Row>);

    return (
        <Container>
            <h1 id="template-name">{selectedTemplate.name}</h1>
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
                                <Grid.Column>{exercise.exercise.exerciseName}</Grid.Column>
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
