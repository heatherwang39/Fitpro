import React from "react";
import "./NewsFeedComponent.css";
import PropTypes from "prop-types";

const NewsFeedComponent = (props) => {
    const { feed } = props;
    return (
        feed && (
            <div className="newsfeed-container">
                {
                    feed.map((entry) => (
                        <div key={entry}>
                            Placeholder timeline
                        </div>
                    ))
                }
            </div>
        )
    );
};

NewsFeedComponent.propTypes = {
    feed: PropTypes.arrayOf(PropTypes.object),
};

NewsFeedComponent.defaultProps = {
    feed: null,
};

export default NewsFeedComponent;
