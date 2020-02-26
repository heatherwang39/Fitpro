import React, { useState } from "react";
import PropTypes from "prop-types";
import "./CreateMailContainer.css";
import CreateMailComponent from "./CreateMailComponent";

const CreateMailContainer = (props) => {
    const { onSubmit, closeContainer } = props;
    const [mailContent, setMailContent] = useState({});
    const setContent = (input) => (e) => {
        setMailContent({
            ...mailContent,
            [input]: e.target.value,
        });
    };

    return (
        <CreateMailComponent
            onSubmit={onSubmit(mailContent)}
            closeContainer={closeContainer}
            setContent={setContent}
        />
    );
};

CreateMailContainer.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    closeContainer: PropTypes.func.isRequired,
};

export default CreateMailContainer;
