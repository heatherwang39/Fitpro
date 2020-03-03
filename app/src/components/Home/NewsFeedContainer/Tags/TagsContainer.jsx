import React, { useState } from "react";
import { PropTypes } from "prop-types";
import TagsComponent from "./TagsComponent";

const TagsContainer = (props) => {
    const { tags, setTags, unSelectedTags } = props;

    return (
        <TagsComponent tags={tags} setTags={setTags} unSelectedTags={unSelectedTags} />
    );
};

TagsContainer.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    setTags: PropTypes.func.isRequired,
    unSelectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TagsContainer;
