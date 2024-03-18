import React from 'react';
import { ResultTag } from '../../model/DexterModel';
import { createTag, getTagsAutocomplete } from '../../utils/API';
import {
  CREATE_NEW_OPTION,
  MultiAutocomplete,
} from '../common/MultiAutocomplete';
import { FormFieldprops } from '../common/FormFieldProps';
import { FieldError } from '../common/error/FieldError';
import { Label } from '../common/Label';
import _ from 'lodash';

type TagsFieldProps = FormFieldprops & {
  selected: ResultTag[];
  onChangeSelected: (selected: ResultTag[]) => void;

  /**
   * Options to select from
   */
  options?: ResultTag[];

  /**
   * Should additional options be fetched from autocomplete endpoint?
   */
  useAutocomplete?: boolean;

  /**
   * Should option be shown to create new tag when not existing?
   */
  allowCreatingNew?: boolean;

  size?: 'small' | 'medium';

  placeholder?: string;
};

const MIN_AUTOCOMPLETE_LENGTH = 1;

/**
 * Create, link and unlink tags
 */
export const SelectTagField = (props: TagsFieldProps) => {
  const handleDeleteTag = (tag: ResultTag) => {
    const newSelected = props.selected.filter(t => t.id !== tag.id);
    props.onChangeSelected(newSelected);
  };

  async function handleAutocompleteOptions(
    inputValue: string,
  ): Promise<ResultTag[]> {
    if (inputValue.length < MIN_AUTOCOMPLETE_LENGTH) {
      return [];
    }
    const options = !props.useAutocomplete
      ? props.options.filter(o => o.val.includes(inputValue))
      : await getTagsAutocomplete(inputValue);
    const inputIsOption = options.find(o => o.val === inputValue);
    if (props.allowCreatingNew && !inputIsOption) {
      options.push({
        id: CREATE_NEW_OPTION,
        val: `Create new tag: ${inputValue}`,
      });
    }
    return _.sortBy(options, ['val']);
  }

  async function handleAddSelected(toAdd: ResultTag) {
    props.onChangeSelected([...props.selected, toAdd]);
  }

  async function handleCreateSelected(_: ResultTag, inputValue: string) {
    return await createTag({ val: inputValue });
  }

  return (
    <>
      <Label>{props.label || 'Tags'}</Label>
      <MultiAutocomplete<ResultTag>
        placeholder="Add and create tags"
        selected={props.selected}
        onAutocompleteOptions={handleAutocompleteOptions}
        toStringLabel={o => o.val}
        isOptionEqualToValue={(option, value) => option.val === value.val}
        onAddSelected={handleAddSelected}
        onRemoveSelected={handleDeleteTag}
        allowCreatingNew={props.allowCreatingNew}
        onCreateSelected={handleCreateSelected}
      />
      <FieldError error={props.error} />
    </>
  );
};
