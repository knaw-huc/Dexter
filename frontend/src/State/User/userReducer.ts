import React from "react"
import {Actions} from "../actions"

export interface UserState {
    username: string
}

export const initState: UserState = {
    username: ""
}

interface SetUser {
    type: Actions.SET_USER,
    username: string,
}

export type UserAction = SetUser

export const useUserState = (): [UserState, React.Dispatch<UserAction>] => {
    return React.useReducer(collectionsReducer, initState)
}

const collectionsReducer = (state: UserState, action: UserAction): UserState => {
    console.log(action, state)
    switch (action.type) {
    case Actions.SET_USER:
        return setUser(state, action)
    default:
        break
    }
    return state
}

function setUser(state: UserState, action: SetUser): UserState {
    return {...state, ...action}
}
