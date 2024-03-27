import React from 'react';
import ScrollableModal from '../common/ScrollableModal';
import {
  SelectSubcorporaField,
  SelectSubcorporaFieldProps,
} from './SelectSubcorporaField';
import { CloseButton } from '../common/CloseButton';

export type SelectSourcesFormProps = SelectSubcorporaFieldProps & {
  onClose: () => void;
};

export function SelectSubcorporaForm(props: SelectSourcesFormProps) {
  return (
    <ScrollableModal handleClose={props.onClose} fullHeight={false}>
      <SelectSubcorporaField {...props} />
      <CloseButton onClose={props.onClose} />
    </ScrollableModal>
  );
}
