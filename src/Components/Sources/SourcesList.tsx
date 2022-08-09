import React from "react"
import { getSources } from "../API"
import { Sources } from "../../Model/DexterModel"
import { appContext } from "../../State/context"
import { ACTIONS } from "../../State/actions"
// import { Button } from "react-bootstrap"
import { SourceItem } from "./SourceItem"

export function SourcesList() {
    const { state, dispatch } = React.useContext(appContext)

    const doGetSources = React.useCallback(async () => {
        try {
            const result = await getSources()
            dispatch({
                type: ACTIONS.SET_SOURCES,
                sources: result
            })
        } catch (error) {
            console.log(error)
        }
    }, [])

    React.useEffect(() => {
        doGetSources()
    }, [doGetSources])

    const refetchSources = async () => {
        await doGetSources()
    }

    const handleSelected = (selected: Sources | undefined) => {
        console.log(selected)
        return dispatch({
            type: ACTIONS.SET_SELECTEDSOURCE,
            selectedSource: selected
        })
    }

    return (
        <>
            {state.sources ? state.sources.map((source: Sources, index: number) => (
                <SourceItem
                    key={index}
                    sourceId={index}
                    source={source}
                    selected={state.selectedSource?.id === source.id}
                    onSelect={handleSelected}
                    refetch={refetchSources}
                />
            )) : "Loading"}
        </>
    )
}