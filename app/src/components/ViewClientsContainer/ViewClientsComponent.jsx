import React from "react";
import "./ViewClientsComponent.css";
import PropTypes from "prop-types";
import { Input } from "semantic-ui-react";
import ClientCardComponent from "./ClientCardComponent";


const ViewClientsComponent = (props) => {
    const {
        clients,
        onChangeSearchValue,
        onClickExpand,
        onClickCalendar,
    } = props;
    return (
        <div className="view-clients-container">
            <div className="clients-search-bar">
                <Input placeholder="Search..." onChange={onChangeSearchValue} />
            </div>
            {clients.map((client) => (
                <ClientCardComponent
                    user={client}
                    key={client.firstname + client.lastname}
                    onClickExpand={onClickExpand(client)}
                    onClickCalendar={onClickCalendar(client)}
                />
            ))}
        </div>
    );
};

ViewClientsComponent.propTypes = {
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChangeSearchValue: PropTypes.func.isRequired,
    onClickExpand: PropTypes.func.isRequired,
    onClickCalendar: PropTypes.func.isRequired,
};

export default ViewClientsComponent;
