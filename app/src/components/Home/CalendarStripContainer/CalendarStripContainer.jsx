import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import CalendarStripComponent from "./CalendarStripComponent";
import { Calendar as CalendarType } from "../../../types/calendar";
import {
    getUserCalendar as getUserCalendarAction,
    gotUserCalendar as gotUserCalendarAction,
} from "../../../actions/calendarActions";
import { User } from "../../../types";
import API from "../../../api";

const CalendarStripContainer = ({
    user, calendar, getUserCalendar, gotUserCalendar,
}) => {
    const calUserId = user.id;
    const [filteredEvents, setFilteredEvents] = useState([]);

    const formatEventsListToObject = (events) => {
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate((new Date()).getDate() + 7);
        const eventsList = events.filter((event) => {
            const { start } = event;
            const newDate = start.toLocaleDateString();
            if (start.getTime() > oneWeekFromNow.getTime() || start.getTime() < (new Date()).getTime()) return false;
            // Remove the following line if you want events that occur for the next week
            return (new Date(newDate)).getDate() === (new Date()).getDate();
        });
        return eventsList;
    };

    useEffect(() => {
        if (calendar.calendar != null) return;
        if (!calendar.gettingCalendar) {
            getUserCalendar(calUserId);
            API.getUserCalendar(calUserId).then((response) => {
                if (!response.success) console.log("Error getting user calendar, got response ", response);
                // TODO handle failure
                gotUserCalendar(response);
                setFilteredEvents(formatEventsListToObject(response.userCalendar.events));
            });
        }
    }, []);

    return (
        <CalendarStripComponent events={filteredEvents} />
    );
};

const mapStateToProps = (state) => ({
    calendar: state.calendarReducer,
    user: state.userReducer,
});

const mapDispatchToProps = (dispatch) => ({
    getUserCalendar: (id) => dispatch(getUserCalendarAction(id)),
    gotUserCalendar: (calendar) => dispatch(gotUserCalendarAction(calendar)),
});

CalendarStripContainer.propTypes = {
    calendar: PropTypes.shape(
        { calendar: PropTypes.instanceOf(CalendarType), gettingCalendar: PropTypes.bool },
    ).isRequired,
    getUserCalendar: PropTypes.func.isRequired,
    gotUserCalendar: PropTypes.func.isRequired,
    user: PropTypes.instanceOf(User).isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(CalendarStripContainer);
