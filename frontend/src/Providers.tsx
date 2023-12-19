import React from "react"
import {collectionsContext} from "./State/Collections/collectionContext"
import {useCollectionsState} from "./State/Collections/collectionReducer"
import {sourcesContext} from "./State/Sources/sourcesContext"
import {useSourcesState} from "./State/Sources/sourcesReducer"
import {useErrorState} from "./State/Error/errorReducer"
import {useUserState} from "./State/User/userReducer"
import {errorContext} from "./State/Error/errorContext"
import {userContext} from "./State/User/userContext"

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
