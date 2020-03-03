import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    useHistory,
} from "react-router-dom";
import ViewClientsComponent from "./ViewClientsComponent";
import { addClient } from "../../actions/relationshipActions";
import API from "../../api";

const ViewClientsContainer = (props) => {
    const { relationships, user } = props;
    const { clients } = relationships;
    const [filteredClients, updateFilteredClients] = useState([]);
    const history = useHistory();

    useEffect(() => {
        try {
            API.getRelationships(user).then((res) => {
                if (!res.success) return;
                props.addClient(res.clients);
                updateFilteredClients(res.clients);
            });
        } catch (e) {
            console.log(e);
        }
    }, []);

    const onChangeSearchValue = (e) => {
        const { value } = e.target;
        updateFilteredClients(clients.filter((client) => client.firstname.toLowerCase().includes(value)));
    };

    const onClickExpand = (userObject) => () => {
        history.push({
            pathname: "/client",
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
