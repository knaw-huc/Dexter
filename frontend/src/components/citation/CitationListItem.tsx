import { grey } from '@mui/material/colors';
import { Citation } from '../../model/DexterModel';
import React from 'react';
import { Avatar, ListItemAvatar } from '@mui/material';
import { DeleteIconStyled } from '../common/DeleteIconStyled';
import { CitationIcon } from './CitationIcon';
import { ListItemButtonStyled } from '../common/ListItemButtonStyled';
import { FormattedCitation } from './FormattedCitation';

type SourceListItemProps = {
  citation: Citation;
  onDelete: () => void;
  onEdit: () => void;
};

export const CitationListItem = (props: SourceListItemProps) => {
  function handleDeleted(e: React.MouseEvent) {
    e.stopPropagation();
    props.onDelete();
  }

  function handleClickCitationItem() {
    props.onEdit();
  }

  return (
    <ListItemButtonStyled
      onClick={handleClickCitationItem}
      secondaryAction={
        <div style={{ color: grey[500] }}>
          <DeleteIconStyled onClick={handleDeleted} />
        </div>
      }
      sx={{ ml: 0, pl: 0 }}
    >
      <ListItemAvatar sx={{ ml: '1em' }}>
        <Avatar>
          <CitationIcon iconColor="white" isInline={false} fontSize="small" />
        </Avatar>
      </ListItemAvatar>
      <FormattedCitation citation={props.citation} />
    </ListItemButtonStyled>
  );
};
