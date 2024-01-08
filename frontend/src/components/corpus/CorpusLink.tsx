import React, {useContext} from "react"
import {ServerCorpus} from "../../model/DexterModel"
import {Link, useNavigate} from "react-router-dom"
import styled from "@emotion/styled"
import {collectionsContext} from "../../state/collections/collectionContext"
import {Actions} from "../../state/actions"
import DeleteIcon from "@mui/icons-material/Delete"
import {red} from "@mui/material/colors"
import {deleteCollection, getCollections} from "../../utils/API"
import {errorContext} from "../../state/error/errorContext"
import {Card, CardContent} from "@mui/material"
import {HeaderLink} from "../common/HeaderLink"
import {ClippedP} from "../common/ClippedP"

type CorpusLinkProps = {
    collectionId: React.Key;
    collection: ServerCorpus;
};

const DeleteIconStyled = styled(DeleteIcon)`
  margin-left: 5px;
  color: gray;

  &:hover {
    cursor: pointer;
    color: ${red[700]};
  }
`

export function CorpusLink(props: CorpusLinkProps) {
    const {dispatchCollections} = React.useContext(collectionsContext)
    const {dispatchError} = useContext(errorContext)
    const navigate = useNavigate()
    const handleDelete = async (collection: ServerCorpus) => {
        const warning = window.confirm(
            "Are you sure you wish to delete this corpus?"
        )

        if (warning === false) return

        await deleteCollection(collection.id)
            .catch(dispatchError)
        getCollections()
            .then(function (collections) {
                dispatchCollections({
                    type: Actions.SET_COLLECTIONS,
                    collections: collections
                })
            }).catch(dispatchError)
    }

    return <Card
        style={{height: "100%"}}
    >
        <CardContent
            style={{height: "100%"}}
        >
            <DeleteIconStyled
                style={{float: "right"}}
                onClick={() => handleDelete(props.collection)}
            />
            <HeaderLink
                key={props.collectionId}
                onClick={() => navigate(`/corpora/${props.collection.id}`)}
            >
                {props.collection.parentId
                    ? props.collection.title + " (" + "subcorpus" + ")"
                    : props.collection.title}
            </HeaderLink>
            <ClippedP>{props.collection.description}</ClippedP>
        </CardContent>
    </Card>
}

