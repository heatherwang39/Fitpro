export class CalendarEvent {
    constructor({
        title, owner, description, client, start, end, workouts,
    }) {
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
