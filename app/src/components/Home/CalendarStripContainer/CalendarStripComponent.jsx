import React from "react";
import { PropTypes } from "prop-types";
import { Calendar as CalendarType } from "../../../types/calendar";
import CalendarStripDayComponent from "./CalendarStripCardComponent/CalendarStripCardComponent";
import "./CalendarStripComponent.css";

const CalendarStripComponent = (props) => {
    const { calendar } = props;
    if (calendar == null) {
        return (
            <div>
                waiting
            </div>
        );
    }
    return (
        <div className="calendar-strip-component">
            { Object.keys(calendar).map((day) => (
                <CalendarStripDayComponent events={calendar[day]} day={day} key={day} />
            )) }
        </div>
    );
};

CalendarStripComponent.propTypes = {
    calendar: PropTypes.shape(
        { userCalendar: PropTypes.instanceOf(CalendarType), gettingCalendar: PropTypes.bool },
    ),
};

CalendarStripComponent.defaultProps = {
    calendar: null,
};

export default CalendarStripComponent;
