import { grey } from '@mui/material/colors';
import { FormattedCitation, ResultCitation } from '../../model/DexterModel';
import React, { useEffect, useState } from 'react';
import { Avatar, ListItemAvatar, ListItemText } from '@mui/material';
import { DeleteIconStyled } from '../common/DeleteIconStyled';
import { CitationIcon } from './CitationIcon';
import { ListItemButtonStyled } from '../common/ListItemButtonStyled';
import { formatCitation } from './formatCitation';
import { CitationStyle } from './CitationStyle';
import { SpinnerIcon } from '../common/SpinnerIcon';
import _ from 'lodash';

type SourceListItemProps = {
  citation: ResultCitation | FormattedCitation;
  onDelete: () => void;
  onEdit: () => void;
};

export const CitationListItem = (props: SourceListItemProps) => {
  const [formatted, setFormatted] = useState<string>();

  useEffect(() => {
    formatCitation(props.citation.input, CitationStyle.apa)
      .then(setFormatted)
      .catch(() => setFormatted(displayInput(props.citation)));
  }, []);

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
      {formatted ? (
        <ListItemText>
          <p dangerouslySetInnerHTML={{ __html: formatted }}></p>
        </ListItemText>
      ) : (
        <ListItemText>
          {displayInput(props.citation)}
          &nbsp;
          <SpinnerIcon />
        </ListItemText>
      )}
    </ListItemButtonStyled>
  );
};

function displayInput(citation: ResultCitation) {
  if (!citation?.input) {
    return '';
  }
  return _.truncate(citation.input, { length: 70 });
}
