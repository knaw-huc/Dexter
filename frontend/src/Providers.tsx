import React, {PropsWithChildren, useEffect} from "react"
import {collectionsContext} from "./state/collections/collectionContext"
import {useCollectionsState} from "./state/collections/collectionReducer"
import {sourcesContext} from "./state/sources/sourcesContext"
import {useSourcesState} from "./state/sources/sourcesReducer"
import {useErrorState} from "./state/error/errorReducer"
import {useUserState} from "./state/user/userReducer"
import {errorContext} from "./state/error/errorContext"
import {userContext} from "./state/user/userContext"
import {getCollections, getSources} from "./utils/API"
import {Actions} from "./state/actions"

export const Providers = (props: PropsWithChildren) => {
    const [sourcesState, dispatchSources] = useSourcesState()
    const [collectionsState, dispatchCollections] = useCollectionsState()
    const [errorState, dispatchError] = useErrorState()
    const [userState, dispatchUser] = useUserState()

    useEffect(() => {
        initRemoteDataProviders()

        function initRemoteDataProviders() {
            getCollections()
                .then(function (collections) {
                    dispatchCollections({
                        type: Actions.SET_COLLECTIONS,
                        collections: collections
                    })
                }).catch(dispatchError)

            getSources()
                .then(function (sources) {
                    dispatchSources({
                        type: Actions.SET_SOURCES,
                        sources: sources
                    })
                }).catch(dispatchError)
        }
    }, [])

    return (
        <sourcesContext.Provider value={{sourcesState, dispatchSources}}>
            <collectionsContext.Provider value={{collectionsState, dispatchCollections}}>
                <errorContext.Provider value={{errorState, dispatchError}}>
                    <userContext.Provider value={{userState, dispatchUser}}>
                        {props.children}
                    </userContext.Provider>
                </errorContext.Provider>
            </collectionsContext.Provider>
        </sourcesContext.Provider>
    )
}
