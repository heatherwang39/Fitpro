import React from "react";
import { PropTypes } from "prop-types";
import styles from "./TagsComponent.module.css";


const TagsComponent = (props) => {
    const { tags, setTags, unSelectedTags } = props;
    return (
        <div className={styles.container}>
            <div className={styles.selectedContainer}>
                {tags.map((tag) => (
                    <button key={tag} onClick={setTags("remove", tag)} type="button">
                        {tag}
                    </button>
                ))}
            </div>
            <div className={styles.unSelectedContainer}>
                {unSelectedTags.map((tag) => (
                    <button key={tag} onClick={setTags("add", tag)} type="button">
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

TagsComponent.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    setTags: PropTypes.func.isRequired,
    unSelectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TagsComponent;
