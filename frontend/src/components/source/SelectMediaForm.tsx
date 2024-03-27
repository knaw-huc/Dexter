import React from 'react';
import ScrollableModal from '../common/ScrollableModal';
import {
  SelectMediaField,
  SelectMediaFieldProps,
} from '../media/SelectMediaField';
import { CloseButton } from '../common/CloseButton';

export type SelectMediaFormProps = SelectMediaFieldProps & {
  onClose: () => void;
};

export function SelectMediaForm(props: SelectMediaFormProps) {
  return (
    <ScrollableModal handleClose={props.onClose} fullHeight={false}>
      <SelectMediaField {...props} />
      <CloseButton onClose={props.onClose} />
    </ScrollableModal>
  );
}
