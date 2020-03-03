import React from "react";
import PropTypes from "prop-types";
import styles from "./NewsFeedComponent.module.css";
import NewsFeedCardContainer from "./NewsFeedCard";

const NewsFeedComponent = (props) => {
    const { feed, tagsComponent, showNav } = props;
    return (
        feed && (
            <div className={styles.container}>
                {tagsComponent}
                <div className={styles.feedContainer}>
                    {
                        feed.map((entry) => (
                            <NewsFeedCardContainer key={feed.indexOf(entry)} entry={entry} />
                        ))
                    }
                </div>
                {showNav && (
                    <button
                        className={styles.navButton}
                        type="button"
                        onClick={() => { window.scroll({ top: 0, left: 0, behavior: "smooth" }); }}
                    >
                        Go up
                    </button>
                )}
            </div>
        )
    );
};

NewsFeedComponent.propTypes = {
    feed: PropTypes.arrayOf(PropTypes.object),
    tagsComponent: PropTypes.objectOf(PropTypes.any).isRequired,
    showNav: PropTypes.bool.isRequired,
};

NewsFeedComponent.defaultProps = {
    feed: null,
};

export default NewsFeedComponent;
