import React from "react";
import PropTypes from "prop-types";
import "./CreateMailContainer.css";
import { Button, TextField } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SendIcon from "@material-ui/icons/Send";

// Pure javascript function to render component for creating mail.
const CreateMailContainer = (props) => {
    const { onSubmit, closeContainer, setContent } = props;

    return (
        <div className="create-mail-wrapper">
            <header>
                New mail
            </header>
            <div className="create-mail-body">
                <TextField
                    required
                    label="Receipient"
                    defaultValue=""
                    variant="standard"
                    fullWidth
                    onChange={setContent("receipient")}
                />
                <TextField
                    label="Title"
                    defaultValue=""
                    variant="standard"
                    fullWidth
                    onChange={setContent("title")}
                />
                <TextField
                    label=""
                    defaultValue=""
                    variant="standard"
                    multiline
                    rows="20"
                    fullWidth
                    onChange={setContent("body")}
                />
            </div>
            <div className="create-mail-footer">
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={closeContainer}
                >
                    Discard
                </Button>
                <Button variant="contained" onClick={onSubmit} endIcon={<SendIcon />}>
                    Send
                </Button>
            </div>
        </div>
    );
};

CreateMailContainer.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    closeContainer: PropTypes.func.isRequired,
    setContent: PropTypes.func.isRequired,
};

export default CreateMailContainer;
