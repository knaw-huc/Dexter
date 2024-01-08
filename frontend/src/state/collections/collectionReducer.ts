import React from "react";
import { ServerCorpus } from "../../model/DexterModel";
import {getCollections} from "../../utils/API"
import { Actions } from "../actions";

export interface CollectionsState {
  collections: ServerCorpus[];
  filteredCollections: ServerCorpus[];
}

export const initState: CollectionsState = {
  collections: null,
  filteredCollections: null,
};

interface SetCollections {
  type: Actions.SET_COLLECTIONS;
  collections: ServerCorpus[];
}

interface SetFilteredCollections {
  type: Actions.SET_FILTEREDCOLLECTIONS;
  filteredCollections: ServerCorpus[];
}

export type CollectionsAction =
  | SetCollections
  | SetFilteredCollections;

export const useCollectionsState = (): [
  CollectionsState,
  React.Dispatch<CollectionsAction>
] => {
  return React.useReducer(collectionsReducer, initState);
};

const collectionsReducer = (
  state: CollectionsState,
  action: CollectionsAction
): CollectionsState => {
  switch (action.type) {
    case Actions.SET_COLLECTIONS:
      return setCollections(state, action);
    case Actions.SET_FILTEREDCOLLECTIONS:
      return setFilteredCollections(state, action);
    default:
      break;
  }

  return state;
};

function setCollections(state: CollectionsState, action: SetCollections) {
  return {
    ...state,
    collections: action.collections,
  };
}

function setFilteredCollections(
  state: CollectionsState,
  action: SetFilteredCollections
) {
  return {
    ...state,
    filteredCollections: action.filteredCollections,
  };
}
