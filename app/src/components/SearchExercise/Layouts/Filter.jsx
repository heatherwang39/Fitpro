import React from "react";
import { Paper, Tabs, Tab } from "@material-ui/core";
import PropTypes from "prop-types";


const Filter = ({ muscles, category, onSelect }) => {
    const index = category ? muscles.findIndex((group) => group === category) + 1
        : 0;

    const onIndexSelect = (e, i) => {
        onSelect(i === 0 ? "" : muscles[i - 1]);
    };

    return (
        <Paper>
            <Tabs
                value={index}
                onChange={onIndexSelect}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label="All" />
                {muscles.map((group) => <Tab key={group} label={group} />)}
            </Tabs>
        </Paper>
    );
};

export default Filter;
// const Filter=()=>{
//     return (
//             <div className="ui vertical menu">
//                 <div className="item">
//                     <div className="ui input"><input type="text" placeholder="Enter Locations"/></div>
//                 </div>
//                 <div className="header item">Filtered By</div>
//                 <div className="ui right simple dropdown item">
//                     <i className="dropdown icon"></i>Exercise Level
//                     <div className="menu">
//                     <a className="item">Beginner</a>
//                     <a className="item">Mediate</a>
//                     <a className="item">Hard</a>
//                     </div>
//                 </div>
//                 <div className="ui right simple dropdown item">
//                     <i className="dropdown icon"></i>Body Parts
//                     <div className="menu">
//                     <a className="item">Chest</a>
//                     <a className="item">Back</a>
//                     <a className="item">Legs</a>
//                     <a className="item">Shoulders</a>
//                     </div>
//                 </div>
//             </div>
//     )
// };


// export default Filter;
