import React from "react";
import { Typography } from "@material-ui/core";
import { PropTypes } from "prop-types";
import "./CalendarStripComponent.css";


const CalendarStripComponent = (props) => {
    const { events } = props;
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" });

    const formatAMPM = (_date) => {
        let hours = _date.getHours();
        let minutes = _date.getMinutes();
        const ampm = hours >= 12 ? "pm" : "am";
        hours %= 12;
        hours = hours || 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        const strTime = `${hours}:${minutes} ${ampm}`;
        return strTime;
    };

    return (
        <div className="calendar-strip-component">
            <div className="calendar-card-container">
                <header>
                    TODAY
                </header>
                <div className="calendar-card-content">
                    <div className="calendar-card-info">
                        <div className="calendar-card-date">
                            <Typography variant="h3">
                                {date.getUTCDate()}
                            </Typography>
                            <Typography>
                                {month}
                            </Typography>
                        </div>
                    </div>
                    <div className="calendar-card-events-container">
                        <Typography variant="body2" color="textSecondary">
                            TO-DO
                        </Typography>
                        {events.map((event) => (
                            <div key={event.title} className="event-row">
                                <div className="bullet" />
                                <Typography variant="body2">
                                    {`${event.title}   ${formatAMPM(event.start)} to ${formatAMPM(event.end)}`}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

CalendarStripComponent.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object),
};

CalendarStripComponent.defaultProps = {
    events: [],
};

export default CalendarStripComponent;
