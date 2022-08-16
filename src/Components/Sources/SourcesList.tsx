import React from "react"
import { Sources } from "../../Model/DexterModel"
import { sourcesContext } from "../../State/Sources/sourcesContext"
import { ACTIONS } from "../../State/actions"
import { SourceItem } from "./SourceItem"
import { NewSource } from "./NewSource"
import { doGetSources } from "../../Utils/doGetSources"
import { FilterBySubject } from "../FilterBySubject"
import Button from "react-bootstrap/Button"

export function SourcesList() {
    const { sourcesState, sourcesDispatch } = React.useContext(sourcesContext)
    const [showForm, setShowForm] = React.useState(false)
    const [filteredSubject, setFilteredSubject] = React.useState("No filter")

    React.useEffect(() => {
        if (sourcesState.sources && filteredSubject != "No filter") {
            const filteredSources = sourcesState.sources.filter((source) => {
                return source.subject === filteredSubject
            })
            console.log(filteredSources)
            sourcesDispatch({
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
                sourcesDispatch({
                    type: ACTIONS.SET_SOURCES,
                    sources: sources
                })
            })
    }

    const handleSelected = (selected: Sources | undefined) => {
        console.log(selected)
        return sourcesDispatch({
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
            {filteredSubject != "No filter" ? sourcesState.filteredSources && sourcesState.filteredSources.map((source: Sources, index: number) => (
                <SourceItem
                    key={index}
                    sourceId={index}
                    source={source}
                    onSelect={handleSelected}
                />
            )) : sourcesState.sources && sourcesState.sources.map((source: Sources, index: number) => (
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