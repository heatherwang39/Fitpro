import React, { useState, useEffect } from "react";
import NewsFeedComponent from "./NewsFeedComponent";
import Tags from "./Tags";
import useScrollOffset from "../../../hooks/useScrollOffset";

const testData = [
    { by: "tom", content: "News feed part 1", title: "Title 1" },
    { by: "tom", content: "News feed part 2", title: "Title 2" },
    { by: "tom", content: "News feed part 3", title: "Title 3" },
    { by: "tom", content: "News feed part 4", title: "Title 4" },
    { by: "tom", content: "News feed part 4", title: "Title 5" },
    { by: "tom", content: "News feed part 4", title: "Check this out" },
    { by: "tom", content: "News feed part 4", title: "Check this out" },
    { by: "tom", content: "News feed part 4", title: "Check this out" },
    { by: "tom", content: "News feed part 4", title: "Check this out" },
    { by: "tom", content: "News feed part 4", title: "Check this out" },
    { by: "tom", content: "News feed part 4", title: "Check this out" },
];

const testTags = [
    "Chest",
];

const testOtherTags = [
    "Body",
    "Bodybuilding",
    "Weightlifting",
    "Biceps",
    "Bench Press",
    "Clothing",
    "Supplements",
    "Gym",
    "Workouts",
    "Legs",
];

const NewsFeedContainer = () => {

    const [newsFeed, setNewsFeed] = useState(null);
    const [tags, setTags] = useState([]);
    const [unSelectedTags, setUnSelectedTags] = useState([]);
    const [showNav, setShowNav] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setNewsFeed(testData);
        };

        fetchData();
        setTags(testTags);
        setUnSelectedTags(testOtherTags);
    }, [setNewsFeed]);

    useScrollOffset(({ currPos }) => {
        if (currPos.y < -500) {
            setShowNav(true);
        } else {
            setShowNav(false);
        }
    });

    const updateTags = (action, tag) => () => {
        switch (action) {
        case "remove":
            setTags(tags.filter((t) => t !== tag));
            setUnSelectedTags([...unSelectedTags, tag]);
            break;
        case "add":
            setTags([...tags, tag]);
            setUnSelectedTags(unSelectedTags.filter((t) => t !== tag));
            break;
        default:
            break;
        }
    };
    return (
        <NewsFeedComponent
            feed={newsFeed}
            tagsComponent={<Tags tags={tags} setTags={updateTags} unSelectedTags={unSelectedTags} />}
            showNav={showNav}
        />

    );
};

export default NewsFeedContainer;
