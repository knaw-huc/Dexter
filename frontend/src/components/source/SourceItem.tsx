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

type SourceItemProps = {
    sourceId: React.Key;
    source: Source;
    onDelete: () => void
};

const ListItemStyled = styled(ListItem)`
  &:hover {
    cursor: pointer;
    background: ${grey[100]};
  }
`

const ListItemButtonStyled = styled(ListItem)`
  &:hover {
    background: transparent;
  }
`

export const SourceItem = (props: SourceItemProps) => {
    const navigate = useNavigate()
    const handleSelect = () => {
        navigate(`/sources/${props.source.id}`)
    }

    const handleDelete = async (id: string) => {
        const warning = window.confirm(
            "Are you sure you wish to delete this source?"
        )

        if (warning === false) return

        await deleteSource(id)
        props.onDelete()
    }

    return <ListItemStyled
        secondaryAction={
            <span style={{color: grey[500]}}>
                <EditIconStyled
                    onClick={() => console.log('edit', props.source.id)}
                />
                <DeleteIconStyled
                    onClick={() => handleDelete(props.source.id)}
                />
            </span>
        }
        sx={{ml:0, pl: 0}}
    >
        <ListItemButtonStyled
            onClick={handleSelect}
        >
            <ListItemAvatar>
                <Avatar>
                    <TurnedInOutlinedIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText>
                {props.source.title}
            </ListItemText>
        </ListItemButtonStyled>
    </ListItemStyled>
}