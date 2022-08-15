import React from "react"
import { Sources } from "../../Model/DexterModel"
import { appContext } from "../../State/context"
import { ACTIONS } from "../../State/actions"
import { SourceItem } from "./SourceItem"
import { NewSource } from "./NewSource"
import { doGetSources } from "../../Utils/doGetSources"
import { FilterBySubject } from "../FilterBySubject"
import Button from "react-bootstrap/Button"

export function SourcesList() {
    const { state, dispatch } = React.useContext(appContext)
    const [showForm, setShowForm] = React.useState(false)
    const [filteredSubject, setFilteredSubject] = React.useState("No filter")

    React.useEffect(() => {
        if (state.sources && filteredSubject != "No filter") {
            const filteredSources = state.sources.filter((source) => {
                return source.subject === filteredSubject
            })
            console.log(filteredSources)
            dispatch({
                type: ACTIONS.SET_FILTEREDSOURCES,
                filteredSources: filteredSources
            })
        } else {
            return
        }
    }, [filteredSubject])

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

    const filterChangeHandler = (selectedSubject: string) => {
        setFilteredSubject(selectedSubject)
    }

    return (
        <>
            <FilterBySubject selected={filteredSubject} onChangeFilter={filterChangeHandler} toFilter="Sources" />
            {showForm && <NewSource show={showForm} onClose={formCloseHandler} refetch={refetchSources} />}
            <Button onClick={formShowHandler}>Add new source</Button> 
            {filteredSubject != "No filter" ? state.filteredSources && state.filteredSources.map((source: Sources, index: number) => (
                <SourceItem
                    key={index}
                    sourceId={index}
                    source={source}
                    onSelect={handleSelected}
                />
            )) : state.sources && state.sources.map((source: Sources, index: number) => (
                <SourceItem
                    key={index}
                    sourceId={index}
                    source={source}
                    onSelect={handleSelected}
                />
            ))}
        </>
    )
}