import React from "react"
import { Sources } from "../../Model/DexterModel"
import { appContext } from "../../State/context"
import { ACTIONS } from "../../State/actions"
import { Button } from "react-bootstrap"
import { SourceItem } from "./SourceItem"
import { NewSource } from "./NewSource"
import { doGetSources } from "../../Utils/doGetSources"

export function SourcesList() {
    const { state, dispatch } = React.useContext(appContext)
    const [showForm, setShowForm] = React.useState(false)

    const refetchSources = async () => {
        doGetSources()
            .then(function (sources) {
                dispatch({
                    type: ACTIONS.SET_SOURCES,
                    sources: sources
                })
            })
    }

    const handleSelected = (selected: Sources | undefined) => {
        console.log(selected)
        return dispatch({
            type: ACTIONS.SET_SELECTEDSOURCE,
            selectedSource: selected
        })
    }

    const formShowHandler = () => {
        setShowForm(true)
    }

    const formCloseHandler = () => {
        setShowForm(false)
    }

    return (
        <>
            {showForm && <NewSource show={showForm} onClose={formCloseHandler} refetch={refetchSources} />}
            <Button onClick={formShowHandler}>Add new Source</Button>
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