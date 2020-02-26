import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const styles = {
    container: {
        width: "100%",
        height: 52,
        boxShadow: "inset 0 -1px 0 0 rgba(100,121,143,0.122)",
        padding: "13px 5px 13px 4px",
        boxSizing: "border-box",
    },
    button: {
        height: 26,
        marginRight: 5,
    },
};

const MailExpandedView = (props) => {
    const { classes, deleteMail } = props;
    return (
        <div className={classes.container}>
            <button className={classes.button} type="button" onClick={deleteMail}>
                Delete
            </button>
            <button className={classes.button} type="button">
                Reply
            </button>
        </div>
    );
};

MailExpandedView.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    deleteMail: PropTypes.func.isRequired,
};

export default withStyles(styles)(MailExpandedView);
