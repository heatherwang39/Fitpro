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
} from "../../actions/calendarActions";
import { User, CalendarEvent } from "../../types";
import API from "../../api/api";
import EditEventModal from "./EditEventModal";
import "./style.css";

const ALL_EVENT_COLOURS = [
    "orange",
    "violet",
    "green",
    "red",
    "purple",
    "blue",
];

const localizer = momentLocalizer(moment);

const eventColor = (event) => {
    const id = event.client ? event.client : event.owner;
    const number = parseInt(id.replace(/[a-zA-Z]/g, ""), 10);
    if (isNaN(number)) return ALL_EVENT_COLOURS[0];
    return ALL_EVENT_COLOURS[number % (ALL_EVENT_COLOURS.length - 1)];
};

const _Calendar = ({
    location, calendar, user,
    getUserCalendar, gotUserCalendar,
}) => {
    if (user == null) {
        return (<div className="center">Log in to view your calendar</div>);
    }

    // const [fetched, setFetched] = React.useState(false);
    const [error, setError] = React.useState(false);

    // Local state
    const [modalOpen, setModalOpen] = React.useState(false);
    // const [visibleEvents, setVisibleEvents] = React.useState(calendar.myEvents);
    const [calendarType, setCalendarType] = React.useState("default");
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
    const [modalEvent, setModalEvent] = React.useState(null);

    const selectedEvents = () => {
        switch (calendarType) {
        case "overview":
            return [...calendar.myEvents, ...calendar.myClientEvents];
        case "me":
            return calendar.myEvents.filter((e) => !e.client);
        case "availability":
            // TODO
            // return calendar.userCalendar.availability
            break;
        case "client":
            return selectedClient ? calendar.myEvents.filter((e) => e.client === selectedClient) : [];
        // returning outside switch default makes eslint happy about consistent return
        // no default
        }
        return [];
    };

    // Select the client that was passed with location if they are a client of this trainer
    if (location != null && user.isTrainer && typeof location.state !== "undefined" && selectedClient === null) {
        if (user.clients.includes(location.state.userId)) { // TODO support populated clients list
            setSelectedClient(location.state.userId);
            setChangeToClient(true);
        } else {
            console.log(`Invalid client calendar id ${location.state.userId}`);
        }
    }

    React.useEffect(() => {
        if (changeToClient && user.isTrainer) {
            setCalendarType("client");
            setChangeToClient(false);
        }
        setModalEvent(modalEvent);
    }, [changeToClient, user, modalEvent, calendar]);

    // Load Calendar from server
    if (calendar.myEvents == null) {
        if (error) return (<div>Error</div>);
        if (!calendar.gettingCalendar) {
            getUserCalendar(user.id);
            API.getUserCalendar(user).then((response) => {
                // TODO handle failure
                if (!response.success) {
                    console.log("ERROR loading calendar");
                    setError(true);
                }
                gotUserCalendar(response.calendar);
            });
        }
        return (<div className="center">Loading</div>);
    }

    const openModal = (event) => {
        if (event.id) {
            setModalEvent(event);
        } else {
            setModalEvent(new CalendarEvent({
                title: "",
                start: event.start,
                end: event.end,
                client: selectedClient ? selectedClient.id : undefined,
            }));
        }
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

    // Called by EditEventModal when Create/Save/Delete is clicked after validating event
    const modalUpdatedEvent = ({ event, deleted }) => {
        if (event.owner === user.id || event.owner === undefined) {
            if (deleted) {
                gotUserCalendar({ ...calendar, myEvents: calendar.myEvents.filter((e) => e.id !== event.id) });
            } else if (calendar.myEvents) {
                let newEvent = true;
                for (let i = 0; i < calendar.myEvents.length; i++) {
                    if (calendar.myEvents[i].id === event.id) {
                        gotUserCalendar({
                            ...calendar,
                            myEvents: [event]
                                .concat(calendar.myEvents.slice(0, i))
                                .concat(calendar.myEvents.slice(i + 1)),
                        });
                        newEvent = false;
                        break;
                    }
                }
                if (newEvent) {
                    gotUserCalendar({
                        ...calendar,
                        myEvents: [...calendar.myEvents, event],
                    });
                }
            } else {
                gotUserCalendar({
                    ...calendar,
                    myEvents: [event],
                });
            }
        } else if (deleted) {
            gotUserCalendar({ ...calendar, myClientEvents: calendar.myClientEvents.filter((e) => e.id !== event.id) });
        } else if (calendar.myClientEvents) {
            let newEvent = true;
            for (let i = 0; i < calendar.myClientEvents.length; i++) {
                if (calendar.myClientEvents[i].id === event.id) {
                    gotUserCalendar({
                        ...calendar,
                        myClientEvents: [event]
                            .concat(calendar.myClientEvents.slice(0, i))
                            .concat(calendar.myClientEvents.slice(i + 1)),
                    });
                    newEvent = false;
                    break;
                }
            }
            if (newEvent) {
                gotUserCalendar({
                    ...calendar,
                    myClientEvents: [...calendar.myClientEvents, event],
                });
            }
        } else {
            gotUserCalendar({
                ...calendar,
                myClientEvents: [event],
            });
        }
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
                                        options={user.clients.map(
                                            (c) => ({
                                                key: c._id,
                                                text: `${c.firstname} ${c.lastname}`,
                                                value: c._id,
                                            }),
                                        )}
                                        value={selectedClient === null ? "" : selectedClient._id}
                                        onChange={(_, v) => {
                                            setSelectedClient(v.value);
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
                    events={selectedEvents(calendar)}
                    onSelectSlot={openModal}
                    onSelectEvent={openModal}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
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
                                    backgroundColor: eventColor(event),
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
                    event={modalEvent}
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    updatedEvent={modalUpdatedEvent}
                />
            )}
        </div>
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
            myEvents: PropTypes.arrayOf(PropTypes.instanceOf(CalendarEvent)),
            gettingCalendar: PropTypes.bool,
            myClientEvents: PropTypes.arrayOf(PropTypes.instanceOf(CalendarEvent)),
        },
    ).isRequired,
    user: PropTypes.instanceOf(User),
    getUserCalendar: PropTypes.func.isRequired,
    gotUserCalendar: PropTypes.func.isRequired,
};

_Calendar.defaultProps = {
    user: null,
    location: null,
};

export const Calendar = connect(mapStateToProps, mapDispatchToProps)(_Calendar);

export default Calendar;
