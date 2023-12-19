import React from "react"
import {collectionsContext} from "./state/collections/collectionContext"
import {useCollectionsState} from "./state/collections/collectionReducer"
import {sourcesContext} from "./state/sources/sourcesContext"
import {useSourcesState} from "./state/sources/sourcesReducer"
import {useErrorState} from "./state/error/errorReducer"
import {useUserState} from "./state/user/userReducer"
import {errorContext} from "./state/error/errorContext"
import {userContext} from "./state/user/userContext"

export const Providers = (props: { children: React.ReactNode }) => {
    const [sourcesState, sourcesDispatch] = useSourcesState()
    const [collectionsState, collectionsDispatch] = useCollectionsState()
    const [errorState, setError] = useErrorState()
    const [userState, setUser] = useUserState()

    return (
        <sourcesContext.Provider value={{sources: sourcesState, setSources: sourcesDispatch}}>
            <collectionsContext.Provider value={{collectionsState, collectionsDispatch}}>
                <errorContext.Provider value={{errorState, setError}}>
                    <userContext.Provider value={{userState, setUser}}>
                        {props.children}
                    </userContext.Provider>
                </errorContext.Provider>
            </collectionsContext.Provider>
        </sourcesContext.Provider>
    )
}
