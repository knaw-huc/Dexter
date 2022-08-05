import React from "react"
import { Collections, Sources } from "../Model/DexterModel"
import { ACTIONS } from "./actions"

export interface AppState {
    collections: Collections[],
    selectedCollection: Collections | undefined,
    editColMode: boolean,
    toEditCol: Collections | undefined,
    sources: Sources[]
}

export const initAppState: AppState = {
    collections: null,
    selectedCollection: undefined,
    editColMode: false,
    toEditCol: undefined,
    sources: null
}

interface SetCollections {
    type: ACTIONS.SET_COLLECTIONS,
    collections: Collections[]
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

export type AppAction = SetCollections | SetSelectedCollection | SetEditColMode | SetToEditCol | SetSources

export function useAppState(): [AppState, React.Dispatch<AppAction>] {
    const [state, dispatch] = React.useReducer(reducer, initAppState)

    return [state, dispatch]
}

function reducer(state: AppState, action: AppAction): AppState {
    console.log(action, state)
    switch (action.type) {
    case ACTIONS.SET_COLLECTIONS:
        return setCollections(state, action)
    case ACTIONS.SET_SELECTEDCOLLECTION:
        return setSelectedCollection(state, action)
    case ACTIONS.SET_EDITCOLMODE:
        return setEditColMode(state, action)
    case ACTIONS.SET_TOEDITCOL:
        return setToEditCol(state, action)
    case ACTIONS.SET_SOURCES:
        return setSources(state, action)
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