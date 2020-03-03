import React from "react";
import { PropTypes } from "prop-types";
import Img from "react-image";
import { Button } from "semantic-ui-react";
import styles from "./UserComponent.module.css";
import defaultImage from "../../../static/images/defaultProfile.png";

const UserComponent = (props) => {
    const { user, shouldShowBanner, onClickCalendar } = props;
    return (
        <div className={styles.container}>
            {
                shouldShowBanner && (
                    <div
                        className={styles.userBannerContainer}
                    >
                        <Img src={[defaultImage]} className={styles.userBannerImage} />
                        <span>{`${user.firstname} ${user.lastname}`}</span>
                    </div>
                )
            }
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <Img src={[defaultImage]} className={styles.userBannerImage} />
                </div>
                <div className={styles.cardInformation}>
                    <h1>{`${user.firstname} ${user.lastname}`}</h1>
                    <h2>{user.email}</h2>
                    <h2>{user.phone}</h2>
                </div>
                <div className={styles.cardControls}>
                    <Button fluid onClick={onClickCalendar}>
                        Calendar
                    </Button>
                </div>
            </div>
            <div className={[styles.card, styles.infoCard].join(" ")}>
                <div>
                    {`Height: ${user.height}`}
                </div>
                <div>
                    {`Weight: ${user.weight}`}
                </div>
                <div>
                    {`Goal Type: ${user.goalType}`}
                </div>
            </div>
        </div>
    );
};

UserComponent.propTypes = {
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    shouldShowBanner: PropTypes.bool.isRequired,
    onClickCalendar: PropTypes.func.isRequired,
};

export default UserComponent;
