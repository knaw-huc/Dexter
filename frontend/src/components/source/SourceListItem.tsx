import styled from "@emotion/styled"
import {grey} from "@mui/material/colors"
import {Source} from "../../model/DexterModel"
import {deleteSource} from "../../utils/API"
import React from "react"
import {Avatar, ListItem, ListItemAvatar, ListItemText} from "@mui/material"
import TurnedInOutlinedIcon from "@mui/icons-material/TurnedInOutlined"
import {useNavigate} from "react-router-dom"
import {EditIconStyled} from "../common/EditButton"
import {DeleteIconStyled} from "../common/DeleteIconStyled"
import {SourceIcon} from "./SourceIcon"

type SourceItemProps = {
    source: Source;
    onDelete: () => void,
    onEdit: () => void
};

const ListItemButtonStyled = styled(ListItem)`
  &:hover {
    cursor: pointer;
    background: ${grey[100]};
  }
`

export const SourceListItem = (props: SourceItemProps) => {
    const navigate = useNavigate()

    function handleSelect() {
        navigate(`/sources/${props.source.id}`)
    }

    function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();
        const warning = window.confirm(
            "Are you sure you wish to delete this source?"
        )

        if (warning === false) return

        deleteSource(props.source.id).then(() => props.onDelete())
        props.onDelete()
    }

    function handleEdit(e: MouseEvent) {
        e.stopPropagation()
        props.onEdit()
    }

    return <ListItemButtonStyled
        onClick={handleSelect}
        secondaryAction={
            <span style={{color: grey[500]}}>
                <EditIconStyled
                    hoverColor="black"
                    onClick={handleEdit}
                />
                <DeleteIconStyled
                    onClick={handleDelete}
                />
            </span>
        }
        sx={{ml: 0, pl: 0}}
    >
        <ListItemAvatar
            sx={{ml: "1em"}}
        >
            <Avatar>
                <SourceIcon
                    iconColor="white"
                    isInline={false}
                    filled={true}
                />
            </Avatar>
        </ListItemAvatar>
        <ListItemText>
            {props.source.title}
        </ListItemText>
    </ListItemButtonStyled>
}
