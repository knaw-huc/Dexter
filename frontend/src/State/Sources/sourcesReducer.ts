import React from "react"
import { ServerSource } from "../../Model/DexterModel"
import { doGetSources } from "../../Utils/doGetSources"
import { ACTIONS } from "../actions"

export interface SourcesState {
    sources: ServerSource[],
    filteredSources: ServerSource[],
    selectedSource: ServerSource | undefined,
    editSourceMode: boolean,
    toEditSource: ServerSource | undefined
}

export const initState: SourcesState = {
    sources: null,
    filteredSources: null,
    selectedSource: undefined,
    editSourceMode: false,
    toEditSource: undefined
}

interface SetSources {
    type: ACTIONS.SET_SOURCES,
    sources: ServerSource[]
}

interface SetFilteredSources {
    type: ACTIONS.SET_FILTEREDSOURCES,
    filteredSources: ServerSource[]
}

interface SetSelectedSource {
    type: ACTIONS.SET_SELECTEDSOURCE,
    selectedSource: ServerSource
}

interface SetEditSourceMode {
    type: ACTIONS.SET_EDITSOURCEMODE,
    editSourceMode: boolean
}

interface SetToEditSource {
    type: ACTIONS.SET_TOEDITSOURCE,
    toEditSource: ServerSource
}

export type SourcesAction = SetSources | SetFilteredSources | SetSelectedSource | SetEditSourceMode | SetToEditSource

export const useSourcesState = (): [SourcesState, React.Dispatch<SourcesAction>] => {
    const [state, dispatch] = React.useReducer(sourcesReducer, initState)

    React.useEffect(() => {
        doGetSources()
            .then(function (sources) {
                dispatch({
                    type: ACTIONS.SET_SOURCES,
                    sources: sources
                })
            })
    }, [])

    return [state, dispatch]
}

function sourcesReducer(state: SourcesState, action: SourcesAction): SourcesState {
    console.log(action, state)
    switch (action.type) {
        case ACTIONS.SET_SOURCES:
            return setSources(state, action)
        case ACTIONS.SET_FILTEREDSOURCES:
            return setFilteredSources(state, action)
        case ACTIONS.SET_SELECTEDSOURCE:
            return setSelectedSource(state, action)
        case ACTIONS.SET_EDITSOURCEMODE:
            return setEditSourceMode(state, action)
        case ACTIONS.SET_TOEDITSOURCE:
            return setToEditSource(state, action)
        default:
            break
    }

    return state
}

function setSources(state: SourcesState, action: SetSources) {
    return {
        ...state,
        sources: action.sources
    }
}

function setSelectedSource(state: SourcesState, action: SetSelectedSource) {
    return {
        ...state,
        selectedSource: action.selectedSource
    }
}

function setEditSourceMode(state: SourcesState, action: SetEditSourceMode) {
    return {
        ...state,
        editSourceMode: action.editSourceMode
    }
}

function setToEditSource(state: SourcesState, action: SetToEditSource) {
    return {
        ...state,
        toEditSource: action.toEditSource
    }
}

function setFilteredSources(state: SourcesState, action: SetFilteredSources) {
    return {
        ...state,
        filteredSources: action.filteredSources
    }
}