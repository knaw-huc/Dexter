import { Reference } from '../../model/DexterModel';
import { ListItemText } from '@mui/material';
import React from 'react';
import { formatReference } from './formatReference';
import { ReferenceStyle } from './ReferenceStyle';

type Props = {
  reference: Reference;
  referenceStyle: ReferenceStyle;
};

export function FormattedReference(props: Props) {
  return (
    <>
      {props.reference.csl ? (
        <ListItemText>
          <p
            dangerouslySetInnerHTML={{
              __html: formatReference(
                props.reference.csl,
                props.referenceStyle,
              ),
            }}
          ></p>
        </ListItemText>
      ) : (
        <ListItemText>{props.reference.input}</ListItemText>
      )}
    </>
  );
}
