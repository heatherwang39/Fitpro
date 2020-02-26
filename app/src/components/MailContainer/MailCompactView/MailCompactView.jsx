import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const styles = {
    container: {
        backgroundColor: "white",
        width: "100%",
        height: "83px",
        "&:hover": {
            backgroundColor: "grey",
        },
    },
    buttonWrapper: {
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        border: "none",
        outline: 0,
        outlineStyle: "none",
        display: "flex",
        paddingLeft: 6,
        paddingRight: 10,
        justifyContent: "flex-start",
        flexWrap: "wrap",
        paddingTop: 3,
    },
    highlightedContainer: {
        backgroundColor: "rgb(199, 224, 244)",
        width: "100%",
        height: "83px",
    },
    from: {
        width: "100%",
        paddingLeft: "10px",
        textAlign: "left",
        overflow: "hidden",
    },
    title: {
        width: "80%",
        textAlign: "left",
        paddingLeft: "10px",
        overflow: "hidden",
    },
    date: {
        textAlign: "right",
        width: "15%",
        overflow: "hidden",
    },
    content: {
        paddingLeft: "10px",
        overflow: "hidden",
    },
};

const MailCompactView = (props) => {
    const {
        classes, title, from, content, date, onClick, isHighlighted, isPlaceholder,
    } = props;

    const d = (new Date(date));
    const dateString = `${[d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()].join("/")}`;
    return isPlaceholder ? (
        <div>
            No data
        </div>
    ) : (
        <div className={isHighlighted ? classes.highlightedContainer : classes.container}>
            <button type="button" className={classes.buttonWrapper} onClick={onClick}>
                <div className={classes.from}>
                    {from}
                </div>
                <div className={classes.title}>
                    {title}
                </div>
                <div className={classes.date}>
                    {dateString}
                </div>
                <div className={classes.content}>
                    {content}
                </div>
            </button>
        </div>
    );
};

MailCompactView.propTypes = {
    title: PropTypes.string,
    from: PropTypes.string,
    content: PropTypes.string,
    date: PropTypes.number,
    onClick: PropTypes.func,
    isHighlighted: PropTypes.bool,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    isPlaceholder: PropTypes.bool.isRequired,
};

MailCompactView.defaultProps = {
    title: "",
    from: "",
    content: "",
    date: Date.now(),
    onClick: () => {},
    isHighlighted: false,
};

export default withStyles(styles)(MailCompactView);
