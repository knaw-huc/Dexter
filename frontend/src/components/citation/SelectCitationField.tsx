import React from 'react';
import { Citation } from '../../model/DexterModel';
import { getCitationAutocomplete } from '../../utils/API';
import { MultiAutocomplete } from '../common/MultiAutocomplete';
import { FormFieldprops } from '../common/FormFieldProps';
import { Label } from '../common/Label';
import { FieldError } from '../common/error/FieldError';
import { CitationStyle } from './CitationStyle';
import { FormattedCitation } from './FormattedCitation';

export type SelectCitationFieldProps = FormFieldprops & {
  selected: Citation[];
  onChangeSelected: (selected: Citation[]) => void;
  citationStyle: CitationStyle;
};

const MIN_AUTOCOMPLETE_LENGTH = 1;

/**
 * Create, link and unlink citation
 */
export const SelectCitationField = (props: SelectCitationFieldProps) => {
  async function handleAutocompleteOptions(
    inputValue: string,
  ): Promise<Citation[]> {
    const canAutocomplete = inputValue.length >= MIN_AUTOCOMPLETE_LENGTH;
    return canAutocomplete ? await getCitationAutocomplete(inputValue) : [];
  }

  function toSelectedLabel(citation: Citation): JSX.Element {
    return <FormattedCitation citation={citation} />;
  }

  function toStringLabel(citation: Citation): string {
    return citation.formatted;
  }

  function handleRemoveSelected(option: Citation) {
    return props.onChangeSelected(
      props.selected.filter(s => s.id !== option.id),
    );
  }

  function handleAddSelected(option: Citation) {
    return props.onChangeSelected([...props.selected, option]);
  }

  return (
    <>
      <Label>{props.label || 'Citation'}</Label>
      <MultiAutocomplete<Citation>
        placeholder="Search and select citations by author, year or title"
        selected={props.selected}
        onAutocompleteOptions={handleAutocompleteOptions}
        toStringLabel={toStringLabel}
        toSelectedLabel={toSelectedLabel}
        isOptionEqualToValue={(option, value) => option.input === value.input}
        onAddSelected={handleAddSelected}
        onRemoveSelected={handleRemoveSelected}
        allowCreatingNew={false}
      />
      <FieldError error={props.error} />
    </>
  );
};
