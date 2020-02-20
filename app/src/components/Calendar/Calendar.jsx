import { connect } from "react-redux";
import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { PropTypes } from "prop-types";
import {
    getUserCalendar as getUserCalendarAction,
    gotUserCalendar as gotUserCalendarAction,
} from "../../actions/calendarActions";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar as CalendarType } from "../../types/calendar";
import API from "../../api";

const localizer = momentLocalizer(moment);


const _Calendar = ({ getUserCalendar, gotUserCalendar, calendar }) => {
    if (calendar.calendar == null) {
        if (!calendar.gettingCalendar) {
            getUserCalendar(1);
            API.getUserCalendar(1).then((response) => {
            // TODO validate response
                gotUserCalendar(response);
            });
        }
        return (<div className="center">Loading</div>);
    }

    return (
        <div className="page">
            <BigCalendar
                localizer={localizer}
                events={calendar.calendar.events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    );
};

const mapStateToProps = (state) => ({
    calendar: state.calendarReducer,
});

const mapDispatchToProps = (dispatch) => ({
    getUserCalendar: (id) => dispatch(getUserCalendarAction(id)),
    gotUserCalendar: (calendar) => dispatch(gotUserCalendarAction(calendar)),
});

_Calendar.propTypes = {
    calendar: PropTypes.shape(
        { calendar: PropTypes.instanceOf(CalendarType), gettingCalendar: PropTypes.bool },
    ).isRequired,
    getUserCalendar: PropTypes.func.isRequired,
    gotUserCalendar: PropTypes.func.isRequired,
};


export const Calendar = connect(mapStateToProps, mapDispatchToProps)(_Calendar);

export default Calendar;
