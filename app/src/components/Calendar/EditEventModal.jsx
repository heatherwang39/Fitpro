import React from "react";
import { PropTypes } from "prop-types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    Button, Dropdown, Form, Input, Label, Modal, Checkbox,
} from "semantic-ui-react";
import DatePicker from "react-datepicker";
import TimeInput from "material-ui-time-picker";
import { User } from "../../types/user";
import { Calendar as CalendarType } from "../../types/calendar";
import API from "../../api";
import "react-datepicker/dist/react-datepicker.css";

// List of client calendars by name to be used in Dropdown
// Includes current user as top option
const clientCalendarOptions = (calendar, user) => {
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

const parseMinutesDuration = (input) => {
    if (input.match(/^\d+$/)) return parseInt(input, 10);
    const minsMatch = input.match(/(\d)+\s*[mM].*/);
    if (minsMatch != null) return parseInt(minsMatch[1], 10);
    const hoursAndMinsMatch = input.match(/(\d)+\s*[h:][oOuUrR\s]*((\d)+[mM]?)?.*/);
    if (hoursAndMinsMatch == null || hoursAndMinsMatch.length < 2) return 0;
    return parseInt(hoursAndMinsMatch[1] * 60, 10)
         + parseInt(hoursAndMinsMatch.length > 2 && hoursAndMinsMatch[2] !== undefined ? hoursAndMinsMatch[2] : 0, 10);
};

const repeatUnitOptions = [
    { key: 1, text: "Days", value: "days" },
    { key: 2, text: "Weeks", value: "weeks" },
    { key: 3, text: "Months", value: "months" },
];

const EditEventModal = ({
    calendar, user, event, modalOpen, setModalOpen, updatedCalendar, updatedEvent,
}) => {
    const [duration, setDuration] = React.useState(event.duration);
    const [repeat, setRepeat] = React.useState(event.repeat === undefined ? false : event.repeat);
    const [startDate, setStartDate] = React.useState(event.start);
    const [formErrors, setFormErrors] = React.useState([]);
    const [selectedClient, setSelectedClient] = React.useState(event.userId.toString());

    React.useEffect(() => {
        setDuration(event.duration);
        setRepeat(event.repeat === undefined ? false : event.repeat);
        setStartDate(event.start);
        setSelectedClient(event.userId.toString());
    }, [event]);

    if (!modalOpen) return (<div />);

    const existingEvent = event.id !== undefined;

    // Returns an Object representing the errors in the target form
    // Note that errors should only have attributes for actual errors because
    // we check whether the attributes exist not whether they are truthy
    const getFormErrors = (target) => {
        const errors = {};
        // Duration
        if (duration === 0) errors.duration = true;
        // Date
        if (startDate < Date.now() || target[1].value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/) === null) errors.date = true;
        // Time
        if (target[2].value.match(/^\d\d:\d\d (am|pm)$/) === null) errors.time = true;
        // Repeat
        if (target[4].checked) {
            if (target[5].value === "") errors.repeatFreq = true;
            if (target[6].value === "") errors.repeatUntis = true;
        }
        // Client
        if (selectedClient === "") errors.client = false;
        return errors;
    };

    const eventFromForm = (target) => {
        const newEvent = { ...event };
        newEvent.duration = duration;
        newEvent.start = startDate;
        const timeMatch = target[2].value.match(/^(\d\d):(\d\d) (am|pm)$/);
        newEvent.start.setHours(timeMatch[3] === "pm" && timeMatch[1] !== "12"
            ? parseInt(timeMatch[1], 10) + 12 : parseInt(timeMatch[1], 10));
        newEvent.start.setMinutes(parseInt(timeMatch[2], 10));
        newEvent.title = target[0].value;
        newEvent.repeat = repeat;
        newEvent.end = new Date(newEvent.start.getTime() + duration * 60000);
        if (repeat) {
            newEvent.repeatFreq = target[5].value;
            newEvent.repeatUnits = target[6].value;
        }
        return newEvent;
    };

    const submitForm = (e) => {
        e.preventDefault();
        const newEvent = eventFromForm(e.target);
        const errors = getFormErrors(e.target);
        setFormErrors(errors);
        if (Object.entries(errors).length !== 0) return;
        const selectedCalendar = calendar.clientCalendars.length === 0 || selectedClient === user.id.toString()
            ? calendar.userCalendar
            : calendar.clientCalendars.find((c) => c.userId === selectedClient.id).calendar;
        newEvent.userId = selectedCalendar.userId;
        newEvent.personalEvent = newEvent.userId === user.id;
        API.createCalendarEvent(newEvent, selectedCalendar).then(
            (response) => {
                if (!response.success) {
                    console.log("Error creating event. Got response", response);
                }
                updatedCalendar(response.calendar);
                if (newEvent.id !== -1) {
                    updatedEvent(response.calendar.events.find((ev) => ev.id === newEvent.id));
                } else {
                    updatedEvent(response.calendar.events.find(
                        (ev) => ev.title === newEvent.title
                        && ev.start === newEvent.start
                        && ev.userId === newEvent.userId,
                    ));
                }
                setModalOpen(false);
            },
        );
    };

    const deleteEvent = () => {
        const selectedCalendar = calendar.clientCalendars.length === 0 || selectedClient === user.id.toString()
            ? calendar.userCalendar
            : calendar.clientCalendars.find((c) => c.userId === selectedClient.id).calendar;
        if (event.id === -1) { // Should never happen
            console.log("Tried to delete new event");
            return;
        }
        API.deleteCalendarEvent(event, selectedCalendar).then(
            (response) => {
                if (!response.success) {
                    console.log("Error deleting event. Got response ", response);
                    return;
                }
                updatedCalendar(response.calendar);
                updatedEvent(event);
                setModalOpen(false);
            },
        );
    };

    const clientOptions = clientCalendarOptions(calendar, user);

    return (
        <Modal
            as={Form}
            onSubmit={(e) => submitForm(e)}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            closeIcon
        >
            <Modal.Header>
                {existingEvent ? "Edit Event" : "Add Event"}
            </Modal.Header>
            <Modal.Content>
                <Form.Group inline>
                    <Input
                        label="Title"
                        required
                        type="text"
                        defaultValue={event.title}
                        error={formErrors.title}
                    />
                    {
                    // <Label id="include-workouts-radio">
                    // Include Workout
                    // <Checkbox
                    // checked={selectedWorkout !== null}
                    // onChange={toggleSelectedWorkout}
                    // />
                    // </Label>
                    // <Dropdown
                    // inline
                    // selection
                    // options={workoutOptions()}
                    // value={selectedWorkout}
                    // onChange={(_, v) => setSelectedWorkout(v.value)}
                    // disabled={selectedWorkout == null}
                    // />
                    }
                </Form.Group>
                <Form.Group inline>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        minDate={Date.now()}
                        required
                        error={formErrors.date}
                    />
                    <TimeInput
                        mode="12h"
                        initialTime={event.start}
                        autoOk
                        required
                        error={formErrors.time}
                    />
                    <Input
                        type="text"
                        defaultValue={event.duration}
                        onChange={(_, v) => { setDuration(parseMinutesDuration(v.value)); }}
                        label="Duration"
                        required
                        error={formErrors.duration}
                    />
                    <Label color={duration > 0 ? null : "red"} pointing="left">
                        {duration > 0
                            ? `${duration} minutes` : "Invalid Duration"}
                    </Label>
                </Form.Group>
                <Form.Group inline>
                    <Checkbox
                        checked={repeat}
                        onChange={() => setRepeat(!repeat)}
                    />
                        &nbsp;Repeat every&nbsp;
                    <Input
                        defaultValue={event.repeatFreq}
                        disabled={!repeat}
                        error={formErrors.repeatFreq}
                    />
                    <Dropdown
                        inline
                        selection
                        options={repeatUnitOptions}
                        disabled={!repeat}
                        error={formErrors.repeatUnits}
                    />
                </Form.Group>
                {calendar.clientCalendars.length > 0 && (
                    <Form.Group inline>
                        For&nbsp;
                        <Dropdown
                            selection
                            options={clientOptions}
                            error={formErrors.client}
                            value={selectedClient}
                            onChange={(_, v) => setSelectedClient(v.value)}
                        />
                    </Form.Group>
                )}
            </Modal.Content>
            <Modal.Actions>
                {existingEvent
                && (
                    <Button
                        negative
                        type="button"
                        id="delete"
                        onClick={deleteEvent}
                    >
                        Delete
                    </Button>
                )}
                <Button
                    type="button"
                    onClick={() => {
                        setModalOpen(false);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    positive
                    type="submit"
                >
                    {existingEvent ? "Save" : "Create"}
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

EditEventModal.propTypes = {
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
    user: PropTypes.instanceOf(User).isRequired,
    event: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        start: PropTypes.instanceOf(Date),
        duration: PropTypes.number,
        repeat: PropTypes.bool,
        repeatFreq: PropTypes.string,
        repeatUnits: PropTypes.string,
        userId: PropTypes.number,
    }).isRequired,
    modalOpen: PropTypes.bool.isRequired,
    setModalOpen: PropTypes.func.isRequired,
    updatedCalendar: PropTypes.func.isRequired,
    updatedEvent: PropTypes.func.isRequired,
};

export default EditEventModal;
