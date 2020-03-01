import { connect } from "react-redux";
import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { PropTypes } from "prop-types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    Button, Dropdown, Form, Input, Label, Modal, Radio, Segment, Checkbox,
} from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimeInput from "material-ui-time-picker";
import {
    getUserCalendar as getUserCalendarAction,
    gotUserCalendar as gotUserCalendarAction,
    updatedCalendar as updatedCalendarAction,
} from "../../actions/calendarActions";
import { User } from "../../types/user";
import { Calendar as CalendarType } from "../../types/calendar";
import API from "../../api";
import "./style.css";

// TODO add more colours
const ALL_EVENT_COLOURS = [
    "orange",
    "violet",
    "green",
    "red",
    "purple",
    "blue",
];

const localizer = momentLocalizer(moment);

const blankEvent = (user) => ({
    title: "",
    start: new Date(),
    user,
    personalEvent: true,
    duration: 60,
    durationStr: "60",
    repeat: false,
    repeatFreq: "1",
    repeatUnits: "days",
    client: user.id.toString(),
    type: "event",
});

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
    updatedCalendar,
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
    const [modalOpen, setModalOpen] = React.useState(false);
    const [editing, setEditing] = React.useState(false); // True if editing existing event, false if making new event
    const [selectedClient, setSelectedClient] = React.useState("");
    const [visibleEvents, setVisibleEvents] = React.useState(calendar.userCalendar.events);
    const [calendarType, setCalendarTypeState] = React.useState("default");
    const [availableColours, setAvailableColours] = React.useState(ALL_EVENT_COLOURS);
    const [uidColours, setUidColours] = React.useState(new Map());
    const [changeToClient, setChangeToClient] = React.useState(false);

    // Properties of event currently being created/modified
    const [curEvent, setCurEvent] = React.useState(blankEvent(user));

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

    // Open modal and prepare to make a new event
    const openModalAdding = (event) => {
        setEditing(false);
        // TODO if event.end !== event.start set newEvent.duration accordingly
        setCurEvent({ ...curEvent, start: event.start });
        setModalOpen(!modalOpen);
    };

    // Open modal and prepare to edit an existing event
    const openModalEditing = (event) => {
        setEditing(true);
        // TODO clientCalendars should probably be a Map of userId->Calendar instead of Array
        let newCurEvent = null;
        if (event.userId === user.id) {
            for (let i = 0; i < calendar.userCalendar.events.length; i++) {
                if (calendar.userCalendar.events[i].id === event.id) {
                    newCurEvent = calendar.userCalendar.events[i];
                    newCurEvent.client = user.id;
                    break;
                }
            }
        } else {
            for (let i = 0; i < calendar.clientCalendars.length; i++) {
                if (calendar.clientCalendars[i].id === event.userId) {
                    for (let j = 0; j < calendar.clientCalendars[i].calendar.events.length; j++) {
                        if (calendar.clientCalendars[i].calendar.events[j].id === event.id) {
                            newCurEvent = calendar.clientCalendars[i].calendar.events[j];
                            newCurEvent.client = calendar.clientCalendars[i].id;
                            break;
                        }
                    }
                    if (newCurEvent != null) break;
                }
            }
        }
        if (newCurEvent == null) {
            // TODO show error to user (this shouldn't ever happen though anyway)
            console.log("ERROR couldn't find event ", event.id);
        }
        newCurEvent.duration = Math.floor((Math.abs(newCurEvent.end - newCurEvent.start) / 1000) / 60); // Minutes
        newCurEvent.durationStr = newCurEvent.duration.toString();
        newCurEvent.type = "event"; // TODO
        setCurEvent(newCurEvent);
        setModalOpen(!modalOpen);
    };

    const parseMinutesDuration = (input) => {
        if (input.match(/^\d+$/)) return parseInt(input, 10);
        const minsMatch = input.match(/(\d)+\s*[mM].*/);
        if (minsMatch != null) return parseInt(minsMatch[1], 10);
        const hoursAndMinsMatch = input.match(/(\d)+\s*[h:][oOuUrR\s]*((\d)+[mM]?)?.*/);
        if (hoursAndMinsMatch == null || hoursAndMinsMatch.length < 2) return 0;
        return parseInt(hoursAndMinsMatch[1] * 60, 10)
         + parseInt(hoursAndMinsMatch.length > 2 && hoursAndMinsMatch[2] !== undefined ? hoursAndMinsMatch[2] : 0, 10);
    };


    const validateCurEvent = () => {
        if (curEvent.duration <= 0) return false;
        if (curEvent.type === "event") {
            if (curEvent.title.length === 0) return false;
        } else if (curEvent.type === "workout") {
            curEvent.title = "Workout"; // TODO set this dynamically
        } else {
            return false;
        }
        if (curEvent.start < new Date()) return false;
        curEvent.durationStr = undefined;
        curEvent.end = new Date(curEvent.start.getTime() + curEvent.duration * 60);
        curEvent.personalEvent = curEvent.user === user;
        return true;
    };

    const submitCurEvent = () => {
        if (!validateCurEvent()) return;
        const updatingCalendar = curEvent.personalEvent
            ? calendar.userCalendar : calendar.clientCalendars.filter((c) => c.id === curEvent.userId)[0].calendar;
        API.createCalendarEvent(curEvent, updatingCalendar).then(
            (response) => {
                if (!response.success) {
                    // TODO show error to user
                    console.log("Error adding event ", curEvent, "Got response ", response);
                    return;
                }
                updatedCalendar(response.calendar);
                setCalendarType(calendarType); // Force calendar to re-render if necessary
                setCurEvent(blankEvent(user));
                setModalOpen(false);
            },
        );
    };

    const rmCurrentEvent = () => {
        if (!validateCurEvent()) return;
        const updatingCalendar = curEvent.personalEvent
            ? calendar.userCalendar : calendar.clientCalendars.filter((c) => c.id === curEvent.userId)[0].calendar;
        // TODO validate currentEvent
        API.deleteCalendarEvent(curEvent, updatingCalendar).then(
            (response) => {
                console.log("response", response);
                if (!response.success) {
                    // TODO show error to user
                    console.log("Error deleting event ", curEvent, "Got response ", response);
                    return;
                }
                updatedCalendar(response.calendar);
                setCalendarType(calendarType); // Force calendar to re-render if necessary
                setCurEvent(blankEvent(user));
                setModalOpen(false);
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
    const modal = () => (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            closeIcon
        >
            {editing
            && (
                <Modal.Header>
                    Edit Event
                </Modal.Header>
            )}
            {!editing
            && (
                <Modal.Header>
                    Add Event
                </Modal.Header>
            )}
            <Modal.Content>
                <Form>
                    <Form.Group>
                        <Label>
                            Type
                            <Form.Field
                                control={Radio}
                                checked={curEvent.type === "event"}
                                label="Event"
                                onChange={() => setCurEvent({ ...curEvent, type: "event" })}
                            />
                            <Form.Field
                                control={Radio}
                                checked={curEvent.type === "workout"}
                                label="Workout"
                                onChange={() => setCurEvent({ ...curEvent, type: "workout" })}
                            />
                        </Label>
                        { curEvent.type === "event"
                        && (
                            <Input
                                label="Title"
                                value={curEvent.title}
                                onChange={(_, v) => setCurEvent({ ...curEvent, title: v.value })}
                            />
                        )}
                        { // TODO allow selecting multiple exercises
                            curEvent.type === "workout"
                        && (<div />)
                        }
                    </Form.Group>
                    <Form.Group inline>
                        <DatePicker
                            selected={curEvent.start}
                            onChange={(date) => setCurEvent({ ...curEvent, start: date })}
                        />
                        <TimeInput
                            mode="12h"
                            value={curEvent.start}
                            onChange={(time) => {
                                const newStart = curEvent.start;
                                newStart.setHours(time.getHours());
                                newStart.setMinutes(time.getMinutes());
                                setCurEvent({ ...curEvent, start: newStart });
                            }}
                            autoOk
                        />
                        <Input
                            type="text"
                            value={curEvent.durationStr}
                            onChange={(_, v) => setCurEvent({
                                ...curEvent,
                                durationStr: v.value,
                                duration: parseMinutesDuration(v.value),
                            })}
                            label="Duration"
                        />
                        <Label color={curEvent.duration > 0 ? null : "red"} pointing="left">
                            {curEvent.duration > 0
                                ? `${curEvent.duration} minutes` : "Invalid Duration"}
                        </Label>
                    </Form.Group>
                    <Form.Group inline>
                        <Checkbox
                            checked={curEvent.repeat}
                            onClick={() => setCurEvent({ ...curEvent, repeat: !curEvent.repeat })}
                        />
                        &nbsp;Repeat every&nbsp;
                        <Input
                            value={curEvent.repeatFreq}
                            onChange={(_, v) => setCurEvent({ ...curEvent, repeatFreq: v.value })}
                            disabled={!curEvent.repeat}
                        />
                        <Dropdown
                            inline
                            selection
                            options={repeatUnitOptions}
                            value={curEvent.repeatUnits}
                            onChange={(_, v) => setCurEvent({ ...curEvent, repeatUnits: v.value })}
                            disabled={!curEvent.repeat}
                        />
                    </Form.Group>
                    {calendar.clientCalendars.length > 0 && (
                        <Form.Group inline>
                            For&nbsp;
                            <Dropdown
                                selection
                                options={clientCalendarOptions()}
                                value={curEvent.client}
                                onChange={(_, v) => setCurEvent({ ...curEvent, client: v.value })}
                            />
                        </Form.Group>
                    )}
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    onClick={() => {
                        setModalOpen(false);
                    }}
                >
                    Cancel
                </Button>
                {!editing
                && (
                    <Button
                        positive
                        onClick={submitCurEvent}
                    >
                        Create
                    </Button>
                )}
                {editing
                && (
                    <Button
                        negative
                        onClick={() => {
                            rmCurrentEvent();
                            setModalOpen(false);
                        }}
                    >
                        Delete
                    </Button>
                )}
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
                    onSelectSlot={openModalAdding}
                    onSelectEvent={openModalEditing}
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
                {modalOpen ? modal() : null}
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
};

_Calendar.defaultProps = {
    user: null,
    location: null,
};

export const Calendar = connect(mapStateToProps, mapDispatchToProps)(_Calendar);

export default Calendar;
