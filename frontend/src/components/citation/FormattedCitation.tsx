import { Citation } from '../../model/DexterModel';
import { ListItemText } from '@mui/material';
import { displayInput } from './displayInput';
import { SpinnerIcon } from '../common/SpinnerIcon';
import React from 'react';

type Props = {
  citation: Citation;
};

export function FormattedCitation(props: Props) {
  return (
    <>
      {props.citation.formatted ? (
        <ListItemText>
          <p dangerouslySetInnerHTML={{ __html: props.citation.formatted }}></p>
        </ListItemText>
      ) : (
        <ListItemText>
          {displayInput(props.citation)}
          &nbsp;
          <SpinnerIcon />
        </ListItemText>
      )}
    </>
  );
}
