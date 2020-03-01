import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";
import MailCompactView from "./MailCompactView";
import MailExpandedView from "./MailExpandedView";
import CreateMailContainer from "./CreateMailContainer";
import "./MailContainer.css";

const _styles = {
    mailView: {
        backgroundColor: "red",
        width: "73%",
        height: "100%",
        overflowY: "scroll",
    },
    mailListView: {
        width: "27%",
        height: "100%",
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
    },
    liWrapper: {
        listStyleType: "none",
    },
    ul: {
        padding: 0,
        margin: 0,
    },
};


// Delete initialState and list of mail in phase 2
const initialState = {
    mailID: 1,
    title: "Reminder of our training sessions",
    from: "Josh A",
    content: "TEST CONTENT 1",
    date: Date.now(),
};

const listOfMail = [
    {
        mailID: 1,
        title: "Reminder of our training sessions",
        from: "Josh A",
        date: Date.now(),
        content: "TEST CONTENT 1",
    },
    {
        mailID: 2,
        title: "I have a special promotion for you",
        from: "Josh B",
        date: Date.now(),
        content: "TEST CONTENT 2",
    },
    {
        mailID: 3,
        title: "Do you want to set up an appointment for next week",
        from: "Josh C",
        date: Date.now(),
        content: "TEST CONTENT 3",
    },
    {
        mailID: 4,
        title: "I watched your workout videos and have some comments",
        from: "Josh D",
        date: Date.now(),
        content: "TEST CONTENT 4",
    },
];

const MailContainer = (props) => {
    const [currentMail, setCurrentMail] = useState(initialState);
    const [isCreatingMail, setIsCreatingMail] = useState(false);
    const [mail, setMail] = useState([]);
    const { classes } = props;
    const fetchMail = async (uid) => {
        if (uid) {
            return listOfMail;
        }
        return NaN;
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchMail(1);
            setMail(res);
        };

        fetchData();
    }, [setMail]);


    const deleteMail = (mailID) => () => {
        // call api to delete mail
        const newMailData = mail.filter((m) => m.mailID !== mailID);
        setCurrentMail(newMailData[0]);
        setMail(newMailData);
    };

    const toggleCreateMail = () => {
        setIsCreatingMail(true);
    };

    const sendMail = (mailContent) => () => {
        setIsCreatingMail(false);
        return mailContent;
    };

    return (
        <div className={classes.container}>
            <div className={classes.mailListView}>
                <div className="create-mail-button-wrapper">
                    <Button variant="contained" color="primary" size="large" onClick={toggleCreateMail}>
                        Create
                    </Button>
                </div>
                <ul className={classes.ul}>
                    {mail.map((m) => (
                        <li key={m.title + m.from} className={classes.liWrapper}>
                            <MailCompactView
                                onClick={() => setCurrentMail(m)}
                                title={m.title}
                                date={m.date}
                                content={m.content}
                                from={m.from}
                                isHighlighted={currentMail.mailID === m.mailID}
                                isPlaceholder={false}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <MailExpandedView
                title={currentMail.title}
                date={currentMail.date}
                content={currentMail.content}
                from={currentMail.from}
                deleteMail={deleteMail(currentMail.mailID)}
            />
            { isCreatingMail && (
                <CreateMailContainer onSubmit={sendMail} closeContainer={() => { setIsCreatingMail(false); }} />
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    user: state.userReducer,
});


const mapDispatchToProps = () => ({

});

MailContainer.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};


export default withStyles(_styles)(connect(mapStateToProps, mapDispatchToProps)(MailContainer));
