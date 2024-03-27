import { ResultCorpus } from '../../model/DexterModel';
import React from 'react';
import { normalize } from '../../utils/normalize';
import { MultiAutocomplete } from '../common/MultiAutocomplete';
import { FieldError } from '../common/error/FieldError';
import { Label } from '../common/Label';
import { FormFieldprops } from '../common/FormFieldProps';

export type SelectSubcorporaFieldProps = FormFieldprops & {
  options: ResultCorpus[];
  selected: ResultCorpus[];
  onSelectCorpus: (corpusId: string) => void;
  onDeselectCorpus: (corpusId: string) => void;
};

export function SelectSubcorporaField(props: SelectSubcorporaFieldProps) {
  function isOptionEqualToValue(option: ResultCorpus, value: ResultCorpus) {
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
      {props.label && <Label>{props.label}</Label>}
      <MultiAutocomplete<ResultCorpus>
        placeholder="Search and select subcorpora"
        selected={props.selected}
        onAutocompleteOptions={handleAutocompleteOptions}
        toStringLabel={option => option.title}
        isOptionEqualToValue={isOptionEqualToValue}
        onAddSelected={option => props.onSelectCorpus(option.id)}
        onRemoveSelected={option => props.onDeselectCorpus(option.id)}
        allowCreatingNew={false}
      />
      <FieldError error={props.error} />
    </>
  );
}
