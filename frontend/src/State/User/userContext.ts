import React from "react"
import {initState, UserAction, UserState} from "./userReducer"

interface UserContext {
    userState: UserState,
    setUser: React.Dispatch<UserAction>
}

const initUserContext: UserContext = {
    userState: initState,
    setUser: null
}

export const userContext = React.createContext<UserContext>(initUserContext)