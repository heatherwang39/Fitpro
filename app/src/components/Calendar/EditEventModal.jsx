import React from "react";
import { PropTypes } from "prop-types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    Button, Dropdown, Form, Input, Label, Modal, Checkbox,
} from "semantic-ui-react";
import DatePicker from "react-datepicker";
import TimeInput from "material-ui-time-picker";
import { CalendarEvent, User } from "../../types";
import API from "../../api/api";
import "react-datepicker/dist/react-datepicker.css";

const TIME_REGEX = /^(\d?\d):(\d\d) (am|pm)$/;

// List of clients by name to be used in Dropdown
// Includes current user as top option
const clientCalendarOptions = (user) => {
    const items = user.clients
        ? user.clients.map(
            (c) => ({
                key: c._id,
                text: `${c.firstname} ${c.lastname}`,
                value: c._id,
            }),
        )
        : [];
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
    user, event, modalOpen, setModalOpen, updatedEvent,
}) => {
    const [repeat, setRepeat] = React.useState(event.repeat === undefined ? false : event.repeat);
    const [duration, setDuration] = React.useState(event.end && event.end !== event.start
        ? Math.floor((Math.abs(event.end - event.start) / 1000) / 60).toString() // Minutes
        : 60);
    const [startDate, setStartDate] = React.useState(event.start);
    const [formErrors, setFormErrors] = React.useState([]);
    const [selectedClient, setSelectedClient] = React.useState(event.client);

    React.useEffect(() => {
        setRepeat(event.repeat === undefined ? false : event.repeat);
        setStartDate(event.start);
        setSelectedClient(event.client ? event.client.toString() : null);
    }, [event]);

    if (!modalOpen) return (<div />);

    const existingEvent = event.id !== undefined;

    // Returns an Object representing the errors in the target form
    const getFormErrors = (target) => {
        const errors = {};
        // Duration
        if (duration === 0) errors.duration = true;
        // Date
        if (startDate < Date.now() || target.date.value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/) === null) errors.date = true;
        // Time
        if (target.time.value.match(TIME_REGEX) === null) errors.time = true;
        // Repeat
        if (target.repeat.checked) {
            if (target.repeatFreq.value === "") errors.repeatFreq = true;
            if (target.repeatUnits.value === "") errors.repeatUnits = true;
        }
        // Client
        if (selectedClient === "") errors.client = false;
        return errors;
    };

    const eventFromForm = (target) => {
        const newEvent = {
            ...event, title: target.title.value, start: startDate, repeat, client: selectedClient,
        };
        const timeMatch = target.time.value.match(TIME_REGEX);
        newEvent.start.setHours(timeMatch[3] === "pm" && timeMatch[1] !== "12"
            ? parseInt(timeMatch[1], 10) + 12 : parseInt(timeMatch[1], 10));
        newEvent.start.setMinutes(parseInt(timeMatch[2], 10));
        newEvent.end = new Date(newEvent.start.getTime() + duration * 60000);
        if (repeat) {
            newEvent.repeatFreq = target.repeatFreq.value;
            newEvent.repeatUnits = target.repeatUnits.value;
        }
        return newEvent;
    };

    const submitForm = (e) => {
        e.preventDefault();
        const errors = getFormErrors(e.target);
        setFormErrors(errors);
        if (Object.entries(errors).length !== 0) return;
        const newEvent = eventFromForm(e.target);
        console.log("new", newEvent);
        API.createEvent(newEvent).then(
            (response) => {
                if (!response.success) {
                    console.log("Error creating event. Got response", response);
                }
                updatedEvent({ event: new CalendarEvent(response.event), deleted: false });
                setModalOpen(false);
            },
        );
    };

    const deleteEvent = () => {
        API.deleteEvent(event).then(
            (response) => {
                if (!response.success) {
                    console.log("Error deleting event. Got response ", response);
                    return;
                }
                updatedEvent({ event: response.event, deleted: true });
                setModalOpen(false);
            },
        );
    };

    const clientOptions = clientCalendarOptions(user);

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
                        id="title"
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
                        id="date"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        minDate={Date.now()}
                        required
                        error={formErrors.date}
                    />
                    <TimeInput
                        id="time"
                        mode="12h"
                        initialTime={event.start}
                        autoOk
                        required
                        error={formErrors.time}
                    />
                    <Input
                        id="duration"
                        type="text"
                        defaultValue={duration}
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
                        id="repeat"
                        checked={repeat}
                        onChange={() => setRepeat(!repeat)}
                    />
                        &nbsp;Repeat every&nbsp;
                    <Input
                        id="repeatFreq"
                        defaultValue={event.repeatFreq}
                        disabled={!repeat}
                        error={formErrors.repeatFreq}
                    />
                    <Dropdown
                        id="repeatUnits"
                        inline
                        selection
                        options={repeatUnitOptions}
                        disabled={!repeat}
                        error={formErrors.repeatUnits}
                    />
                </Form.Group>
                {user.isTrainer && user.clients.length > 0 && (
                    <Form.Group inline>
                        For&nbsp;
                        <Dropdown
                            id="for"
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
            myEvents: PropTypes.arrayOf(PropTypes.instanceOf(CalendarEvent)),
            gettingCalendar: PropTypes.bool,
            clientEvents: PropTypes.object,
            clientEventsList: PropTypes.arrayOf(PropTypes.object),
        },
    ).isRequired,
    user: PropTypes.instanceOf(User).isRequired,
    event: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    setModalOpen: PropTypes.func.isRequired,
    updatedEvent: PropTypes.func.isRequired,
};

export default EditEventModal;
