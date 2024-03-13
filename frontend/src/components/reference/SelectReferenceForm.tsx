import Button from '@mui/material/Button';
import React from 'react';
import ScrollableModal from '../common/ScrollableModal';
import { SelectReferenceField } from './SelectReferenceField';
import { SelectReferenceFieldProps } from './SelectReferenceField';

type Props = SelectReferenceFieldProps & {
  onClose: () => void;
};

export function SelectReferenceForm(props: Props) {
  return (
    <ScrollableModal handleClose={props.onClose} fullHeight={false}>
      <SelectReferenceField {...props} />
      <Button
        variant="contained"
        onClick={props.onClose}
        style={{ marginTop: '1em' }}
      >
        Close
      </Button>
    </ScrollableModal>
  );
}
