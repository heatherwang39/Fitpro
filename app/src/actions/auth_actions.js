import { LOGIN_USER } from './action_types'

export const loginUser = user => ({
    type: LOGIN_USER,
    payload: user
})