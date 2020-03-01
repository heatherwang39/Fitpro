import { connect } from "react-redux";
import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { PropTypes } from "prop-types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    Button, Dropdown, Form, Input, Label, Modal, Radio, Segment, Checkbox,
} from "semantic-ui-react";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
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

const repeatUnitOptions = [
    { key: 1, text: "Days", value: "days" },
    { key: 2, text: "Weeks", value: "weeks" },
    { key: 3, text: "Months", value: "months" },
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
                    console.log("ERROR loading calendar");
                }
                gotUserCalendar(response);
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
        start: new Date(),
        user,
        personalEvent: true,
        duration: 60,
        durationStr: "60",
        repeat: false,
        repeatFreq: "60",
        repeatUnits: "days",
        client: user.id.toString(),
        type: "event",
    });

    const setCalendarType = (type) => {
        setCalendarTypeState(type);
        switch (type) {
        case "overview": {
            setVisibleEvents(combineClientEvents(calendar.clientCalendars).concat(calendar.userCalendar.events));
            break;
        }
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
        // TODO if event.end !== event.start set newEvent.duration accordingly
        setNewEvent({ ...newEvent, start: event.start });
        setAddOpen(!addOpen);
    };

    // Toggles the Edit Event modal
    const toggleEditOpen = (event) => {
        setCurrentEvent(event);
        setEditOpen(!editOpen);
    };

    const parseMinutesDuration = (input) => {
        if (input.match(/^\d+$/)) {
            console.log("literal", input);
            return parseInt(input, 10);
        }
        const minsMatch = input.match(/(\d)+\s*[mM].*/);
        if (minsMatch != null) return parseInt(minsMatch[1], 10);
        const hoursAndMinsMatch = input.match(/(\d)+\s*[h:][oOuUrR\s]*((\d)+[mM]?)?.*/);
        if (hoursAndMinsMatch == null || hoursAndMinsMatch.length < 2) return 0;
        return parseInt(hoursAndMinsMatch[1] * 60, 10)
         + parseInt(hoursAndMinsMatch.length > 2 && hoursAndMinsMatch[2] !== undefined ? hoursAndMinsMatch[2] : 0, 10);
    };

    const createNewEvent = () => {
        // TODO validate event locally before API call
        if (newEvent.duration <= 0) return false;
        if (newEvent.type === "event") {
            if (newEvent.title.length === 0) return false;
        } else if (newEvent.type === "workout") {
            newEvent.title = "Workout"; // TODO set this dynamically
        } else {
            return false;
        }
        newEvent.durationStr = undefined;
        newEvent.end = new Date(newEvent.start.getTime() + newEvent.duration * 60);
        newEvent.personalEvent = newEvent.user === user;
        const updatingCalendar = newEvent.personalEvent
            ? calendar.userCalendar : calendar.clientCalendars.filter((c) => c.userId === user.id)[0];
        addCalendarEvent(newEvent);
        API.createCalendarEvent(newEvent, updatingCalendar).then(
            (response) => {
                if (!response.success) {
                    // TODO show error to user
                    console.log("Error adding event ", newEvent, "Got response ", response);
                    return;
                }
                updatedCalendar(response.calendar);
                setCalendarType(calendarType); // Force calendar to re-render if necessary
                setCurrentEvent(null);
                setAddOpen(false);
            },
        );
        return true;
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

    // List of client calendars by name to be used in Dropdown
    // Includes current user as top option
    const clientCalendarOptions = () => {
        const items = calendar.clientCalendars.map(
            (cal) => ({
                key: cal.id,
                text: `${cal.firstname} ${cal.lastname}`,
                value: cal.id.toString(),
            }),
        );
        items.unshift({ key: user.id, text: `${user.firstname} ${user.lastname}`, value: user.id.toString() });
        return items;
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
                    <Form.Group>
                        <Label>
                            Type
                            <Form.Field
                                control={Radio}
                                checked={newEvent.type === "event"}
                                label="Event"
                                onChange={() => setNewEvent({ ...newEvent, type: "event" })}
                            />
                            <Form.Field
                                control={Radio}
                                checked={newEvent.type === "workout"}
                                label="Workout"
                                onChange={() => setNewEvent({ ...newEvent, type: "workout" })}
                            />
                        </Label>
                        { newEvent.type === "event"
                        && (
                            <Input
                                label="Title"
                                value={newEvent.title}
                                onChange={(_, v) => setNewEvent({ ...newEvent, title: v.value })}
                            />
                        )}
                        { // TODO allow selecting multiple exercises
                            newEvent.type === "workout"
                        && (<div />)
                        }
                    </Form.Group>
                    <Form.Group>
                        <Input
                            labelPosition="right"
                            type="text"
                            value={newEvent.durationStr}
                            onChange={(_, v) => setNewEvent({
                                ...newEvent,
                                durationStr: v.value,
                                duration: parseMinutesDuration(v.value),
                            })}
                        >
                            <Label>Duration</Label>
                            <input />
                            <Label color={newEvent.duration > 0 ? null : "red"}>
                                {newEvent.duration > 0
                                    ? `${newEvent.duration} minutes` : "Invalid Duration"}
                            </Label>
                        </Input>
                    </Form.Group>
                    <Form.Group inline>
                        <Checkbox
                            checked={newEvent.repeat}
                            onClick={() => setNewEvent({ ...newEvent, repeat: !newEvent.repeat })}
                        />
                        &nbsp;Repeat every&nbsp;
                        <Input
                            value={newEvent.repeatFreq}
                            onChange={(_, v) => setNewEvent({ ...newEvent, repeatFreq: v.value })}
                        />
                        <Dropdown
                            inline
                            selection
                            options={repeatUnitOptions}
                            value={newEvent.repeatUnits}
                            onChange={(_, v) => setNewEvent({ ...newEvent, repeatUnits: v.value })}
                        />
                    </Form.Group>
                    {calendar.clientCalendars.length > 0 && (
                        <Form.Group inline>
                            For&nbsp;
                            <Dropdown
                                selection
                                options={clientCalendarOptions()}
                                value={newEvent.client}
                                onChange={(_, v) => setNewEvent({ ...newEvent, client: v.value })}
                            />
                        </Form.Group>
                    )}
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    onClick={() => {
                        setAddOpen(false);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    positive
                    onClick={createNewEvent}
                >
                    Create
                </Button>
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
                <Button
                    negative
                    onClick={() => {
                        rmCurrentEvent();
                        setEditOpen(false);
                    }}
                >
                    Delete
                </Button>
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
                                                value: cal.id,
                                            }),
                                        )}
                                        value={selectedClient}
                                        onChange={(_, v) => {
                                            setSelectedClient(calendar.clientCalendars.filter((c) => c.id === v.value));
                                            setCalendarType("client");
                                        }}
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
