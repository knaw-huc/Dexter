import React from "react"
import { Collections, Sources } from "../Model/DexterModel"
import { ACTIONS } from "./actions"
import { doGetSources } from "../Utils/doGetSources"
import { doGetCollections } from "../Utils/doGetCollections"

export interface AppState {
    collections: Collections[],
    filteredCollections: Collections[]
    selectedCollection: Collections | undefined,
    editColMode: boolean,
    toEditCol: Collections | undefined,
    sources: Sources[],
    filteredSources: Sources[]
    selectedSource: Sources | undefined,
    editSourceMode: boolean,
    toEditSource: Sources | undefined
}

export const initAppState: AppState = {
    collections: null,
    filteredCollections: null,
    selectedCollection: undefined,
    editColMode: false,
    toEditCol: undefined,
    sources: null,
    filteredSources: null,
    selectedSource: undefined,
    editSourceMode: false,
    toEditSource: undefined
}

interface SetCollections {
    type: ACTIONS.SET_COLLECTIONS,
    collections: Collections[]
}

interface SetFilteredCollections {
    type: ACTIONS.SET_FILTEREDCOLLECTIONS,
    filteredCollections: Collections[]
}

interface SetSelectedCollection {
    type: ACTIONS.SET_SELECTEDCOLLECTION,
    selectedCollection: Collections | undefined
}

interface SetEditColMode {
    type: ACTIONS.SET_EDITCOLMODE,
    editColMode: boolean
}

interface SetToEditCol {
    type: ACTIONS.SET_TOEDITCOL,
    toEditCol: Collections | undefined
}

interface SetSources {
    type: ACTIONS.SET_SOURCES,
    sources: Sources[]
}

interface SetFilteredSources {
    type: ACTIONS.SET_FILTEREDSOURCES,
    filteredSources: Sources[]
}

interface SetSelectedSource {
    type: ACTIONS.SET_SELECTEDSOURCE,
    selectedSource: Sources
}

interface SetEditSourceMode {
    type: ACTIONS.SET_EDITSOURCEMODE,
    editSourceMode: boolean
}

interface SetToEditSource {
    type: ACTIONS.SET_TOEDITSOURCE,
    toEditSource: Sources
}

export type AppAction = SetCollections | SetSelectedCollection | SetEditColMode | SetToEditCol | SetSources | SetSelectedSource | SetEditSourceMode | SetToEditSource | SetFilteredCollections | SetFilteredSources

export function useAppState(): [AppState, React.Dispatch<AppAction>] {
    const [state, dispatch] = React.useReducer(reducer, initAppState)

    React.useEffect(() => {
        doGetCollections()
            .then(function (collections) {
                dispatch({
                    type: ACTIONS.SET_COLLECTIONS,
                    collections: collections
                })
            })

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

function reducer(state: AppState, action: AppAction): AppState {
    console.log(action, state)
    switch (action.type) {
    case ACTIONS.SET_COLLECTIONS:
        return setCollections(state, action)
    case ACTIONS.SET_FILTEREDCOLLECTIONS:
        return setFilteredCollections(state, action)
    case ACTIONS.SET_SELECTEDCOLLECTION:
        return setSelectedCollection(state, action)
    case ACTIONS.SET_EDITCOLMODE:
        return setEditColMode(state, action)
    case ACTIONS.SET_TOEDITCOL:
        return setToEditCol(state, action)
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

function setCollections(state: AppState, action: SetCollections) {
    return {
        ...state,
        collections: action.collections
    }
}

function setSelectedCollection(state: AppState, action: SetSelectedCollection) {
    return {
        ...state,
        selectedCollection: action.selectedCollection
    }
}

function setEditColMode(state: AppState, action: SetEditColMode) {
    return {
        ...state,
        editColMode: action.editColMode
    }
}

function setToEditCol(state: AppState, action: SetToEditCol) {
    return {
        ...state,
        toEditCol: action.toEditCol
    }
}

function setSources(state: AppState, action: SetSources) {
    return {
        ...state,
        sources: action.sources
    }
}

function setSelectedSource(state: AppState, action: SetSelectedSource) {
    return {
        ...state,
        selectedSource: action.selectedSource
    }
}

function setEditSourceMode(state: AppState, action: SetEditSourceMode) {
    return {
        ...state,
        editSourceMode: action.editSourceMode
    }
}

function setToEditSource(state: AppState, action: SetToEditSource) {
    return {
        ...state,
        toEditSource: action.toEditSource
    }
}

function setFilteredCollections(state: AppState, action: SetFilteredCollections) {
    return {
        ...state,
        filteredCollections: action.filteredCollections
    }
}

function setFilteredSources(state: AppState, action: SetFilteredSources) {
    return {
        ...state,
        filteredSources: action.filteredSources
    }
}