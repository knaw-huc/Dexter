import Button from "@mui/material/Button"
import React, {useContext} from "react"
import {ServerCorpus} from "../..//Model/DexterModel"
import {Actions} from "../../State/actions"
import {collectionsContext} from "../../State/Collections/collectionContext"
import {CollectionItem} from "./CollectionItem"
import {NewCollection} from "./NewCollection"
import styled from "@emotion/styled"
import {errorContext} from "../../State/Error/errorContext"
import {getCollections} from "../API"

const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export function CollectionList() {
  const { collectionsState, collectionsDispatch } =
    useContext(collectionsContext);
  const [showForm, setShowForm] = React.useState(false);
    const {setError} = useContext(errorContext)

  const refetchCollections = () => {
    getCollections().then(function (collections) {
      collectionsDispatch({
        type: Actions.SET_COLLECTIONS,
        collections: collections,
      });
    }).catch(setError);
  };

    const handleSelected = (selected?: ServerCorpus) => {
        return collectionsDispatch({ type: Actions.SET_SELECTEDCOLLECTION, selectedCollection: selected })
    }

  const formShowHandler = () => {
    setShowForm(true);
  };

  const formCloseHandler = () => {
    setShowForm(false);
  };

    return (
        <>
            <FilterRow>
                {/* <FilterBySubject selected={filteredSubject} onChangeFilter={filterChangeHandler} toFilter="Collections" /> */}
                <Button
                    variant="contained"
                    style={{ marginLeft: "10px" }}
                    onClick={formShowHandler}
                >
                    Add new corpus
                </Button>
            </FilterRow>
            {showForm && (
                <NewCollection
                    show={showForm}
                    onClose={formCloseHandler}
                    refetch={refetchCollections}
                />
            )}
            {collectionsState.collections &&
                collectionsState.collections.map(
                    (collection: ServerCorpus, index: number) => (
                        <CollectionItem
                            key={index}
                            collectionId={index}
                            collection={collection}
                            onSelect={handleSelected}
                        />
                    )
                )}
        </>
    );
}
