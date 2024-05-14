import React from 'react';
import { MultiAutocomplete } from '../common/MultiAutocomplete';
import { FormFieldprops } from '../common/FormFieldProps';
import { Label } from '../common/Label';
import { FieldError } from '../common/error/FieldError';
import { useLanguages } from '../../resources/useLanguages';
import { ResultLanguage } from '../../model/Language';

export type LanguagesFieldProps = FormFieldprops & {
  selected: ResultLanguage[];
  onChangeSelected: (selected: ResultLanguage[]) => void;
};

export function SelectLanguagesField(props: LanguagesFieldProps) {
  const { getLanguagesAutocomplete } = useLanguages();

  async function handleAutocompleteOptions(input: string) {
    return await getLanguagesAutocomplete(input);
  }

  function handleAddSelected(o: ResultLanguage) {
    return props.onChangeSelected([...props.selected, o]);
  }

  function handleRemoveSelected(o: ResultLanguage) {
    return props.onChangeSelected(props.selected.filter(s => s.id !== o.id));
  }

  return (
    <>
      {props.label && <Label>{props.label}</Label>}
      <MultiAutocomplete<ResultLanguage>
        placeholder="Search and select languages"
        selected={props.selected}
        onAutocompleteOptions={handleAutocompleteOptions}
        toStringLabel={o => o.refName}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onAddSelected={handleAddSelected}
        onRemoveSelected={handleRemoveSelected}
        allowCreatingNew={false}
      />
      <FieldError error={props.error} />
    </>
  );
}
