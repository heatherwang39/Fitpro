import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import React from "react";
import { addClient, removeClient } from "../../actions/relationshipActions";
import NewsFeedContainer from "./NewsFeedContainer";
import styles from "./HomeContainer.module.css";
import CalenderStripContainer from "./CalendarStripContainer";
import { User } from "../../types/user";
import TrainerSearchComponent from "./TrainerSearch/TrainerSearchComponent";

const _Home = (props) => {
    const { user } = props;
    return (
        <div className={styles.container}>
            {
                user != null && (
                    <CalenderStripContainer />
                )
            }
            <TrainerSearchComponent isAuth={user !== null} />
            <NewsFeedContainer />
        </div>
    );
};

_Home.propTypes = {
    user: PropTypes.instanceOf(User),
};

_Home.defaultProps = {
    user: null,
};

const mapStateToProps = (state) => ({
    r: state.relationshipReducer,
    user: state.userReducer,
});

const mapDispatchToProps = (dispatch) => ({
    addClient: (clientID) => dispatch(addClient(clientID)),
    removeClient: (clientID) => dispatch(removeClient(clientID)),
});

export const Home = connect(mapStateToProps, mapDispatchToProps)(_Home);

export default Home;
