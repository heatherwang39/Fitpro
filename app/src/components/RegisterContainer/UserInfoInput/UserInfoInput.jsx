import React, { useState } from "react";
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
    const { classes, onKeyDown } = props;

    const initialInfo = {
        goalType: 0,
        accountType: "client",
    };

    const [userInfo, setUserInfo] = useState(initialInfo);

    const updateUserInfo = (attribute) => (e) => {
        console.log(userInfo);
        setUserInfo({
            [attribute]: e.target.value,
        });
    };
    console.log(userInfo.accountType);
    return (
        <div className={classes.container}>
            <TextField
                className={classes.input}
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
                autoFocus
            />
            <TextField
                className={classes.input}
                id="outlined-basic"
                label="Last Name"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
            />
            <TextField
                className={classes.input}
                id="outlined-basic"
                label="Email"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
            />
            <TextField
                className={classes.input}
                id="outlined-basic"
                label="Phone"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
            />
            <TextField
                className={classes.input}
                id="outlined-basic"
                label="Height"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
                InputProps={{
                    startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                }}
            />
            <TextField
                className={classes.input}
                id="outlined-basic"
                label="Weight"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
                InputProps={{
                    startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                }}
            />
            <TextField
                className={classes.input}
                id="outlined-basic"
                label="Goal type"
                variant="outlined"
                onKeyDown={onKeyDown}
                size="small"
            />
            <TextField
                className={classes.input}
                id="outlined-basic"
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
    onKeyDown: PropTypes.func.isRequired,
};

export default withStyles(styles)(UserInfoInput);
