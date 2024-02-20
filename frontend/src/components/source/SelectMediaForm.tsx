import Button from '@mui/material/Button';
import React from 'react';
import ScrollableModal from '../common/ScrollableModal';
import {
  SelectMediaField,
  SelectMediaFieldProps,
} from '../media/SelectMediaField';

export type SelectMediaFormProps = SelectMediaFieldProps & {
  onClose: () => void;
};

export function SelectMediaForm(props: SelectMediaFormProps) {
  return (
    <ScrollableModal show={true} handleClose={props.onClose} fullHeight={false}>
      <SelectMediaField {...props} />
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
