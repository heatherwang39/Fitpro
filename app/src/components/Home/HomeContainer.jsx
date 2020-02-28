import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import React from "react";
import { addClient, removeClient } from "../../actions/relationshipActions";
import NewsFeedContainer from "./NewsFeedContainer";
import "./HomeContainer.css";
import CalenderStripContainer from "./CalendarStripContainer";
import { User } from "../../types/user";

const _Home = (props) => {
    (() => {})(props); // Shut eslint up
    const { user } = props;
    return (
        <div className="home-container">
            {
                user != null && (
                    <CalenderStripContainer />
                )
            }
            <div style={{ width: "60%" }}>
                Placeholder
            </div>
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
