import Button from '@mui/material/Button';
import React from 'react';
import ScrollableModal from '../common/ScrollableModal';
import { SelectCitationField } from './SelectCitationField';
import { SelectCitationFieldProps } from './SelectCitationField';

type Props = SelectCitationFieldProps & {
  onClose: () => void;
};

export function SelectCitationForm(props: Props) {
  return (
    <ScrollableModal handleClose={props.onClose} fullHeight={false}>
      <SelectCitationField {...props} />
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
