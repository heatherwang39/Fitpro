import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Card } from "semantic-ui-react";

const TrainerDetail = ({ selectedTrainer }) => {
    if (selectedTrainer == null) return (<div />);
    return (
        <Card>
            <Card.Content>
                <Card.Header>
                    {selectedTrainer.firstname}
                    {" "}
                    {selectedTrainer.lastname}
                </Card.Header>
                <Card.Meta>Contact Information</Card.Meta>
                <Card.Description>
                    Email:&nbsp;
                    {selectedTrainer.email}
                    <br />
                    Tel:&nbsp;
                    {selectedTrainer.phone}
                    <br />
                    Location:&nbsp;
                    {selectedTrainer.location}
                    <div className="profile-btn">
                        <Button color="black" as={Link} to={`/user/${selectedTrainer.id}`}>
                            Profile
                        </Button>
                    </div>
                </Card.Description>
            </Card.Content>
        </Card>
    );
};

TrainerDetail.propTypes = {
    selectedTrainer: PropTypes.shape({
        firstname: PropTypes.string,
        lastname: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        location: PropTypes.string,
        id: PropTypes.number,
    }),
};

TrainerDetail.defaultProps = {
    selectedTrainer: null,
};

export default TrainerDetail;
