export class Calendar {
    constructor(events, availability, userId) {
        this.events = events; // TODO sort
        this.availability = availability;
        this.userId = userId;
    }
}

Calendar.fromJSON = (obj) => new Calendar(obj.events, obj.availability, obj.userId);

export default Calendar;
