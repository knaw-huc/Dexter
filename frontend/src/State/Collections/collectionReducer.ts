import React from "react";
import { ServerCorpus } from "../../Model/DexterModel";
import {getCollections} from "../../utils/API"
import { Actions } from "../actions";

export interface CollectionsState {
  collections: ServerCorpus[];
  filteredCollections: ServerCorpus[];
  selectedCollection: ServerCorpus | undefined;
  editColMode: boolean;
  toEditCol: ServerCorpus | undefined;
}

export const initState: CollectionsState = {
  collections: null,
  filteredCollections: null,
  selectedCollection: undefined,
  editColMode: false,
  toEditCol: undefined,
};

interface SetCollections {
  type: Actions.SET_COLLECTIONS;
  collections: ServerCorpus[];
}

interface SetFilteredCollections {
  type: Actions.SET_FILTEREDCOLLECTIONS;
  filteredCollections: ServerCorpus[];
}

interface SetSelectedCollection {
  type: Actions.SET_SELECTEDCOLLECTION;
  selectedCollection: ServerCorpus | undefined;
}

interface SetEditColMode {
  type: Actions.SET_EDITCOLMODE;
  editColMode: boolean;
}

interface SetToEditCol {
  type: Actions.SET_TOEDITCOL;
  toEditCol: ServerCorpus | undefined;
}

export type CollectionsAction =
  | SetCollections
  | SetFilteredCollections
  | SetSelectedCollection
  | SetEditColMode
  | SetToEditCol;

export const useCollectionsState = (): [
  CollectionsState,
  React.Dispatch<CollectionsAction>
] => {
  const [state, dispatch] = React.useReducer(collectionsReducer, initState);

  React.useEffect(() => {
    getCollections().then(function (collections) {
      dispatch({
        type: Actions.SET_COLLECTIONS,
        collections: collections,
      });
    });
  }, []);

  return [state, dispatch];
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
    case Actions.SET_SELECTEDCOLLECTION:
      return setSelectedCollection(state, action);
    case Actions.SET_EDITCOLMODE:
      return setEditColMode(state, action);
    case Actions.SET_TOEDITCOL:
      return setToEditCol(state, action);
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

function setSelectedCollection(
  state: CollectionsState,
  action: SetSelectedCollection
) {
  return {
    ...state,
    selectedCollection: action.selectedCollection,
  };
}

function setEditColMode(state: CollectionsState, action: SetEditColMode) {
  return {
    ...state,
    editColMode: action.editColMode,
  };
}

function setToEditCol(state: CollectionsState, action: SetToEditCol) {
  return {
    ...state,
    toEditCol: action.toEditCol,
  };
}
