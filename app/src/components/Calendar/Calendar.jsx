import { connect } from "react-redux";
import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { PropTypes } from "prop-types";
import {
    Button, Grid, Modal, Paper, TextField, Typography,
} from "@material-ui/core";
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Delete } from "@material-ui/icons";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
    getUserCalendar as getUserCalendarAction,
    gotUserCalendar as gotUserCalendarAction,
    addUserCalendarEvent as addUserCalendarEventAction,
    rmUserCalendarEvent as rmUserCalendarEventAction,
    updatedUserCalendar as updatedUserCalendarAction,
} from "../../actions/calendarActions";
import { Calendar as CalendarType } from "../../types/calendar";
import API from "../../api";
import "./style.css";

const localizer = momentLocalizer(moment);

const _Calendar = ({
    calendar, getUserCalendar, gotUserCalendar, addUserCalendarEvent, rmUserCalendarEvent, updatedUserCalendar,
}) => {
    // TODO get user id instead of using constant 1
    const calUserId = 1;

    // Load Calendar from server
    if (calendar.calendar == null) {
        if (!calendar.gettingCalendar) {
            getUserCalendar(calUserId);
            API.getUserCalendar(calUserId).then((response) => {
                // TODO handle failure
                gotUserCalendar(response);
            });
        }
        return (<div className="center">Loading</div>);
    }

    // Local state
    const [currentEvent, setCurrentEvent] = React.useState(null);
    const [addOpen, setAddOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    // Properties of new event that is currently being added
    const [title, setTitle] = React.useState("");
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());

    // Toggles the Add Event modal
    const toggleAddOpen = (event) => {
        setCurrentEvent(event);
        setStartDate(event.start);
        // Populate end date selection with start date + 1 hour
        setEndDate(moment(event.start).add(1, "h"));
        setAddOpen(!addOpen);
    };

    // Toggles the Edit Event modal
    const toggleEditOpen = (event) => {
        setCurrentEvent(event);
        setEditOpen(!editOpen);
    };

    const createEvent = () => {
        // TODO validate title, startDate, endDate
        const newEvent = { title, start: startDate, end: endDate };
        addUserCalendarEvent(newEvent);
        API.addUserCalendarEvent(calUserId, newEvent).then(
            (response) => {
                // TODO handle failure
                updatedUserCalendar(response);
                setCurrentEvent(null);
                setAddOpen(false);
            },
        );
    };

    const deleteCurrentEvent = () => {
        // TODO validate currentEvent
        rmUserCalendarEvent(currentEvent);
        API.rmUserCalendarEvent(currentEvent).then(
            (response) => {
                // TODO handle failure
                updatedUserCalendar(response);
                setCurrentEvent(null);
                setEditOpen(false);
            },
        );
    };

    // Modal for adding a new event
    const addModal = () => (
        <Modal open={addOpen} onClose={() => setAddOpen(false)} className="event-modal">
            <Paper>
                <h2 className="event-modal-title"><Typography>Add</Typography></h2>
                <Paper>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
                        <Grid item>
                            <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
                        </Grid>
                        <Grid item>
                            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                                <KeyboardDateTimePicker
                                    disableToolbar
                                    format="DD-MM-YYYY hh:mm"
                                    label="Start"
                                    value={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    autoOk
                                />
                                <KeyboardDateTimePicker
                                    disableToolbar
                                    format="DD-MM-YYYY hh:mm"
                                    label="End"
                                    value={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    autoOk
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item>
                            <Button onClick={createEvent}>Create</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Paper>
        </Modal>
    );

    // Modal for editing existing event
    const editModal = () => (
        <Modal open={editOpen} onClose={() => setEditOpen(false)} className="event-modal">
            <Paper>
                <h2 className="event-modal-title"><Typography>Edit</Typography></h2>
                <Paper>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
                        <Grid item>
                            <Button onClick={deleteCurrentEvent}>
                                <Delete />
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Paper>
        </Modal>
    );

    return (
        <div className="page">
            <h4 className="center">Click an event for more info or click a blank day to add an event</h4>
            <BigCalendar
                localizer={localizer}
                events={calendar.calendar.events}
                selectable
                onSelectSlot={toggleAddOpen}
                onSelectEvent={toggleEditOpen}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
            <div className="event-modal-container">
                {addOpen ? addModal() : (editOpen ? editModal() : null)}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    calendar: state.calendarReducer,
});

const mapDispatchToProps = (dispatch) => ({
    getUserCalendar: (id) => dispatch(getUserCalendarAction(id)),
    gotUserCalendar: (calendar) => dispatch(gotUserCalendarAction(calendar)),
    updatedUserCalendar: (event) => dispatch(updatedUserCalendarAction(event)),
    addUserCalendarEvent: (event) => dispatch(addUserCalendarEventAction(event)),
    rmUserCalendarEvent: (event) => dispatch(rmUserCalendarEventAction(event)),
});

_Calendar.propTypes = {
    calendar: PropTypes.shape(
        { calendar: PropTypes.instanceOf(CalendarType), gettingCalendar: PropTypes.bool },
    ).isRequired,
    getUserCalendar: PropTypes.func.isRequired,
    gotUserCalendar: PropTypes.func.isRequired,
    updatedUserCalendar: PropTypes.func.isRequired,
    addUserCalendarEvent: PropTypes.func.isRequired,
    rmUserCalendarEvent: PropTypes.func.isRequired,
};

export const Calendar = connect(mapStateToProps, mapDispatchToProps)(_Calendar);

export default Calendar;
