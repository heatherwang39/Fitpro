import { connect } from "react-redux";
import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { PropTypes } from "prop-types";
import {
    Button, Grid, MenuItem, Modal, Paper, Select, TextField, Typography,
} from "@material-ui/core";
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Delete } from "@material-ui/icons";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
    getTrainerCalendars as getTrainerCalendarsAction,
    getUserCalendar as getUserCalendarAction,
    gotTrainerCalendars as gotTrainerCalendarsAction,
    gotUserCalendar as gotUserCalendarAction,
    addUserCalendarEvent as addUserCalendarEventAction,
    rmUserCalendarEvent as rmUserCalendarEventAction,
    updatedUserCalendar as updatedUserCalendarAction,
} from "../../actions/calendarActions";
import { User } from "../../types/user";
import { Calendar as CalendarType } from "../../types/calendar";
import API from "../../api";
import "./style.css";

const localizer = momentLocalizer(moment);

const _Calendar = ({
    calendar, user,
    getTrainerCalendars, gotTrainerCalendars, getUserCalendar, gotUserCalendar,
    addUserCalendarEvent, rmUserCalendarEvent, updatedUserCalendar,
}) => {
    if (user == null) {
        return (<div className="center">Log in to view your calendar</div>);
    }

    // Load Calendar from server
    if (calendar.userCalendar == null) {
        if (!calendar.gettingCalendar) {
            if (user.isTrainer) {
                getTrainerCalendars(user.id);
                API.getTrainerCalendars(user.id).then((response) => {
                    // TODO handle failure
                    if (!response.success) {
                        console.log("ERROR");
                    }
                    gotTrainerCalendars(response);
                });
            } else {
                getUserCalendar(user.id);
                API.getUserCalendar(user.id).then((response) => {
                    // TODO handle failure
                    gotUserCalendar(response);
                });
            }
        }
        return (<div className="center">Loading</div>);
    }

    // Local state
    const [currentEvent, setCurrentEvent] = React.useState(null);
    const [addOpen, setAddOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [selectedClient, setSelectedClient] = React.useState(user.id);
    const [visibleEvents, setVisibleEvents] = React.useState(calendar.userCalendar.events);
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
        API.addUserCalendarEvent(user.id, newEvent).then(
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

    const selectClient = (id) => {
        setSelectedClient(id);
        for (let i = 0; i < calendar.clientCalendars.length; i++) {
            if (calendar.clientCalendars[i].id === id) {
                setVisibleEvents(calendar.clientCalendars[i].calendar.events);
                return;
            }
        }
        console.log(`No client calendar exists for id ${id}`);
    };

    return (
        <div className="page">
            <h4 className="center">Click an event for more info or click a blank day to add an event</h4>
            {
                // Dropdown for which client to manage
                user.isTrainer
                && (
                    <div className="user-selection">
                        <Select
                            value={selectedClient}
                            onChange={(event) => selectClient(event.target.value)}
                            label="User"
                        >
                            <MenuItem value={user.id} key={user.id}>
                                Me
                            </MenuItem>
                            {
                                calendar.clientCalendars.map(
                                    (x) => (<MenuItem value={x.id} key={x.id}>{x.firstname}</MenuItem>),
                                )
                            }
                        </Select>
                    </div>
                )
            }
            <div className="calendar-container">
                <BigCalendar
                    localizer={localizer}
                    events={visibleEvents}
                    selectable
                    onSelectSlot={toggleAddOpen}
                    onSelectEvent={toggleEditOpen}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                />
            </div>
            <div className="event-modal-container">
                {addOpen ? addModal() : (editOpen ? editModal() : null)}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    calendar: state.calendarReducer,
    user: state.userReducer,
});

const mapDispatchToProps = (dispatch) => ({
    getTrainerCalendars: (id) => dispatch(getTrainerCalendarsAction(id)),
    getUserCalendar: (id) => dispatch(getUserCalendarAction(id)),
    gotTrainerCalendars: (id) => dispatch(gotTrainerCalendarsAction(id)),
    gotUserCalendar: (calendar) => dispatch(gotUserCalendarAction(calendar)),
    updatedUserCalendar: (event) => dispatch(updatedUserCalendarAction(event)),
    addUserCalendarEvent: (event) => dispatch(addUserCalendarEventAction(event)),
    rmUserCalendarEvent: (event) => dispatch(rmUserCalendarEventAction(event)),
});

_Calendar.propTypes = {
    calendar: PropTypes.shape(
        {
            userCalendar: PropTypes.instanceOf(CalendarType),
            gettingCalendar: PropTypes.bool,
            clientCalendars: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.number,
                    firstname: PropTypes.string,
                    lastname: PropTypes.string,
                    calendar: PropTypes.instanceOf(CalendarType),
                }),
            ),
        },
    ).isRequired,
    user: PropTypes.instanceOf(User),
    getTrainerCalendars: PropTypes.func.isRequired,
    gotTrainerCalendars: PropTypes.func.isRequired,
    getUserCalendar: PropTypes.func.isRequired,
    gotUserCalendar: PropTypes.func.isRequired,
    updatedUserCalendar: PropTypes.func.isRequired,
    addUserCalendarEvent: PropTypes.func.isRequired,
    rmUserCalendarEvent: PropTypes.func.isRequired,
};

_Calendar.defaultProps = {
    user: null,
};

export const Calendar = connect(mapStateToProps, mapDispatchToProps)(_Calendar);

export default Calendar;
