import React, { useState, useEffect } from "react";
import NewsFeedComponent from "./NewsFeedComponent";

const NewsFeedContainer = () => {
    const [newsFeed, setNewsFeed] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            setNewsFeed([{ by: "tom", content: "News feed part 1" }]);
        };

        fetchData();
    }, [setNewsFeed]);
    return (
        <NewsFeedComponent feed={newsFeed} />
    );
};

export default NewsFeedContainer;
