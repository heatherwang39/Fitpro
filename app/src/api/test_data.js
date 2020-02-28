import { User } from "../types/user";
import { Calendar } from "../types/calendar";

export const clientUser = new User(1, "user", "ClientFirst", "ClientLast", "client@mail.com",
    "555-555-1234", "Toronto", "6'0", "200lb", false, false, "goalType", 2.5, [2]);
export const trainerUser = new User(2, "user2", "TrainerFirst", "TrainerLast", "trainer@mail.com",
    "555-123-4567", "Toronto", "6'3", "220lb", true, false, "goalType", 4, []);
export const client2User = new User(1, "user3", "Client2First", "Client2Last", "client2@mail.com",
    "555-555-4321", "Toronto", "6'1", "190lb", false, false, "goalType", 3.5, [2]);

export const trainerUser1 = new User(11, "user11", "Jamie", "Doe", "trainer11@mail.com",
    "555-123-4544", "Toronto", "6'3", "230lb", true, false, "goalType", 4.5, []);
export const trainerUser2 = new User(12, "user12", "Mika", "Doe", "trainer12@mail.com",
    "555-123-4555", "Toronto", "6'2", "220lb", true, false, "goalType", 4.0, []);
export const trainerUser3 = new User(13, "user13", "Andy", "Doe", "trainer13@mail.com",
    "555-123-4566", "Toronto", "6'1", "210lb", true, false, "goalType", 3.5, []);
export const trainerUser4 = new User(14, "user14", "Ivy", "Doe", "trainer14@mail.com",
    "555-123-4577", "Toronto", "6'0", "200lb", true, false, "goalType", 3.0, []);


const Event = (title, start, end, userId) => ({
    title,
    start,
    end,
    userId,
});

const Availability = (start, end, userId, repeat) => ({
    start, end, userId, repeat,
});

const clientEvents = [
    Event("Tues Night", new Date("February 18, 2020 21:00:00"), new Date("February 18, 2020 22:00:00"), 1),
    Event("Wed Afternoon", new Date("February 19, 2020 15:00:00"), new Date("February 19, 2020 15:00:00"), 1),
    Event("Thurs Morning", new Date("February 20, 2020 09:00:00"), new Date("February 20, 2020 11:00:00"), 1),
    Event("Sat evening", new Date("February 22, 2020 18:00:00"), new Date("February 22, 2020 20:00:00"), 1),
];

const client2Events = [
    Event("Wed Night", new Date("February 19, 2020 21:00:00"), new Date("February 19, 2020 22:00:00"), 3),
    Event("Thurs Morning", new Date("February 20, 2020 11:00:00"), new Date("February 20, 2020 12:00:00"), 3),
    Event("Sun evening", new Date("February 23, 2020 18:00:00"), new Date("February 23, 2020 20:00:00"), 3),
];

const trainerEvents = [
    Event("Personal Event", new Date("February 22, 2020 21:00:00"), new Date("February 22, 2020 23:00:00"), 2),
];

const trainerAvailability = [
    Availability(new Date("February 22, 2020 21:00:00"), new Date("February 22, 2020 23:00:00"), 2, "weekly"),
];

export const clientCalendar = new Calendar(clientEvents, [], 1);
export const trainerCalendar = new Calendar(trainerEvents, trainerAvailability, 2);
export const client2Calendar = new Calendar(client2Events, [], 3);
