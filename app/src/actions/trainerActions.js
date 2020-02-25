import { TRAINER_SELECTED } from "./actionTypes";

export const gotTrainerInfo = (trainerInfo) => ({
    type: TRAINER_SELECTED,
    payload: trainerInfo,
});

export default gotTrainerInfo;
