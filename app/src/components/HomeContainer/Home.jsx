import { connect } from "react-redux";
import React from "react";
import { addClient, removeClient } from "../../actions/relationshipActions";

const _Home = (props) => {
    // Delete this console.log, this is only to bypass eslint error
    console.log(props);
    return (
        <div className="center">
            Home
        </div>
    );
};

const mapStateToProps = (state) => ({
    r: state.relationshipReducer,
});

const mapDispatchToProps = (dispatch) => ({
    addClient: (clientID) => dispatch(addClient(clientID)),
    removeClient: (clientID) => dispatch(removeClient(clientID)),
});

export const Home = connect(mapStateToProps, mapDispatchToProps)(_Home);

export default Home;
