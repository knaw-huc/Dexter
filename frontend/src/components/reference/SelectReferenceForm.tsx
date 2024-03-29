import React from 'react';
import ScrollableModal from '../common/ScrollableModal';
import {
  SelectReferenceField,
  SelectReferenceFieldProps,
} from './SelectReferenceField';
import { CloseButton } from '../common/CloseButton';

type Props = SelectReferenceFieldProps & {
  onClose: () => void;
};

export function SelectReferenceForm(props: Props) {
  return (
    <ScrollableModal handleClose={props.onClose} fullHeight={false}>
      <SelectReferenceField {...props} />
      <CloseButton onClose={props.onClose} />
    </ScrollableModal>
  );
}
