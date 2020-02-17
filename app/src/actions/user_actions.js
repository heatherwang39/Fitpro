import { GOT_USER_INFO } from "./action_types";

export const gotUserInfo = (userInfo) => ({
    type: GOT_USER_INFO,
    payload: userInfo,
});

export default gotUserInfo;
