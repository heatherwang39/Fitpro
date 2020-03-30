export class CalendarEvent {
    constructor({
        id, title, owner, description, client, start, end, workouts, _id,
    }) {
        this.id = id || _id;
        this.title = title;
        this.owner = owner;
        this.description = description;
        this.client = client;
        this.start = start;
        this.end = end;
        this.workouts = workouts || [];
    }
}

export default CalendarEvent;
