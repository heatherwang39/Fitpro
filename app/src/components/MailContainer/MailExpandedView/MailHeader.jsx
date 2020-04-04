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
    const { classes } = props;
    return (
        <div className={classes.container}>
        </div>
    );
};

MailExpandedView.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(MailExpandedView);
