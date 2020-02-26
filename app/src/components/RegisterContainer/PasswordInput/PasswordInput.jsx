import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
    TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";

const styles = {
    PasswordInputContainer: {
        backgroundColor: "white",
        width: 750,
        height: 500,
    },
    PasswordInput: {
        width: 300,
        height: 20,
        marginTop: 100,
    },
    Header: {
        width: 300,
        margin: "30px 0 10px 0",
    },
};

const PasswordInput = (props) => {
    const { classes, onChange, onKeyDown } = props;
    return (
        <div className={classes.PasswordInputContainer}>
            <div className={classes.Header}> Choose a password </div>
            <TextField
                className={classes.PasswordInput}
                id="outlined-basic"
                label="Password"
                variant="outlined"
                type="password"
                onChange={onChange}
                onKeyDown={onKeyDown}
                autoFocus
            />
        </div>
    );
};

PasswordInput.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
};

export default withStyles(styles)(PasswordInput);
