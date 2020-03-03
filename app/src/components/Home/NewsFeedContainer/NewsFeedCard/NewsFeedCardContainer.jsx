import React from "react";
import { PropTypes } from "prop-types";
import NewsFeedComponent from "./NewsFeedCardComponent";

const NewsFeedCardContainer = (props) => {
    const { entry } = props;
    return (
        <NewsFeedComponent entry={entry} />
    );
};

NewsFeedCardContainer.propTypes = {
    entry: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default NewsFeedCardContainer;
