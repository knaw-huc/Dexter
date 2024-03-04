import React from 'react';
import { ResultLanguage } from '../../model/DexterModel';
import { getLanguagesAutocomplete } from '../../utils/API';
import { MultiAutocomplete } from '../common/MultiAutocomplete';

export type LanguagesFieldProps = {
  selected: ResultLanguage[];
  onChangeSelected: (selected: ResultLanguage[]) => void;
};

export function LanguagesField(props: LanguagesFieldProps) {
  async function handleAutocomplete(input: string) {
    return await getLanguagesAutocomplete(input);
  }

  function handleAddSelected(o: ResultLanguage) {
    return props.onChangeSelected([...props.selected, o]);
  }

  function handleRemoveSelected(o: ResultLanguage) {
    return props.onChangeSelected(props.selected.filter(s => s.id !== o.id));
  }

  return (
    <MultiAutocomplete<ResultLanguage>
      placeholder="Search and select languages"
      selected={props.selected}
      onAutocomplete={handleAutocomplete}
      toStringLabel={o => o.refName}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onAddSelected={handleAddSelected}
      onRemoveSelected={handleRemoveSelected}
      allowCreatingNew={false}
    />
  );
}
