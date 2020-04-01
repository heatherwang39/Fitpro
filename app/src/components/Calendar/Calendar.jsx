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
    const [modalEvent, setModalEvent] = React.useState(null);

    const selectedEvents = () => {
        switch (calendarType) {
        case "overview":
            return [...calendar.myEvents, ...calendar.clientEventsList];
        case "me":
            return calendar.myEvents;
        case "availability":
            // TODO
            // return calendar.userCalendar.availability
            break;
        case "client":
            if (selectedClient === null) return [];
            return calendar.clientEvents[selectedClient] ? calendar.clientEvents[selectedClient] : [];
        // returning outside switch default makes eslint happy about consistent return
        // no default
        }
        return [];
    };

    // Select the client that was passed with location if they are a client of this trainer
    if (location != null && user.isTrainer && typeof location.state !== "undefined" && selectedClient === null) {
        if (calendar.clientEvents[location.state.userId]) {
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
        // console.log("ef", calendar);
        // setCalendarTypeState(calendarType);
    }, [changeToClient, user, modalEvent, calendar]);
    console.log(calendar);
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

    const modalUpdatedEvent = ({ event, deleted }) => {
        if (!user.isTrainer || !event.client || event.client === user.id) {
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
            }
        } else {
            const newClientEvents = calendar.clientEvents ? calendar.clientEvents : {};
            if (deleted) {
                newClientEvents[event.client] = newClientEvents[event.client].filter((e) => e.id !== event.id);
            } else if (calendar.clientEvents) {
                if (calendar.clientEvents[event.client]) {
                    for (let i = 0; i < calendar.clientEvents[event.client].length; i++) {
                        if (calendar.clientEvents[event.client][i].id === event.id) {
                            newClientEvents[event.client] = newClientEvents[event.client].filter((e) => e.id !== event.id);
                            break;
                        }
                    }
                } else {
                    newClientEvents[event.client] = [event.client];
                }
            }
            // Don't pass {...calendar} so clientEventsList argument is undefined and therefore generated automatically
            gotUserCalendar({
                myEvents: calendar.myEvents,
                gettingCalendar: calendar.gettingCalendar,
                clientEvents: newClientEvents,
            });
        }
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
                                        options={Object.keys(calendar.clientEvents).map(
                                            (c) => ({
                                                key: c._id,
                                                text: `${c.firstname} ${c.lastname}`,
                                                value: c._id,
                                            }),
                                        )}
                                        value={selectedClient === null ? "" : selectedClient.id}
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
                                    backgroundColor:
                                    eventColorByUserId(event.client ? event.client.id : event.owner.id),
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
            clientEvents: PropTypes.object,
            clientEventsList: PropTypes.arrayOf(PropTypes.object),
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
