import { connect } from "react-redux";
import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { PropTypes } from "prop-types";
import {
    Button, Grid, Modal, Paper, Typography,
} from "@material-ui/core";
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Delete } from "@material-ui/icons";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
    getUserCalendar as getUserCalendarAction,
    gotUserCalendar as gotUserCalendarAction,
} from "../../actions/calendarActions";
import { Calendar as CalendarType } from "../../types/calendar";
import API from "../../api";
import "./style.css";

const localizer = momentLocalizer(moment);

const _Calendar = ({ getUserCalendar, gotUserCalendar, calendar }) => {
    // Load Calendar from server
    if (calendar.calendar == null) {
        if (!calendar.gettingCalendar) {
            getUserCalendar(1);
            API.getUserCalendar(1).then((response) => {
                // TODO validate response
                gotUserCalendar(response);
            });
        }
        return (<div className="center">Loading</div>);
    }

    // Local state
    const [currentEvent, setCurrentEvent] = React.useState(null);
    (() => {})(currentEvent); // Shut up eslint, TODO remove this
    const [addOpen, setAddOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [startDate, setStartDate] = React.useState(new Date());

    // Toggles the Add Event modal
    const toggleAddOpen = (event) => {
        setCurrentEvent(event);
        setStartDate(event.start);
        // TODO
        console.log("toggle add", event);
        setAddOpen(!addOpen);
    };

    // Toggles the Edit Event modal
    const toggleEditOpen = (event) => {
        setCurrentEvent(event);
        // TODO
        console.log("toggle edit", event);
        setEditOpen(!editOpen);
    };

    // Modal for adding a new event
    const addModal = () => (
        <Modal open={addOpen} onClose={() => setAddOpen(false)} className="event-modal">
            <Paper>
                <h2 className="event-modal-title"><Typography>Add</Typography></h2>
                <Paper>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
                        <Grid item>
                            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                                <KeyboardDateTimePicker
                                    disableToolbar
                                    variant="inline"
                                    format="DD-MM-YYYY hh:mm"
                                    margin="normal"
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    autoOk
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        {
                            // TODO
                        }
                        <Grid item>
                            <Button>Create</Button>
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
                <h2 className="event-modal-title"><Typography>Edit</Typography></h2>
                <Paper>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
                        {
                            // TODO
                        }
                        <Grid item>
                            <Button>
                                <Delete />
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Paper>
        </Modal>
    );

    return (
        <div className="page">
            <BigCalendar
                localizer={localizer}
                events={calendar.calendar.events}
                selectable
                onSelectSlot={toggleAddOpen}
                onSelectEvent={toggleEditOpen}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
            <div className="event-modal-container">
                {addOpen ? addModal() : (editOpen ? editModal() : null)}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    calendar: state.calendarReducer,
});

const mapDispatchToProps = (dispatch) => ({
    getUserCalendar: (id) => dispatch(getUserCalendarAction(id)),
    gotUserCalendar: (calendar) => dispatch(gotUserCalendarAction(calendar)),
});

_Calendar.propTypes = {
    calendar: PropTypes.shape(
        { calendar: PropTypes.instanceOf(CalendarType), gettingCalendar: PropTypes.bool },
    ).isRequired,
    getUserCalendar: PropTypes.func.isRequired,
    gotUserCalendar: PropTypes.func.isRequired,
};


export const Calendar = connect(mapStateToProps, mapDispatchToProps)(_Calendar);

export default Calendar;
