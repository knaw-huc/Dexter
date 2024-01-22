import React, {PropsWithChildren} from "react"
import {useErrorState} from "./state/error/errorReducer"
import {useUserState} from "./state/user/userReducer"
import {errorContext} from "./state/error/errorContext"
import {userContext} from "./state/user/userContext"

export const Providers = (props: PropsWithChildren) => {
    const [errorState, dispatchError] = useErrorState()
    const [userState, dispatchUser] = useUserState()

    return <errorContext.Provider value={{errorState, dispatchError}}>
        <userContext.Provider value={{userState, dispatchUser}}>
            {props.children}
        </userContext.Provider>
    </errorContext.Provider>
}
