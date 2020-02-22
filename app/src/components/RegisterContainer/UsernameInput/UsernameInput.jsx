import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
    TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";

const styles = {
    UsernameInputContainer: {
        backgroundColor: "white",
        width: 750,
        height: 500,
    },
    UsernameInput: {
        width: 300,
        height: 20,
    },
};

const UsernameInput = (props) => {
    const { classes, onChange, onKeyDown } = props;
    return (
        <div className={classes.UsernameInputContainer}>
            <div> This is how other members will see you.</div>
            <TextField
                className={classes.UsernameInput}
                id="outlined-basic"
                label="Username"
                variant="outlined"
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
        </div>
    );
};

UsernameInput.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
};

export default withStyles(styles)(UsernameInput);
