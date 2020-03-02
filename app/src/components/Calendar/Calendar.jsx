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

import { allWorkouts } from "../../api/test_data";

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
    userId: user.id,
    duration: 60,
    durationStr: "60",
    repeat: false,
    repeatFreq: "1",
    repeatUnits: "days",
    client: user.id.toString(),
    id: -1,
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
                client: clientCalendars[i].id,
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
    const [selectedClient, setSelectedClient] = React.useState(
        calendar.clientCalendars && calendar.clientCalendars.length > 0 ? calendar.clientCalendars[0] : null,
    );
    const [visibleEvents, setVisibleEvents] = React.useState(calendar.userCalendar.events);
    const [calendarType, setCalendarTypeState] = React.useState("default");
    const [availableColours, setAvailableColours] = React.useState(ALL_EVENT_COLOURS);
    const [uidColours, setUidColours] = React.useState(new Map());
    const [changeToClient, setChangeToClient] = React.useState(false);
    const [selectedWorkout, setSelectedWorkout] = React.useState(null);

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
            setVisibleEvents(calendar.userCalendar.events);
            break;
        case "availability":
            setVisibleEvents(calendar.userCalendar.availability);
            break;
        case "client":
            if (selectedClient === null) setVisibleEvents([]);
            setVisibleEvents(selectedClient.calendar.events);
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
        let { duration } = curEvent;
        if (event.end && event.end !== event.start) {
            duration = Math.floor((Math.abs(event.end - event.start) / 1000) / 60); // Minutes
        }
        setCurEvent({
            ...curEvent, start: event.start, durationStr: duration.toString(), duration,
        });
        setModalOpen(!modalOpen);
    };

    // Open modal and prepare to edit an existing event
    const openModalEditing = (event) => {
        setEditing(true);
        // TODO clientCalendars should probably be a Map of userId->Calendar instead of Array
        let newCurEvent = Object.create(event);
        if (!user.isTrainer || event.userId === user.id) {
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
            // TODO show error to user (this shouldn't ever happen though)
            console.log("ERROR couldn't find event ", event.id);
        }
        newCurEvent.duration = Math.floor((Math.abs(newCurEvent.end - newCurEvent.start) / 1000) / 60); // Minutes
        newCurEvent.durationStr = newCurEvent.duration.toString();
        setCurEvent(newCurEvent);
        setModalOpen(!modalOpen);
        console.log(curEvent.duration, curEvent.durationStr);
    };

    // if (curEvent.duration === 0 && curEvent.end !== undefined && curEvent.end > curEvent.start) {
    //     const duration = Math.floor((Math.abs(curEvent.end - curEvent.start) / 1000) / 60); // Minutes
    //     setCurEvent({ ...curEvent, duration, durationStr: duration.toString() });
    // }

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
        if (curEvent.duration <= 0) {
            console.log("Invalid duration");
            return false;
        }
        let { title } = curEvent;
        if (curEvent.title.length === 0) {
            if (selectedWorkout == null) {
                console.log("Invalid title");
                return false;
            }
            title = "Workout"; // TODO get this dynamically based on selectedWorkout
        }
        if (curEvent.start < new Date()) {
            console.log("Invalid start date");
            return false;
        }
        if (selectedWorkout != null) curEvent.workout = selectedWorkout;
        const end = new Date(curEvent.start.getTime() + curEvent.duration * 60000);
        console.log("end", end);
        const personalEvent = curEvent.userId === user.id;
        setCurEvent({
            ...curEvent, title, end, personalEvent,
        });
        return true;
    };

    const submitCurEvent = () => {
        if (!validateCurEvent()) return;
        const updatingCalendar = user.isTrainer
            ? (curEvent.client === user.id.toString()
                ? calendar.userCalendar : calendar.clientCalendars.filter((c) => c.id === curEvent.client)[0].calendar)
            : calendar.userCalendar;
        // stuff with event is just wasting time so setCurEvent in validateCurEvent hopefully finishes before API call
        // TODO handle it properly
        let event = curEvent;
        if (curEvent.end === undefined) {
            event.end = new Date(curEvent.start.getTime() + curEvent.duration * 60000);
        }
        event = { ...event, ...curEvent };
        API.createCalendarEvent(event, updatingCalendar).then(
            (response) => {
                if (!response.success) {
                    // TODO show error to user
                    console.log("Error adding event ", event, "Got response ", response);
                    return;
                }
                updatedCalendar(response.calendar);
                console.log(response.calendar);
                setCalendarType(calendarType); // Force calendar to re-render if necessary
                setCurEvent(blankEvent(user));
                setModalOpen(false);
            },
        );
        return true;
    };

    const rmCurrentEvent = () => {
        if (!validateCurEvent()) return;
        const updatingCalendar = user.isTrainer
            ? (curEvent.client === user.id.toString()
                ? calendar.userCalendar : calendar.clientCalendars.filter((c) => c.id === curEvent.client)[0].calendar)
            : calendar.userCalendar;
        API.deleteCalendarEvent(curEvent, updatingCalendar).then(
            (response) => {
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

    const workoutOptions = () => {
        // TODO fetch these from server dynamically based on user input
        const workouts = [];
        for (let i = 0; i < allWorkouts.length; i++) {
            workouts.push({ key: i + 1, value: allWorkouts[i].id.toString(), text: allWorkouts[i].name });
        }
        return workouts;
    };

    const toggleSelectedWorkout = () => {
        if (selectedWorkout == null) {
            setSelectedWorkout(workoutOptions()[0].value);
        } else {
            setSelectedWorkout(null);
        }
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
                    <Form.Group inline>
                        <Input
                            label="Title"
                            value={curEvent.title}
                            onChange={(_, v) => setCurEvent({ ...curEvent, title: v.value })}
                        />
                        <Label id="include-workouts-radio">
                            Include Workout
                            <Checkbox
                                checked={selectedWorkout !== null}
                                onChange={toggleSelectedWorkout}
                            />
                        </Label>
                        <Dropdown
                            inline
                            selection
                            options={workoutOptions()}
                            value={selectedWorkout}
                            onChange={(_, v) => setSelectedWorkout(v.value)}
                            disabled={selectedWorkout == null}
                        />
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
                                onChange={(_, v) => setCurEvent({ ...curEvent, client: v.value })
                                && setCalendarType(calendarType)}
                            />
                        </Form.Group>
                    )}
                </Form>
            </Modal.Content>
            <Modal.Actions>
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
                        positive
                        onClick={submitCurEvent}
                    >
                        Save
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
                                        value={selectedClient.id}
                                        onChange={(_, v) => {
                                            console.log(calendar.clientCalendars.filter((c) => c.id === v.value)[0]);
                                            setSelectedClient(calendar.clientCalendars.filter(
                                                (c) => c.id === v.value,
                                            )[0]);
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
