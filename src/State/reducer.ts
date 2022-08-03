import React from "react"
import { Collections } from "../Model/DexterModel"

export interface AppState {
    collections: Collections[],
    selectedCollection: Collections | undefined
}

export const initAppState: AppState = {
    collections: null,
    selectedCollection: undefined
}

interface SetCollections {
    type: "SET_COLLECTIONS",
    collections: Collections[]
}

interface SetSelectedCollection {
    type: "SET_SELECTEDCOLLECTION",
    selectedCollection: Collections | undefined
}

export type AppAction = SetCollections | SetSelectedCollection

export function useAppState(): [AppState, React.Dispatch<AppAction>] {
    const [state, dispatch] = React.useReducer(reducer, initAppState)

    return [state, dispatch]
}

function reducer(state: AppState, action: AppAction): AppState {
    console.log(action, state)
    switch (action.type) {
    case "SET_COLLECTIONS":
        return setCollections(state, action)
    case "SET_SELECTEDCOLLECTION":
        return setSelectedCollection(state, action)
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