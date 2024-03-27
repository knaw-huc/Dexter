import React from 'react';
import ScrollableModal from '../common/ScrollableModal';
import {
  SelectSourcesField,
  SelectSourcesFieldProps,
} from './SelectSourcesField';
import { CloseButton } from '../common/CloseButton';

export type SelectSourcesFormProps = SelectSourcesFieldProps & {
  onClose: () => void;
};

export function SelectSourcesForm(props: SelectSourcesFormProps) {
  return (
    <ScrollableModal handleClose={props.onClose} fullHeight={false}>
      <SelectSourcesField {...props} />
      <CloseButton onClose={props.onClose} />
    </ScrollableModal>
  );
}
