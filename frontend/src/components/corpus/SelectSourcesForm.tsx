import Button from '@mui/material/Button';
import React from 'react';
import ScrollableModal from '../common/ScrollableModal';
import {
  SelectSourcesField,
  SelectSourcesFieldProps,
} from './SelectSourcesField';

export type SelectSourcesFormProps = SelectSourcesFieldProps & {
  onClose: () => void;
};

export function SelectSourcesForm(props: SelectSourcesFormProps) {
  return (
    <ScrollableModal handleClose={props.onClose} fullHeight={false}>
      <SelectSourcesField {...props} />
      <Button variant="contained" onClick={props.onClose}>
        Close
      </Button>
    </ScrollableModal>
  );
}
