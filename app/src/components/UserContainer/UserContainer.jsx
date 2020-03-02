import React, { useState } from "react";
import { PropTypes } from "prop-types";
import {
    useHistory,
} from "react-router-dom";
import UserComponent from "./UserComponent";
import useScrollOffset from "../../hooks/useScrollOffset";

const UserContainer = (props) => {
    const { location } = props;
    const { user } = location.state;
    const [shouldShowBanner, setShouldShowBanner] = useState(false);
    const history = useHistory();
    useScrollOffset(({ currPos }) => {
        if (currPos.y < -100) {
            setShouldShowBanner(true);
        } else {
            setShouldShowBanner(false);
        }
    });

    const onClickCalendar = (userObject) => () => {
        history.push({
            pathname: "/calendar",
            state: { userId: userObject.id },
        });
    };

    return (
        <UserComponent
            user={user}
            shouldShowBanner={shouldShowBanner}
            onClickCalendar={onClickCalendar(user)}
        />
    );
};

UserContainer.propTypes = {
    location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default UserContainer;
