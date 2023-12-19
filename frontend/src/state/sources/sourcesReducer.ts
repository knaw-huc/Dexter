import React, {useContext} from "react"
import {ServerSource} from "../../model/DexterModel"
import {Actions} from "../actions"
import {getSources} from "../../utils/API"
import {errorContext} from "../error/errorContext"

export interface SourcesState {
    sources: ServerSource[];
    filteredSources: ServerSource[];
    selectedSource: ServerSource | undefined;
    editSourceMode: boolean;
    toEditSource: ServerSource | undefined;
}

export const initState: SourcesState = {
    sources: null,
    filteredSources: null,
    selectedSource: undefined,
    editSourceMode: false,
    toEditSource: undefined,
}

interface SetSources {
    type: Actions.SET_SOURCES,
    sources: ServerSource[]
}

interface SetFilteredSources {
    type: Actions.SET_FILTEREDSOURCES,
    filteredSources: ServerSource[]
}

interface SetSelectedSource {
    type: Actions.SET_SELECTEDSOURCE,
    selectedSource: ServerSource
}

interface SetEditSourceMode {
    type: Actions.SET_EDITSOURCEMODE,
    editSourceMode: boolean
}

interface SetToEditSource {
    type: Actions.SET_TOEDITSOURCE,
    toEditSource: ServerSource
}

export type SourcesAction =
    | SetSources
    | SetFilteredSources
    | SetSelectedSource
    | SetEditSourceMode
    | SetToEditSource;

export const useSourcesState = (): [
    SourcesState,
    React.Dispatch<SourcesAction>
] => {
    return React.useReducer(sourcesReducer, initState)
};

function sourcesReducer(
    state: SourcesState,
    action: SourcesAction
): SourcesState {
    console.log(action, state);
    switch (action.type) {
    case Actions.SET_SOURCES:
        return setSources(state, action);
    case Actions.SET_FILTEREDSOURCES:
        return setFilteredSources(state, action);
    case Actions.SET_SELECTEDSOURCE:
        return setSelectedSource(state, action);
    case Actions.SET_EDITSOURCEMODE:
        return setEditSourceMode(state, action);
    case Actions.SET_TOEDITSOURCE:
        return setToEditSource(state, action);
    default:
        break;
    }

    return state;
}

function setSources(state: SourcesState, action: SetSources) {
  return {
    ...state,
    sources: action.sources,
  };
}

function setSelectedSource(state: SourcesState, action: SetSelectedSource) {
  return {
    ...state,
    selectedSource: action.selectedSource,
  };
}

function setEditSourceMode(state: SourcesState, action: SetEditSourceMode) {
  return {
    ...state,
    editSourceMode: action.editSourceMode,
  };
}

function setToEditSource(state: SourcesState, action: SetToEditSource) {
  return {
    ...state,
    toEditSource: action.toEditSource,
  };
}

function setFilteredSources(state: SourcesState, action: SetFilteredSources) {
  return {
    ...state,
    filteredSources: action.filteredSources,
  };
}
