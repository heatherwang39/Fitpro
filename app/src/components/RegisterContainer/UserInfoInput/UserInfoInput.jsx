import React from "react";
import {
    MenuItem, TextField, InputAdornment, withStyles,
} from "@material-ui/core";
import PropTypes from "prop-types";

const styles = {
    container: {
        backgroundColor: "white",
        height: 500,
        padding: 10,
    },
    input: {
        display: "block",
        marginBottom: 10,
    },
};

const UserInfoInput = (props) => {
    const {
        classes, register, onChange, userInfo,
    } = props;

    const updateUserInfo = (attribute) => (e) => {
        onChange({
            [attribute]: e.target.value,
        });
    };

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            register();
        }
    };

    return (
        <div className={classes.container}>
            <TextField
                className={classes.input}
                label="First Name"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
                autoFocus
                onChange={updateUserInfo("firstName")}
            />
            <TextField
                className={classes.input}
                label="Last Name"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
                onChange={updateUserInfo("lastName")}
            />
            <TextField
                className={classes.input}
                label="Email"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
                onChange={updateUserInfo("email")}
            />
            <TextField
                className={classes.input}
                label="Phone"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
                onChange={updateUserInfo("phone")}
            />
            <TextField
                className={classes.input}
                label="Height"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
                InputProps={{
                    startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                }}
                onChange={updateUserInfo("height")}
            />
            <TextField
                className={classes.input}
                label="Weight"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
                InputProps={{
                    startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                }}
                onChange={updateUserInfo("weight")}
            />
            <TextField
                className={classes.input}
                label="Goal type"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
                onChange={updateUserInfo("goalType")}
            />
            <TextField
                className={classes.input}
                label="Who are you?"
                variant="outlined"
                value={userInfo.accountType}
                onChange={updateUserInfo("accountType")}
                onKeyDown={onKeyDown}
                size="small"
                select
            >
                {["Trainer", "Client"].map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
};

UserInfoInput.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    register: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    userInfo: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(UserInfoInput);
