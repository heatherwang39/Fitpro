import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MailHeader from "./MailHeader";
import { Button } from "@material-ui/core";
import API from "../../../api/api";
import { gotUserInfo } from "../../../actions/userActions";

const styles = {
    container: {
        borderLeft: "1px solid grey",
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
        marginRight: "20px"
    },
    dateContainer: {
        float: "right",
        marginRight: 100,
    },
    acceptRequestContainer: {
        marginTop: 15,
    }
};

const MailExpandedView = (props) => {
    let {
        classes, title, owner, content, sentDate, user, gotUserInfo
    } = props;

    const d = (new Date(sentDate));
    const dateString = `${[d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()].join("/")} ${
        [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(":")}`;
    if (!title) {
        return (
            <div className={classes.container}>
                Select an item to view
            </div>
        )
    }

    // If content has certain key words format it differently.
    let hasTrainingRequest = false;
    if (content.includes("TrainingRequest")) {
        content = content.replace("TrainingRequest", "")
        hasTrainingRequest = true;
    }
    return (
        <div className={classes.container}>
            <MailHeader />
            <div className={classes.metaContainer}>
                <h2 className={classes.titleContainer}>
                    {title}
                </h2>
                <div>
                    <span className={classes.authorContainer}>From: {owner.username}</span>
                    <span className={classes.dateContinear}>Sent: {dateString}</span>
                </div>
            </div>
            <div className={classes.contentContainer}>
                {content}
                {hasTrainingRequest && (
                    <div className={classes.acceptRequestContainer}>
                        <Button variant="contained" color="primary" size="large" onClick={async () => {
                            const res = await API.addClient(owner._id);
                            const userRes = await API.getUser(user.id);
                            if (userRes.success) gotUserInfo(userRes.user)
                        }}>
                            Accept
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    user: state.userReducer,
});

const mapDispatchToProps = (dispatch) => ({
    gotUserInfo: (userInfo) => dispatch(gotUserInfo(userInfo)),
});


MailExpandedView.propTypes = {
    title: PropTypes.string,
    owner: PropTypes.objectOf(PropTypes.any),
    content: PropTypes.string,
    sentDate: PropTypes.number,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MailExpandedView));
