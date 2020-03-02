import React from "react";
import faker from "faker";
// import API from "../../api";
import {
    trainerUser1, trainerUser2, trainerUser3, trainerUser4,
} from "../../api/test_data";

const trainerList = [
    trainerUser1, trainerUser2, trainerUser3, trainerUser4,
];

const ShowList=()=> {
    return (trainerList.map((trainer) => {
        return(
            <div key={trainer.firstname} className="item">
            <div className="ui small image">
                <img alt="fake_avatar" src={faker.image.avatar()} />
            </div>
            <div className="content">
                <a className="header">
                    Name:
                    {trainer.firstname}
                    {trainer.lastname}
                </a>
                <div className="meta">
                    <span>Price:</span>
                    $30 per hour
                </div>
                <div className="description">
                    <p>
                        Height:
                        {trainer.height}
                        Weight:
                        {trainer.weight}
                        <br />
                        Rating:
                        {trainer.rating}
                    </p>
                </div>
                <div className="extra">
                    <button
                        onClick={() => this.setState({ selectedTrainer: trainer })}
                        className="ui primary right floated button"
                    >
                        Select
                    </button>
                </div>
            </div>
        </div>);
    })
    );
}

export default ShowList;