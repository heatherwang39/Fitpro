import { User } from "./types";

export const clientUser = new User(1, "user", "ClientFirst", "ClientLast", "client@mail.com",
    "555-555-1234", "Toronto", "6'0", "200lb", false, false, "goalType", 2.5);
export const trainerUser = new User(2, "user2", "TrainerFirst", "TrainerLast", "trainer@mail.com",
    "555-123-4567", "Toronto", "6'3", "220lb", true, false, "goalType", 4);

export default clientUser;
