import Button from '@mui/material/Button';
import React from 'react';
import ScrollableModal from '../common/ScrollableModal';
import { SelectCorpusField, SelectCorpusFieldProps } from './SelectCorpusField';

export type SelectSourcesFormProps = SelectCorpusFieldProps & {
  onClose: () => void;
};

export function SelectCorpusForm(props: SelectSourcesFormProps) {
  return (
    <ScrollableModal handleClose={props.onClose} fullHeight={false}>
      <SelectCorpusField {...props} />
      <Button variant="contained" onClick={props.onClose}>
        Close
      </Button>
    </ScrollableModal>
  );
}
