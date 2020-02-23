import { User } from "../types/user";
import { Calendar } from "../types/calendar";

export const clientUser = new User(1, "user", "ClientFirst", "ClientLast", "client@mail.com",
    "555-555-1234", "Toronto", "6'0", "200lb", false, false, "goalType", 2.5);
export const trainerUser = new User(2, "user2", "TrainerFirst", "TrainerLast", "trainer@mail.com",
    "555-123-4567", "Toronto", "6'3", "220lb", true, false, "goalType", 4);

const Event = (title, start, end) => ({
    title,
    start,
    end,
});

const Availability = (start, end, repeat) => ({
    start, end, repeat,
});

const clientEvents = [
    Event("Tues Night", new Date("February 18, 2020 21:00:00"), new Date("February 18, 2020 22:00:00")),
    Event("Wed Afternoon", new Date("February 19, 2020 15:00:00"), new Date("February 19, 2020 15:00:00")),
    Event("Thurs Morning", new Date("February 20, 2020 09:00:00"), new Date("February 20, 2020 11:00:00")),
    Event("Sat evening", new Date("February 22, 2020 18:00:00"), new Date("February 22, 2020 20:00:00")),
];

const trainerEvents = [
    Event("Personal Event", new Date("February 22, 2020 21:00:00"), new Date("February 22, 2020 23:00:00")),
];

const trainerAvailability = [
    Availability(new Date("February 22, 2020 21:00:00"), new Date("February 22, 2020 23:00:00"), "weekly"),
];

export const clientCalendar = new Calendar(clientEvents, [], 1);
export const trainerCalendar = new Calendar(trainerEvents, trainerAvailability, 2);
