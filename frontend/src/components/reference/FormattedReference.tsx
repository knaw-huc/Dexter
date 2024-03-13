import { Reference } from '../../model/DexterModel';
import { ListItemText } from '@mui/material';
import { displayInput } from './displayInput';
import { SpinnerIcon } from '../common/SpinnerIcon';
import React from 'react';

type Props = {
  reference: Reference;
};

export function FormattedReference(props: Props) {
  return (
    <>
      {props.reference.formatted ? (
        <ListItemText>
          <p
            dangerouslySetInnerHTML={{ __html: props.reference.formatted }}
          ></p>
        </ListItemText>
      ) : (
        <ListItemText>
          {displayInput(props.reference)}
          &nbsp;
          <SpinnerIcon />
        </ListItemText>
      )}
    </>
  );
}
