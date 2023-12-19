import React from "react";
import {
  CollectionsAction,
  CollectionsState,
  initState,
} from "./collectionReducer";

interface CollectionsContext {
  collectionsState: CollectionsState;
  collectionsDispatch: React.Dispatch<CollectionsAction>;
}

const initCollectionsContext: CollectionsContext = {
  collectionsState: initState,
  collectionsDispatch: null,
};

export const collectionsContext = React.createContext<CollectionsContext>(
  initCollectionsContext
);
