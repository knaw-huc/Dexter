import { ResultSource } from '../../model/DexterModel';
import React from 'react';
import { normalizeInput } from '../../utils/normalizeInput';
import { MultiAutocomplete } from '../common/MultiAutocomplete';

export type SelectSourcesFieldProps = {
  options: ResultSource[];
  selected: ResultSource[];
  onSelectSource: (sourceId: string) => void;
  onDeselectSource: (sourceId: string) => void;
};

export function SelectSourcesField(props: SelectSourcesFieldProps) {
  function isOptionEqualToValue(option: ResultSource, value: ResultSource) {
    return normalizeInput(option.title) === normalizeInput(value.title);
  }

  function handleAutocomplete(inputValue: string) {
    const options = props.options.filter(o =>
      normalizeInput(o.title).includes(normalizeInput(inputValue)),
    );
    return Promise.resolve(options);
  }

  return (
    <MultiAutocomplete<ResultSource>
      placeholder="Search and select sources"
      selected={props.selected}
      onAutocomplete={handleAutocomplete}
      toStringLabel={o => o.title}
      isOptionEqualToValue={isOptionEqualToValue}
      onAddSelected={o => props.onSelectSource(o.id)}
      onRemoveSelected={o => props.onDeselectSource(o.id)}
      allowCreatingNew={false}
    />
  );
}
