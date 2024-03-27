import React from 'react';
import ScrollableModal from '../common/ScrollableModal';
import { SelectCorpusField, SelectCorpusFieldProps } from './SelectCorpusField';
import { CloseButton } from '../common/CloseButton';

export type SelectSourcesFormProps = SelectCorpusFieldProps & {
  onClose: () => void;
};

export function SelectCorpusForm(props: SelectSourcesFormProps) {
  return (
    <ScrollableModal handleClose={props.onClose} fullHeight={false}>
      <SelectCorpusField {...props} />
      <CloseButton onClose={props.onClose} />
    </ScrollableModal>
  );
}
