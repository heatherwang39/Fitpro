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
    const [filteredCalendar, setFilteredCalendar] = useState(null);

    const formatEventsListToObject = (events) => {
        const eventsObj = {};
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate((new Date()).getDate() + 7);
        events.forEach((event) => {
            const { start } = event;
            const month = start.getUTCMonth() + 1;
            const day = start.getUTCDate();
            const year = start.getUTCFullYear();

            const newDate = `${year}/${month}/${day}`;
            if (start.getTime() > oneWeekFromNow.getTime() || start.getTime() < (new Date()).getTime()) return;
            // Remove the following line if you want events that occur for the next week
            if (start.getDate() !== (new Date()).getDate()) return;
            if ((new Date(newDate)).getDate() !== (new Date()).getDate()) return;
            if (!(newDate in eventsObj)) eventsObj[newDate] = [];
            eventsObj[newDate].push(event);
        });
        return eventsObj;
    };

    useEffect(() => {
        if (calendar.calendar != null) return;
        if (!calendar.gettingCalendar) {
            getUserCalendar(calUserId);
            API.getUserCalendar(calUserId).then((response) => {
                console.log("response", response);
                // TODO handle failure
                gotUserCalendar(response);
                setFilteredCalendar(formatEventsListToObject(response.userCalendar.events));
            });
        }
    }, []);


    return (
        <CalendarStripComponent calendar={filteredCalendar} />
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