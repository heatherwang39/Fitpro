import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import CalendarStripComponent from "./CalendarStripComponent";
import {
    getUserCalendar as getUserCalendarAction,
    gotUserCalendar as gotUserCalendarAction,
} from "../../../actions/calendarActions";
import { CalendarEvent, User } from "../../../types";
import API from "../../../api/api";

const CalendarStripContainer = ({
    user, calendar, getUserCalendar, gotUserCalendar,
}) => {
    const calUserId = user.id;
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [gotEvents, setGotEvents] = useState(false);

    const formatEventsListToObject = (events) => {
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate((new Date()).getDate() + 7);
        const eventsList = events.filter((event) => {
            const { start } = event;
            const newDate = start.toLocaleDateString();
            if (start.getTime() > oneWeekFromNow.getTime() || start.getTime() < (new Date()).getTime()) return false;
            // Remove the following line if you want events that occur for the next week
            // return (new Date(newDate)).getDate() === (new Date()).getDate();
            return true; // Events for next week, uncomment line above for only today
        });
        return eventsList;
    };

    useEffect(() => {
        if (calendar.gettingCalendar) return;
        if (calendar.myEvents === null) {
            getUserCalendar(calUserId);
            API.getUserCalendar(user).then((response) => {
                if (!response.success) console.log("Error getting user calendar, got response ", response);
                // TODO handle failure
                gotUserCalendar(response.calendar);
                setGotEvents(true);
            });
        } else if (gotEvents) {
            let events = calendar.myEvents ? calendar.myEvents : [];
            events = events.concat(calendar.myClientEvents ? calendar.myClientEvents : []);
            setFilteredEvents(formatEventsListToObject(events));
            setGotEvents(false);
        }
    }, [calendar, gotEvents]);

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
        {
            myEvents: PropTypes.arrayOf(PropTypes.instanceOf(CalendarEvent)),
            gettingCalendar: PropTypes.bool,
            myClientEvents: PropTypes.arrayOf(PropTypes.instanceOf(CalendarEvent)),
        },
    ).isRequired,
    getUserCalendar: PropTypes.func.isRequired,
    gotUserCalendar: PropTypes.func.isRequired,
    user: PropTypes.instanceOf(User).isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(CalendarStripContainer);
