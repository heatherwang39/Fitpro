import React from "react";
import { PropTypes } from "prop-types";
import TrainerSearchComponent from "./TrainerSearchComponent";

const TrainerSearchContainer = (props) => {
    const { isAuth } = props;
    return (
        <TrainerSearchComponent isAuth={isAuth} />
    );
};

TrainerSearchContainer.propTypes = {
    isAuth: PropTypes.bool.isRequired,
};

export default TrainerSearchContainer;
