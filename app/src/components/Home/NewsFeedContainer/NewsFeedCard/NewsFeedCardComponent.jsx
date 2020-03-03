import React from "react";
import { PropTypes } from "prop-types";
import styles from "./NewsFeedCard.module.css";

const NewsFeedCardComponent = (props) => {
    const { entry } = props;
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                { entry.title }
            </div>
            <div className={styles.tags}>
                # Chests
            </div>
            <div className={styles.author}>
                { `${entry.by}・` }
                <div className={styles.date}>
                    Feb 7th
                </div>
            </div>
        </div>
    );
};

NewsFeedCardComponent.propTypes = {
    entry: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default NewsFeedCardComponent;
