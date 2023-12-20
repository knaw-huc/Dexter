import React, {useContext} from "react"
import {ServerCorpus} from "../../model/DexterModel"
import {Link} from "react-router-dom"
import styled from "@emotion/styled"
import {collectionsContext} from "../../state/collections/collectionContext"
import {Actions} from "../../state/actions"
import DeleteIcon from "@mui/icons-material/Delete"
import {red} from "@mui/material/colors"
import {deleteCollection, getCollections} from "../../utils/API"
import {errorContext} from "../../state/error/errorContext"

type CollectionItemProps = {
  collectionId: React.Key;
  collection: ServerCorpus;
  onSelect: (selected: ServerCorpus | undefined) => void;
};

const DeleteIconStyled = styled(DeleteIcon)`
  margin-left: 5px;
  color: gray;
  &:hover {
    cursor: pointer;
    color: ${red[700]};
  }
`;

export function Collection(props: CollectionItemProps) {
    const { dispatchCollections } = React.useContext(collectionsContext)
    const {dispatchError} = useContext(errorContext)

  const toggleClick = () => {
    props.onSelect(props.collection);
  };

  const handleDelete = async (collection: ServerCorpus) => {
    const warning = window.confirm(
      "Are you sure you wish to delete this corpus?"
    );

    if (warning === false) return;

        await deleteCollection(collection.id)
            .catch(dispatchError);
      getCollections()
            .then(function (collections) {
                dispatchCollections({
                    type: Actions.SET_COLLECTIONS,
                    collections: collections
                })
            }).catch(dispatchError);
    }

  return (
    <>
      <ul>
        <li key={props.collectionId}>
          <Link
            to={`/corpora/${props.collection.id}`}
            key={props.collectionId}
            onClick={toggleClick}
          >
            {props.collection.parentId
              ? props.collection.title + " (" + "subcorpus" + ")"
              : props.collection.title}
          </Link>
          <DeleteIconStyled onClick={() => handleDelete(props.collection)} />
        </li>
      </ul>
    </>
  );
}