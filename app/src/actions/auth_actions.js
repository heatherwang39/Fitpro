import { LOGIN_USER } from './action_types'

/* 
User = { username: STRING, password: STRING }
*/
export const loginUser = user => ({
    type: LOGIN_USER,
    payload: user
})