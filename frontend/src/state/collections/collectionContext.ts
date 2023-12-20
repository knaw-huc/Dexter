import React from "react";
import {
  CollectionsAction,
  CollectionsState,
  initState,
} from "./collectionReducer";

interface CollectionsContext {
  collectionsState: CollectionsState;
  dispatchCollections: React.Dispatch<CollectionsAction>;
}

const initCollectionsContext: CollectionsContext = {
  collectionsState: initState,
  dispatchCollections: null,
};

export const collectionsContext = React.createContext<CollectionsContext>(
  initCollectionsContext
);
