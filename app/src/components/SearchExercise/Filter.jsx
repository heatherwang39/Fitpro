import React from 'react';

const Filter=()=>{
    return (
            <div className="ui vertical menu">
                <div className="item">
                    <div className="ui input"><input type="text" placeholder="Enter Locations"/></div>
                </div>
                <div className="header item">Filtered By</div>
                <div className="ui right simple dropdown item">
                    <i className="dropdown icon"></i>LEVEL
                    <div className="menu">
                    <a className="item">Beginner</a>
                    <a className="item">Mediate</a>
                    <a className="item">Hard</a>
                    </div>
                </div>
                <div className="ui right simple dropdown item">
                    <i className="dropdown icon"></i>PROGRAMS
                    <div className="menu">
                    <a className="item">Aqua</a>
                    <a className="item">Strength</a>
                    <a className="item">Dance</a>
                    <a className="item">Skating</a>
                    </div>
                </div>
            </div>
    )
};


export default Filter;