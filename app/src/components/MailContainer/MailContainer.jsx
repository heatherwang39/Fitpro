import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";
import MailCompactView from "./MailCompactView";
import MailExpandedView from "./MailExpandedView";
import CreateMailContainer from "./CreateMailContainer";
import "./MailContainer.css";
import API from "../../api/api"

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
    _id: "",
    title: "",
    owner: {
        username: ""
    },
    content: "",
    date: Date.now(),
};

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
            const res = await API.getMail();
            setMail(res.mail);
        };
        
        fetchData();
    }, [setMail]);

    const toggleCreateMail = () => {
        setIsCreatingMail(true);
    };

    const sendMail = (mailContent) => () => {
        setIsCreatingMail(false);
        API.sendMail(mailContent);
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
                                isHighlighted={currentMail._id === m._id}
                                isPlaceholder={false}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <MailExpandedView
                title={currentMail.title}
                sentDate={currentMail.sentDate}
                content={currentMail.content}
                owner={currentMail.owner}
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
