import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    useHistory,
} from "react-router-dom";
import ViewClientsComponent from "./ViewClientsComponent";
import { addClient } from "../../actions/relationshipActions";

const ViewClientsContainer = (props) => {
    const { relationships, user } = props;
    const { clients } = relationships;
    let users = user.clients
    const history = useHistory();
    if (history.location.pathname == '/my_trainers') {
        users = user.trainers
    }
    const [filteredClients, updateFilteredClients] = useState(users);
    
    const onChangeSearchValue = (e) => {
        const { value } = e.target;
        updateFilteredClients(clients.filter((client) => client.firstname.toLowerCase().includes(value)));
    };

    const onClickExpand = (userObject) => () => {
        console.log(userObject)
        history.push({
            pathname: `/user/${userObject._id}`,
            state: { user: userObject },
        });
    };

    const onClickCalendar = (userObject) => () => {
        history.push({
            pathname: "/calendar",
            state: { userId: userObject.id },
        });
    };
    return (
        <ViewClientsComponent
            clients={filteredClients}
            onChangeSearchValue={onChangeSearchValue}
            onClickExpand={onClickExpand}
            onClickCalendar={onClickCalendar}
        />
    );
};

const mapStateToProps = (state) => ({
    relationships: state.relationshipReducer,
    user: state.userReducer,
});

const mapDispatchToProps = (dispatch) => ({
    addClient: (clients) => dispatch(addClient(clients)),
});

ViewClientsContainer.propTypes = {
    addClient: PropTypes.func.isRequired,
    relationships: PropTypes.objectOf(PropTypes.array).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewClientsContainer);
