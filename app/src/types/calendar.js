export class Calendar {
    constructor(events, availability, userId) {
        this.events = events; // TODO sort
        this.availability = availability;
        this.userId = userId;
    }
}

export default Calendar;
