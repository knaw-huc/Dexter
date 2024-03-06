import { ResultSource } from '../../model/DexterModel';
import React from 'react';
import { normalize } from '../../utils/normalize';
import { MultiAutocomplete } from '../common/MultiAutocomplete';
import { FieldError } from '../common/error/FieldError';
import { Label } from '../common/Label';
import { FormFieldprops } from '../common/FormFieldProps';

export type SelectSourcesFieldProps = FormFieldprops & {
  options: ResultSource[];
  selected: ResultSource[];
  onSelectSource: (sourceId: string) => void;
  onDeselectSource: (sourceId: string) => void;
};

export function SelectSourcesField(props: SelectSourcesFieldProps) {
  function isOptionEqualToValue(option: ResultSource, value: ResultSource) {
    return normalize(option.title) === normalize(value.title);
  }

  function handleAutocompleteOptions(inputValue: string) {
    const options = props.options.filter(o =>
      normalize(o.title).includes(normalize(inputValue)),
    );
    return Promise.resolve(options);
  }

  return (
    <>
      <Label>{props.label || 'Select sources'}</Label>
      <MultiAutocomplete<ResultSource>
        placeholder="Search and select sources"
        selected={props.selected}
        onAutocompleteOptions={handleAutocompleteOptions}
        toStringLabel={o => o.title}
        isOptionEqualToValue={isOptionEqualToValue}
        onAddSelected={o => props.onSelectSource(o.id)}
        onRemoveSelected={o => props.onDeselectSource(o.id)}
        allowCreatingNew={false}
      />
      <FieldError error={props.error} />
    </>
  );
}
