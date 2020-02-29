import { connect } from "react-redux";
import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { PropTypes } from "prop-types";
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    Button, Dropdown, Form, Input, Modal, Radio, Segment,
} from "semantic-ui-react";
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

const repeatOptions = [
    { key: 1, text: "Never", value: "never" },
    { key: 2, text: "Daily", value: "daily" },
    { key: 3, text: "Weekly", value: "weekly" },
    { key: 4, text: "Monthly", value: "Monthly" },
];

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
        duration: "60",
        repeat: "never",
        client: calendar.clientCalendars.length > 0 ? calendar.clientCalendars[0].id : 0,
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
        <Modal
            open={addOpen}
            onClose={() => setAddOpen(false)}
            closeIcon
        >
            <Modal.Header>
                Add Event
            </Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <Input
                            label="Title"
                            value={newEvent.title}
                            onChange={(_, v) => setNewEvent({ ...newEvent, title: v.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                            <KeyboardDateTimePicker
                                disableToolbar
                                format="DD-MM-YYYY hh:mm"
                                label="Date"
                                value={newEvent.startDate}
                                onChange={(date) => setNewEvent({ ...newEvent, startDate: date })}
                                autoOk
                            />
                        </MuiPickersUtilsProvider>
                    </Form.Field>
                    <Form.Field>
                        <Input
                            label="Duration"
                            value={newEvent.duration}
                            onChange={(_, v) => setNewEvent({ ...newEvent, duration: v.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Dropdown
                            text="Repeat"
                            labeled
                            selection
                            options={repeatOptions}
                            value={newEvent.repeat}
                            onChange={(_, v) => setNewEvent({ ...newEvent, repeat: v.value })}
                        />
                    </Form.Field>
                    {calendar.clientCalendars.length > 0 && (
                        <Form.Field>
                            <Dropdown
                                selection
                                options={calendar.clientCalendars.map(
                                    (cal) => ({
                                        key: cal.id,
                                        text: `${cal.firstname} ${cal.lastname}`,
                                        value: cal.id,
                                    }),
                                )}
                                value={newEvent.client}
                                onChange={(_, v) => setNewEvent({ ...newEvent, client: v.value })}
                            />
                        </Form.Field>
                    )}
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => { createEvent(); setAddOpen(false); }}>Create</Button>
            </Modal.Actions>
        </Modal>
    );

    // Modal for editing existing event
    const editModal = () => (
        <Modal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            closeIcon
        >
            <Modal.Header>
                Edit Event
            </Modal.Header>
            <Modal.Content>
                TODO
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick={() => { rmCurrentEvent(); setEditOpen(false); }}>Delete</Button>
            </Modal.Actions>
        </Modal>
    );

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
                    <Segment className="calendar-type-select-container">
                        <Form>
                            <Form.Group inline>
                                <Form.Field
                                    control={Radio}
                                    checked={calendarType === "overview"}
                                    label="Overview"
                                    onChange={() => setCalendarType("overview")}
                                />
                                <Form.Field
                                    control={Radio}
                                    checked={calendarType === "me"}
                                    label="My Calendar"
                                    onChange={() => setCalendarType("me")}
                                />
                                <Form.Field
                                    control={Radio}
                                    checked={calendarType === "availability"}
                                    label="Availability"
                                    onChange={() => setCalendarType("availability")}
                                />
                                <Form.Field>
                                    <Radio
                                        checked={calendarType === "client"}
                                        label="Client"
                                        onChange={() => setCalendarType("client")}
                                    />
                                    <Dropdown
                                        search
                                        selection
                                        options={calendar.clientCalendars.map(
                                            (cal) => ({
                                                key: cal.id,
                                                text: `${cal.firstname} ${cal.lastname}`,
                                                value: cal,
                                            }),
                                        )}
                                        value={selectedClient}
                                        onChange={(_, v) => { setSelectedClient(v.value); setCalendarType("client"); }}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Segment>
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
