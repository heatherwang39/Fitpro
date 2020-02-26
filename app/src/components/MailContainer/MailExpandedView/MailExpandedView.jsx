import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MailHeader from "./MailHeader";

const styles = {
    container: {
        borderLeftWidth: 2,
        borderLeftColor: "grey",
        width: "100%",
    },
    contentContainer: {
        width: "auto",
        marginTop: 20,
        paddingLeft: "72px",
        overflowY: "scroll",
    },
    titleContainer: {
        marginBottom: 10,
        marginTop: 0,
        padding: "20px 0px 8px 72px",
        fontWeight: 400,
        fontSize: "1.375rem",
    },
    authorContainer: {
        fontWeight: "bold",
        paddingLeft: "72px",
    },
    dateContainer: {
        float: "right",
        marginRight: 100,
    },
};

const MailExpandedView = (props) => {
    const {
        classes, title, from, content, date, deleteMail,
    } = props;

    const d = (new Date(date));
    const dateString = `${[d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()].join("/")} ${
        [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(":")}`;

    return (
        <div className={classes.container}>
            <MailHeader deleteMail={deleteMail} />
            <div className={classes.metaContainer}>
                <h2 className={classes.titleContainer}>
                    {title}
                </h2>
                <div>
                    <span className={classes.authorContainer}>{from}</span>
                    <span className={classes.dateContinear}>{dateString}</span>
                </div>
            </div>
            <div className={classes.contentContainer}>
                {content}
            </div>
        </div>
    );
};

MailExpandedView.propTypes = {
    title: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    deleteMail: PropTypes.func.isRequired,
};

export default withStyles(styles)(MailExpandedView);
