import React from "react"
import { Collections } from "../../Model/DexterModel"
import { Actions } from "../actions"
import {getCollections} from "../../utils/API"

export interface CollectionsState {
    collections: Collections[],
    filteredCollections: Collections[]
    selectedCollection: Collections | undefined,
    editColMode: boolean,
    toEditCol: Collections | undefined
}

export const initState: CollectionsState = {
    collections: null,
    filteredCollections: null,
    selectedCollection: undefined,
    editColMode: false,
    toEditCol: undefined
}

interface SetCollections {
    type: Actions.SET_COLLECTIONS,
    collections: Collections[]
}

interface SetFilteredCollections {
    type: Actions.SET_FILTEREDCOLLECTIONS,
    filteredCollections: Collections[]
}

interface SetSelectedCollection {
    type: Actions.SET_SELECTEDCOLLECTION,
    selectedCollection: Collections | undefined
}

interface SetEditColMode {
    type: Actions.SET_EDITCOLMODE,
    editColMode: boolean
}

interface SetToEditCol {
    type: Actions.SET_TOEDITCOL,
    toEditCol: Collections | undefined
}

export type CollectionsAction = SetCollections | SetFilteredCollections | SetSelectedCollection | SetEditColMode | SetToEditCol

export const useCollectionsState = (): [CollectionsState, React.Dispatch<CollectionsAction>] => {
    const [state, dispatch] = React.useReducer(collectionsReducer, initState)

    React.useEffect(() => {
        getCollections()
            .then(function (collections) {
                dispatch({
                    type: Actions.SET_COLLECTIONS,
                    collections: collections
                })
            })
    }, [])

    return [state, dispatch]
}

const collectionsReducer = (state: CollectionsState, action: CollectionsAction): CollectionsState => {
    console.log(action,state)
    switch(action.type) {
    case Actions.SET_COLLECTIONS:
        return setCollections(state, action)
    case Actions.SET_FILTEREDCOLLECTIONS:
        return setFilteredCollections(state, action)
    case Actions.SET_SELECTEDCOLLECTION:
        return setSelectedCollection(state, action)
    case Actions.SET_EDITCOLMODE:
        return setEditColMode(state, action)
    case Actions.SET_TOEDITCOL:
        return setToEditCol(state, action)
    default:
        break
    }

    return state
}

function setCollections(state: CollectionsState, action: SetCollections) {
    return {
        ...state,
        collections: action.collections
    }
}

function setFilteredCollections(state: CollectionsState, action: SetFilteredCollections) {
    return {
        ...state,
        filteredCollections: action.filteredCollections
    }
}

function setSelectedCollection(state: CollectionsState, action: SetSelectedCollection) {
    return {
        ...state,
        selectedCollection: action.selectedCollection
    }
}

function setEditColMode(state: CollectionsState, action: SetEditColMode) {
    return {
        ...state,
        editColMode: action.editColMode
    }
}

function setToEditCol(state: CollectionsState, action: SetToEditCol) {
    return {
        ...state,
        toEditCol: action.toEditCol
    }
}