import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import {
    Button, Form, Grid, Modal, Segment, Image, Rating, Input,
} from "semantic-ui-react";
import { User } from "../../types/user";
import API from "../../api/api";
import "./style.css";

const exerciseListItem = (e, addExercise) => (
    <Segment key={e._id}>
        <Grid centered>
            <Grid.Column width={5}>
                {e.name}
            </Grid.Column>
            <Grid.Column width={1}>
                <Button positive onClick={() => addExercise(e)}>+</Button>
            </Grid.Column>
        </Grid>
    </Segment>
);

const AddExerciseModal = ({ visible, setVisible, addExercise }) => {
    if (!visible) return <span />;

    // const [page, setPage] = React.useState(1);
    // const [morePages, setMorePages] = React.useState(false);
    const [searchResults, setSearchResults] = React.useState([]);

    const searchName = (n) => {
        // setPage(1);
        if (n.length < 1) return;
        API.searchExercises({ name: n }).then((response) => {
            if (!response.success || response.exercises.length === 0) {
                setSearchResults([]);
                return;
            }
            setSearchResults(response.exercises);
            // setPage(response.exercises.page);
            // setMorePages(response.exercises.totalPages > response.exercises.page);
        });
    };

    return (
        <Modal
            open={visible}
            onClose={() => setVisible(false)}
            closeIcon
        >
            <Modal.Header>Add Exercise</Modal.Header>
            <Modal.Content>
                <div className="center">
                    <Form>
                        <Input
                            id="exercise-name-search"
                            label="Name"
                            required
                            type="text"
                            onChange={(_, v) => searchName(v.value)}
                        />
                    </Form>
                    {searchResults.length === 0 ? "No Exercises"
                        : (
                            <Segment.Group id="exercise-results">
                                {searchResults.map((e) => exerciseListItem(e, addExercise))}
                                {/* morePages && (
                                    <Segment key="nextPage">
                                        <Button fluid>More</Button>
                                    </Segment>
                                ) */}
                            </Segment.Group>
                        )}
                </div>
            </Modal.Content>
        </Modal>
    );
};

AddExerciseModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    addExercise: PropTypes.func.isRequired,
};

export default AddExerciseModal;
