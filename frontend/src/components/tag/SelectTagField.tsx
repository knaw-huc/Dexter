import React from 'react';
import {
  CREATE_NEW_OPTION,
  MultiAutocomplete,
} from '../common/MultiAutocomplete';
import { FormFieldprops } from '../common/FormFieldProps';
import { FieldError } from '../common/error/FieldError';
import { Label } from '../common/Label';
import _ from 'lodash';
import { useTags } from '../../resources/useTags';
import { ResultTag } from '../../model/Tag';

type TagsFieldProps = FormFieldprops & {
  selected: ResultTag[];
  onChangeSelected: (selected: ResultTag[]) => void;

  /**
   * Options to select from
   */
  options?: ResultTag[];

  /**
   * Use autocomplete endpoint to fetch options?
   * Otherwise, use props.options
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
  const { getTagsAutocomplete, createTag } = useTags();

  const handleDeleteTag = (tag: ResultTag) => {
    const newSelected = props.selected.filter(t => t.id !== tag.id);
    props.onChangeSelected(newSelected);
  };

  async function handleAutocompleteOptions(
    inputValue: string,
  ): Promise<ResultTag[]> {
    const options = props.useAutocomplete
      ? await fromAutocomplete(inputValue)
      : fromOptions(inputValue);
    const inputIsOption = options.find(o => o.val === inputValue);
    if (props.allowCreatingNew && !inputIsOption && inputValue) {
      options.push({
        // @ts-expect-error Tag uses numbers as IDs:
        id: CREATE_NEW_OPTION,
        val: `Create new tag: ${inputValue}`,
      });
    }
    return _.sortBy(options, ['val']);
  }

  async function fromAutocomplete(inputValue: string) {
    if (inputValue.length < MIN_AUTOCOMPLETE_LENGTH) {
      return [];
    }
    return getTagsAutocomplete(inputValue);
  }

  function fromOptions(inputValue: string) {
    if (inputValue.length < MIN_AUTOCOMPLETE_LENGTH) {
      return props.options;
    }
    return props.options.filter(o => o.val.includes(inputValue));
  }

  async function handleAddSelected(toAdd: ResultTag) {
    props.onChangeSelected([...props.selected, toAdd]);
  }

  async function handleCreateSelected(_: ResultTag, inputValue: string) {
    return await createTag({ val: inputValue });
  }

  return (
    <>
      {props.label && <Label>{props.label}</Label>}
      <MultiAutocomplete<ResultTag>
        size="small"
        placeholder={props.placeholder ?? 'Add and create tags'}
        selected={props.selected}
        onAutocompleteOptions={handleAutocompleteOptions}
        toStringLabel={o => o.val}
        isOptionEqualToValue={(option, value) => option.val === value.val}
        onAddSelected={handleAddSelected}
        onRemoveSelected={handleDeleteTag}
        allowCreatingNew={props.allowCreatingNew}
        onCreateSelected={handleCreateSelected}
        showSelectedFullWidth={false}
      />
      <FieldError error={props.error} />
    </>
  );
};
