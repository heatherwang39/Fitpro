import { connect } from "react-redux";
import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { PropTypes } from "prop-types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    Dropdown, Form, Radio, Segment,
} from "semantic-ui-react";
import "react-datepicker/dist/react-datepicker.css";
import useStateWithCallback from "use-state-with-callback";
import {
    getUserCalendar as getUserCalendarAction,
    gotUserCalendar as gotUserCalendarAction,
    updatedCalendar as updatedCalendarAction,
} from "../../actions/calendarActions";
import { User } from "../../types/user";
import { Calendar as CalendarType } from "../../types/calendar";
import API from "../../api";
import EditEventModal from "./EditEventModal";
import "./style.css";

// import { allWorkouts } from "../../api/test_data";

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
    const [visibleEvents, setVisibleEvents] = React.useState(calendar.userCalendar.events);
    const [calendarType, setCalendarTypeState] = React.useState("default");
    const [availableColours, setAvailableColours] = React.useState(ALL_EVENT_COLOURS);
    const [uidColours, setUidColours] = React.useState(new Map());
    const [changeToClient, setChangeToClient] = React.useState(false);
    // const [selectedWorkout, setSelectedWorkout] = React.useState(null); // Unused in Phase 1
    const [lastSelectedClient, setLastSelectedClient] = React.useState(null);
    const [selectedClient, setSelectedClient] = useStateWithCallback(null, (client) => {
        if (client != null && client !== lastSelectedClient) {
            setCalendarType("client"); // eslint-disable-line no-use-before-define
        }
        setLastSelectedClient(client);
    });

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
        // no default
        }
    };

    // Select the client that was passed with location if they are a client of this trainer
    if (location != null && user.isTrainer && typeof location.state !== "undefined" && selectedClient === null) {
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
        setCurEvent(curEvent);
    }, [changeToClient, user, curEvent]);

    // Open modal and prepare to make a new event
    const openModalAdding = (event) => {
        let { duration } = curEvent;
        if (event.end && event.end !== event.start) {
            duration = Math.floor((Math.abs(event.end - event.start) / 1000) / 60); // Minutes
        }
        setCurEvent({
            ...curEvent, start: event.start, duration,
        });
        setModalOpen(true);
    };

    // Open modal and prepare to edit an existing event
    const openModalEditing = (event) => {
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
        setModalOpen(true);
    };


    // Workout options removed for phase 1 since we have no Manage Workouts view yet
    //
    // const workoutOptions = () => {
    // // TODO fetch these from server dynamically based on user input
    // const workouts = [];
    // for (let i = 0; i < allWorkouts.length; i++) {
    // workouts.push({ key: i + 1, value: allWorkouts[i].id.toString(), text: allWorkouts[i].name });
    // }
    // return workouts;
    // };

    // const toggleSelectedWorkout = () => {
    // if (selectedWorkout == null) {
    // setSelectedWorkout(workoutOptions()[0].value);
    // } else {
    // setSelectedWorkout(null);
    // }
    // };

    const modalUpdatedEvent = (event) => {
        setCurEvent(event);
        setCalendarType(calendarType);
    };

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
                                        selection
                                        options={calendar.clientCalendars.map(
                                            (cal) => ({
                                                key: cal.id,
                                                text: `${cal.firstname} ${cal.lastname}`,
                                                value: cal.id,
                                            }),
                                        )}
                                        value={selectedClient === null ? "" : selectedClient.id}
                                        onChange={(_, v) => {
                                            setSelectedClient(calendar.clientCalendars.filter(
                                                (c) => c.id === v.value,
                                            )[0]);
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
            {modalOpen && (
                <EditEventModal
                    user={user}
                    calendar={calendar}
                    event={curEvent}
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    updatedEvent={modalUpdatedEvent}
                    updatedCalendar={updatedCalendar}
                />
            )}
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
