import { grey } from '@mui/material/colors';
import { Reference } from '../../model/DexterModel';
import React from 'react';
import { Avatar, ListItemAvatar } from '@mui/material';
import { DeleteIcon } from '../common/icon/DeleteIcon';
import { ReferenceIcon } from './ReferenceIcon';
import { ListItemButtonStyled } from '../common/ListItemButtonStyled';
import { FormattedReference } from './FormattedReference';
import { ReferenceStyle } from './ReferenceStyle';
import { CloseIcon } from '../common/icon/CloseIcon';

type SourceListItemProps = {
  referenceStyle: ReferenceStyle;
  reference: Reference;
  onDelete?: () => void;
  onUnlink?: () => void;
  onEdit: () => void;
  hideIcon?: boolean;
};

export const ReferenceListItem = (props: SourceListItemProps) => {
  function handleDeleted(e: React.MouseEvent) {
    e.stopPropagation();
    props.onDelete();
  }

  function handleUnlink(e: React.MouseEvent) {
    e.stopPropagation();
    props.onUnlink();
  }

  function handleClickReferenceItem() {
    props.onEdit();
  }

  const withIcon = !props.hideIcon;

  return (
    <ListItemButtonStyled
      onClick={handleClickReferenceItem}
      secondaryAction={
        <div style={{ color: grey[500] }}>
          {props.onDelete && <DeleteIcon onClick={handleDeleted} />}
          {props.onUnlink && <CloseIcon onClick={handleUnlink} />}
        </div>
      }
      sx={{ ml: 0, pl: 0 }}
    >
      {withIcon && (
        <ListItemAvatar sx={{ ml: '1em' }}>
          <Avatar>
            <ReferenceIcon
              iconColor="white"
              isInline={false}
              fontSize="small"
            />
          </Avatar>
        </ListItemAvatar>
      )}
      <div style={{ paddingLeft: withIcon ? 0 : '2em' }}>
        <FormattedReference
          reference={props.reference}
          referenceStyle={props.referenceStyle}
        />
      </div>
    </ListItemButtonStyled>
  );
};
