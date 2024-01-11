import styled from "@emotion/styled"
import DeleteIcon from "@mui/icons-material/Delete"
import {red} from "@mui/material/colors"
import {Link} from "react-router-dom"
import {ServerSource} from "../../model/DexterModel"
import {deleteSource} from "../../utils/API"
import React from "react"

type SourceItemProps = {
    sourceId: React.Key;
    source: ServerSource;
    onSelect: (selected: ServerSource | undefined) => void;
    onDelete: () => void
};

const DeleteIconStyled = styled(DeleteIcon)`
  margin-left: 5px;
  color: gray;
  &:hover {
    cursor: pointer;
    color: ${red[700]};
  }
`;

export const SourceLi = (props: SourceItemProps) => {
    const toggleClick = () => {
        props.onSelect(props.source);
    };

    const handleDelete = async (id: string) => {
        const warning = window.confirm(
            "Are you sure you wish to delete this source?"
        );

        if (warning === false) return;

        await deleteSource(id);
        props.onDelete()
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