import React from "react";
import "./ClientCardComponent.css";
import PropTypes from "prop-types";
import { Button, Icon } from "semantic-ui-react";
import Img from "react-image";
import defaultProfile from "../../../../static/images/defaultProfile.png";

const ClientCardComponent = (props) => {
    const {
        onClickExpand,
        onClickCalendar,
        user,
    } = props;
    const {
        firstname,
        lastname,
        goalType,
        location,
    } = user;
    return (
        <div className="client-card-container">
            <div className="client-card-body">
                <button
                    type="button"
                    className="client-card-calendar-button"
                    onClick={onClickCalendar}
                >
                    <Icon name="calendar plus" />
                </button>
                <Img className="client-card-image-container" src={[null, defaultProfile]} />
                <h1>
                    {`${firstname} ${lastname}`}
                </h1>
                <h2>
                    {`${goalType}`}
                </h2>
                <h2>
                    {location}
                </h2>
            </div>
            <div className="client-card-footer">
                <Button animated onClick={onClickExpand} fluid>
                    <Button.Content visible>View Full</Button.Content>
                    <Button.Content hidden>
                        <Icon name="arrow right" />
                    </Button.Content>
                </Button>
            </div>
        </div>
    );
};

ClientCardComponent.propTypes = {
    onClickExpand: PropTypes.func.isRequired,
    onClickCalendar: PropTypes.func.isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ClientCardComponent;
