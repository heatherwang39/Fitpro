import React from "react";

const Filter = () => {
    return (
        <div className="ui vertical menu">
            <div className="item">
                <div className="ui input"><input type="text" placeholder="Enter Locations"/></div>
            </div>
            <div className="header item">Filtered By</div>
            <div className="ui right simple dropdown item">
                <i className="dropdown icon" />
                Price
                <div className="menu">
                    <a className="item" href="index.html">0~20</a>
                    <a className="item" href="index.html">20~40</a>
                    <a className="item" href="index.html">40+</a>
                </div>
            </div>
            <div className="ui right simple dropdown item">
                <i className="dropdown icon" />
                Gender
                <div className="menu">
                    <a className="item"><i className="male icon" /> 
                        Male
                    </a>
                    <a className="item"><i className="female icon" />
                        Female
                    </a>
                </div>
            </div>
            <div className="ui right simple dropdown item">
                <i className="dropdown icon" />
                Rating
                <div className="menu">
                    <a className="item"><i className="star icon"/>
                        4.0~5.0
                    </a>
                    <a className="item"><i className="star icon" />
                        3.0~4.0
                    </a>
                    <a className="item"><i className="star icon"/>
                        2.0~3.0
                    </a>
                </div>
            </div>
        </div>
    )
};


export default Filter;