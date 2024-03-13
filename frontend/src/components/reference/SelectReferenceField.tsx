import React, { useState } from 'react';
import { Reference } from '../../model/DexterModel';
import { getReferenceAutocomplete } from '../../utils/API';
import { MultiAutocomplete } from '../common/MultiAutocomplete';
import { FormFieldprops } from '../common/FormFieldProps';
import { Label } from '../common/Label';
import { FieldError } from '../common/error/FieldError';
import { ReferenceStyle } from './ReferenceStyle';
import { FormattedReference } from './FormattedReference';

export type SelectReferenceFieldProps = FormFieldprops & {
  selected: Reference[];
  onChangeSelected: (selected: Reference[]) => void;
  referenceStyle: ReferenceStyle;
};

const MIN_AUTOCOMPLETE_LENGTH = 1;

/**
 * Create, link and unlink reference
 */
export const SelectReferenceField = (props: SelectReferenceFieldProps) => {
  const [domParser] = useState<DOMParser>(new DOMParser());
  async function handleAutocompleteOptions(
    inputValue: string,
  ): Promise<Reference[]> {
    const canAutocomplete = inputValue.length >= MIN_AUTOCOMPLETE_LENGTH;
    return canAutocomplete ? await getReferenceAutocomplete(inputValue) : [];
  }

  function toSelectedLabel(reference: Reference): JSX.Element {
    return <FormattedReference reference={reference} />;
  }

  function toStringLabel(reference: Reference): string {
    const parsed = domParser.parseFromString(reference.formatted, 'text/html');
    return parsed.body.innerText || parsed.body.textContent;
  }

  function handleRemoveSelected(option: Reference) {
    return props.onChangeSelected(
      props.selected.filter(s => s.id !== option.id),
    );
  }

  function handleAddSelected(option: Reference) {
    return props.onChangeSelected([...props.selected, option]);
  }

  return (
    <>
      <Label>{props.label || 'Reference'}</Label>
      <MultiAutocomplete<Reference>
        placeholder="Search and select references by author, year or title"
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
