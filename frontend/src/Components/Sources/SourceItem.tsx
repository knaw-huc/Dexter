import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import React, {useContext} from "react"
import { Link } from "react-router-dom";
import { ServerSource } from "../../Model/DexterModel";
import { Actions } from "../../State/actions";
import { sourcesContext } from "../../State/Sources/sourcesContext";
import { deleteSource, getSources } from "../API";
import {errorContext} from "../../State/Error/errorContext"

type SourceItemProps = {
    sourceId: React.Key;
    source: ServerSource;
    onSelect: (selected: ServerSource | undefined) => void;
};

const DeleteIconStyled = styled(DeleteIcon)`
  margin-left: 5px;
  color: gray;
  &:hover {
    cursor: pointer;
    color: ${red[700]};
  }
`;

export const SourceItem = (props: SourceItemProps) => {
    const { setSources } = React.useContext(sourcesContext);
    const {setError} = useContext(errorContext)

    const toggleClick = () => {
        console.log(props.source.id);
        props.onSelect(props.source);
    };

    const handleDelete = async (id: string) => {
        const warning = window.confirm(
            "Are you sure you wish to delete this source?"
        );

        if (warning === false) return;

        await deleteSource(id);
        getSources().then(function (sources) {
            setSources({
                type: Actions.SET_SOURCES,
                sources: sources,
            });
        }).catch(setError);
    };

    return (
        <ul>
            <li key={props.sourceId}>
                <Link
                    to={`/sources/${props.source.id}`}
                    key={props.sourceId}
                    onClick={toggleClick}
                >
                    {props.source.title}
                </Link>
                <DeleteIconStyled onClick={() => handleDelete(props.source.id)} />
            </li>
        </ul>
    );
};