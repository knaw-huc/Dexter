import React from "react"

export interface UserState {
    username: string
}

export const initState: UserState = {
    username: ""
}

interface SetUser {
    username: string
}

export type UserAction = SetUser

export const useUserState = (): [UserState, React.Dispatch<UserAction>] => {
    return React.useReducer(collectionsReducer, initState)
}

const collectionsReducer = (state: UserState, action: UserAction): UserState => {
    return setUser(state, action)
}

function setUser(state: UserState, action: SetUser): UserState {
    return {...state, ...action}
}
