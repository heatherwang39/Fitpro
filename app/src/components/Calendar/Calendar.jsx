import { connect } from "react-redux";
import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { PropTypes } from "prop-types";
import {
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    Modal,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Delete } from "@material-ui/icons";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
    addCalendarEvent as addCalendarEventAction,
    getUserCalendar as getUserCalendarAction,
    gotUserCalendar as gotUserCalendarAction,
    rmCalendarEvent as rmCalendarEventAction,
    updatedCalendar as updatedCalendarAction,
} from "../../actions/calendarActions";
import { User } from "../../types/user";
import { Calendar as CalendarType } from "../../types/calendar";
import API from "../../api";
import "./style.css";

// These are used in reverse order (last element is used for first client)
const ALL_EVENT_COLOURS = [
    "lightgreen",
    "orange",
    "orangered",
    "violet",
    "green",
    "red",
    "purple",
    "blue",
];

const localizer = momentLocalizer(moment);

const combineClientEvents = (clientCalendars) => {
    const events = [];
    for (let i = 0; i < clientCalendars.length; i++) {
        for (let j = 0; j < clientCalendars[i].calendar.events.length; j++) {
            events.push({
                ...clientCalendars[i].calendar.events[j],
                title: `${clientCalendars[i].firstname} - ${clientCalendars[i].calendar.events[j].title}`,
            });
        }
    }
    return events;
};

const _Calendar = ({
    auth,
    location, calendar, user,
    getUserCalendar, gotUserCalendar,
    addCalendarEvent, rmCalendarEvent, updatedCalendar,
}) => {
    (() => {})(addCalendarEvent);
    if (user == null) {
        return (<div className="center">Log in to view your calendar</div>);
    }
    // Load Calendar from server
    if (calendar.userCalendar == null) {
        if (!calendar.gettingCalendar) {
            getUserCalendar(user.id);
            API.getUserCalendar(user.id, auth.token).then((response) => {
                // TODO handle failure
                if (!response.success) {
                    console.log("ERROR");
                }
                gotUserCalendar(response);
                console.log(response);
            });
        }
        return (<div className="center">Loading</div>);
    }

    // Local state
    const [currentEvent, setCurrentEvent] = React.useState(null);
    const [addOpen, setAddOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [selectedClient, setSelectedClient] = React.useState("");
    const [visibleEvents, setVisibleEvents] = React.useState(calendar.userCalendar.events);
    const [calendarType, setCalendarTypeState] = React.useState("default");
    const [availableColours, setAvailableColours] = React.useState(ALL_EVENT_COLOURS);
    const [uidColours, setUidColours] = React.useState(new Map());
    const [changeToClient, setChangeToClient] = React.useState(false);

    // Properties of new event that is currently being added
    const [newEvent, setNewEvent] = React.useState({
        title: "",
        startDate: new Date(),
        endDate: new Date(),
        user,
    });

    const setCalendarType = (type) => {
        setCalendarTypeState(type);
        switch (type) {
        case "overview":
            setVisibleEvents(combineClientEvents(calendar.clientCalendars));
            break;
        case "me":
            // TODO
            if (typeof calendar.userCalendar.events === "undefined") {
                setVisibleEvents(calendar.userCalendar.userCalendar.events);
            } else {
                setVisibleEvents(calendar.userCalendar.events);
            }
            break;
        case "availability":
            setVisibleEvents(calendar.userCalendar.availability);
            break;
        case "client":
            if (selectedClient === "") {
                setVisibleEvents([]);
            } else {
                setVisibleEvents(selectedClient.calendar.events);
            }
            break;
        default:
        }
    };

    // Select the client that was passed with location if they are a client of this trainer
    if (location != null && user.isTrainer && typeof location.state !== "undefined" && selectedClient === "") {
        let found = false;
        for (let i = 0; i < calendar.clientCalendars.length; i++) {
            if (calendar.clientCalendars[i].id === location.state.userId) {
                setSelectedClient(calendar.clientCalendars[i]);
                found = true;
                setChangeToClient(true);
                break;
            }
        }
        if (!found) {
            console.log(`Invalid client calendar id ${location.state.userId}`);
        }
    }
    React.useEffect(() => {
        if (changeToClient && user.isTrainer) {
            setCalendarType("client");
            setChangeToClient(false);
        }
    });

    // Toggles the Add Event modal
    const toggleAddOpen = (event) => {
        setCurrentEvent(event);
        setNewEvent({ ...newEvent, startDate: event.start, endDate: moment(event.start).add(1, "h") });
        setAddOpen(!addOpen);
    };

    // Toggles the Edit Event modal
    const toggleEditOpen = (event) => {
        setCurrentEvent(event);
        setEditOpen(!editOpen);
    };

    const createEvent = () => {
        // TODO validate event locally before API call
        API.createCalendarEvent(newEvent, auth.token).then(
            (response) => {
                // TODO handle failure
                updatedCalendar(response);
                setCurrentEvent(null);
                setAddOpen(false);
            },
        );
    };

    const rmCurrentEvent = () => {
        // TODO validate currentEvent
        rmCalendarEvent(currentEvent);
        API.deleteCalendarEvent(currentEvent, auth.token).then(
            (response) => {
                // TODO handle failure
                updatedCalendar(response);
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
                            <TextField
                                label="Title"
                                value={newEvent.title}
                                onChange={(event) => setNewEvent({ ...newEvent, title: event.target.value })}
                            />
                        </Grid>
                        <Grid item>
                            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                                <KeyboardDateTimePicker
                                    disableToolbar
                                    format="DD-MM-YYYY hh:mm"
                                    label="Start"
                                    value={newEvent.startDate}
                                    onChange={(date) => setNewEvent({ ...newEvent, startDate: date })}
                                    autoOk
                                />
                                <KeyboardDateTimePicker
                                    disableToolbar
                                    format="DD-MM-YYYY hh:mm"
                                    label="End"
                                    value={newEvent.endDate}
                                    onChange={(date) => setNewEvent({ ...newEvent, endDate: date })}
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
                <h2 className="event-modal-title"><Typography>{currentEvent.title}</Typography></h2>
                <Paper>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
                        <Grid item>
                            <Typography>{`${currentEvent.start} to ${currentEvent.end}`}</Typography>
                        </Grid>
                        <Grid item>
                            <Button onClick={rmCurrentEvent}>
                                <Delete />
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Paper>
        </Modal>
    );

    const clientSelectDisabled = () => calendarType !== "client";

    const getNewColour = () => {
        if (availableColours.length === 0) {
            setAvailableColours(ALL_EVENT_COLOURS);
        }
        const colour = availableColours.pop();
        setAvailableColours(availableColours);
        return colour;
    };

    const eventColorByUserId = (id) => {
        if (uidColours.has(id)) {
            return uidColours.get(id);
        }
        const colour = getNewColour();
        uidColours.set(id, colour);
        setUidColours(uidColours);
        return colour;
    };

    if (user.isTrainer) {
        if (calendarType === "default") {
            setCalendarType("overview");
        }
    } else if (calendarType !== "me") {
        setCalendarType("me");
    }

    return (
        <div className="page">
            <h4 className="center">Click an event for more info or click a blank day to add an event</h4>
            {
                // Trainer Calendar type selection
                user.isTrainer
                && (
                    <div className="calendar-type-select-container">
                        <Paper>
                            <FormControl component="fieldset" variant="outlined">
                                <RadioGroup
                                    value={calendarType}
                                    onChange={(event) => event != null && setCalendarType(event.target.value)}
                                >
                                    <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                                        <Grid item>
                                            <FormControlLabel
                                                className="calendar-type-select-form-label"
                                                value="overview"
                                                control={<Radio />}
                                                label="Overview"
                                                labelPlacement="start"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <FormControlLabel
                                                className="calendar-type-select-form-label"
                                                value="me"
                                                control={<Radio />}
                                                label="My Calendar"
                                                labelPlacement="start"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <FormControlLabel
                                                className="calendar-type-select-form-label"
                                                value="availability"
                                                control={<Radio />}
                                                label="Availability"
                                                labelPlacement="start"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <FormControlLabel
                                                className="calendar-type-select-form-label"
                                                value="client"
                                                control={(
                                                    <Radio />
                                                )}
                                                label="Client"
                                                labelPlacement="start"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Autocomplete
                                                id="clientSelector"
                                                value={selectedClient}
                                                onChange={
                                                    (_, newValue) => {
                                                        setSelectedClient(newValue);
                                                        setCalendarType("client");
                                                    }
                                                }
                                                options={calendar.clientCalendars}
                                                getOptionLabel={(option) => (option === "" ? "" : option.firstname)}
                                                disabled={clientSelectDisabled()}
                                                renderInput={(items) => (
                                                    <TextField
                                                        {...items}
                                                        label="Client"
                                                        variant="outlined"
                                                    />
                                                )}
                                                autoSelect
                                                clearOnEscape
                                            />
                                        </Grid>
                                    </Grid>
                                </RadioGroup>
                            </FormControl>
                        </Paper>
                    </div>
                )
            }

            <div className="calendar-container">
                <BigCalendar
                    localizer={localizer}
                    events={visibleEvents}
                    onSelectSlot={toggleAddOpen}
                    onSelectEvent={toggleEditOpen}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }} // TODO move this to css
                    selectable
                    views={["month", "week", "day"]}
                    popup
                    eventPropGetter={
                        (event) => {
                            if (calendarType === "availability") {
                                return {
                                    className: "event-availability",
                                };
                            }

                            return {
                                className: "event-default",
                                style: {
                                    backgroundColor: eventColorByUserId(event.userId),
                                },
                            };
                        }
                    }
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
    auth: state.authReducer,
});

const mapDispatchToProps = (dispatch) => ({
    getUserCalendar: (id) => dispatch(getUserCalendarAction(id)),
    gotUserCalendar: (calendar) => dispatch(gotUserCalendarAction(calendar)),
    updatedCalendar: (event) => dispatch(updatedCalendarAction(event)),
    addCalendarEvent: (event) => dispatch(addCalendarEventAction(event)),
    rmCalendarEvent: (event) => dispatch(rmCalendarEventAction(event)),
});

_Calendar.propTypes = {
    location: PropTypes.shape(
        {
            state: PropTypes.shape(
                { userId: PropTypes.number },
            ),
        },
    ),
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
    auth: PropTypes.shape(
        {
            token: PropTypes.string,
        },
    ).isRequired,
    getUserCalendar: PropTypes.func.isRequired,
    gotUserCalendar: PropTypes.func.isRequired,
    updatedCalendar: PropTypes.func.isRequired,
    addCalendarEvent: PropTypes.func.isRequired,
    rmCalendarEvent: PropTypes.func.isRequired,
};

_Calendar.defaultProps = {
    user: null,
    location: null,
};

export const Calendar = connect(mapStateToProps, mapDispatchToProps)(_Calendar);

export default Calendar;
