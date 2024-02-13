import { Autocomplete, Chip, TextField, TextFieldProps } from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React, { useState } from 'react';
import { ResultTag } from '../../model/DexterModel';
import { useDebounce } from '../../utils/useDebounce';
import { createTag, getTagsAutocomplete } from '../../utils/API';
import _ from 'lodash';

interface TagsFieldProps {
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
}

const MIN_AUTOCOMPLETE_LENGTH = 1;
const CREATE_NEW_TAG = 'create-new-tag';

/**
 * Create, link and unlink tags
 */
export const SelectTagField = (props: TagsFieldProps) => {
  const [inputValue, setInputValue] = React.useState('');
  const debouncedInput = useDebounce<string>(inputValue, 250);
  const [autocomplete, setAutocomplete] = useState([]);
  const [loading, setLoading] = React.useState(false);

  function getOptions() {
    const options = [
      ...autocomplete,
      ...props.selected,
      ...(props.options ?? []),
    ];
    const inputIsOption = options.find(o => o.val === inputValue);
    if (props.allowCreatingNew && !inputIsOption) {
      const createCurrentValue = {
        id: CREATE_NEW_TAG,
        val: `Create new tag: ${inputValue}`,
      };
      options.push(createCurrentValue);
    }
    const uniqueOptions = _.uniqBy(options, 'val');
    return uniqueOptions.sort(sortAlphanumeric);
  }

  const handleDeleteTag = (tag: ResultTag) => {
    const newSelected = props.selected.filter(t => t.id !== tag.id);
    props.onChangeSelected(newSelected);
  };

  React.useEffect(() => {
    if (
      !props.useAutocomplete ||
      debouncedInput.length < MIN_AUTOCOMPLETE_LENGTH
    ) {
      return;
    }
    setLoading(true);
    getTagsAutocomplete(debouncedInput).then(t => {
      setAutocomplete(t);
      setLoading(false);
    });
  }, [debouncedInput]);

  function renderInputField(params: TextFieldProps): JSX.Element {
    return (
      <TextField
        {...params}
        placeholder="Filter by tags"
        value={inputValue}
        size={props.size ? props.size : 'medium'}
      />
    );
  }

  async function handleChangeSelected(data: ResultTag[]) {
    const selectedIsNewTag = data.findIndex(t => t.id === CREATE_NEW_TAG);
    if (selectedIsNewTag !== -1) {
      data[selectedIsNewTag] = await createTag({ val: inputValue });
    }
    props.onChangeSelected(data);
  }

  return (
    <Autocomplete
      inputValue={inputValue}
      open={debouncedInput.length >= MIN_AUTOCOMPLETE_LENGTH}
      onInputChange={async (_, value) => {
        setInputValue(value);
      }}
      multiple={true}
      loading={loading}
      id="tags-autocomplete"
      options={getOptions()}
      getOptionLabel={(tag: ResultTag) => tag.val}
      isOptionEqualToValue={(option, value) => option.val === value.val}
      value={props.selected}
      renderInput={renderInputField}
      forcePopupIcon={false}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((tag, index) => (
          <Chip
            key={index}
            label={tag.val}
            {...getTagProps({ index })}
            onDelete={() => {
              handleDeleteTag(tag);
            }}
            size={props.size ? props.size : 'medium'}
          />
        ))
      }
      onChange={(_, data) => handleChangeSelected(data as ResultTag[])}
      renderOption={(props, option, { inputValue }) => {
        const matches = match(option.val, inputValue, {
          insideWords: true,
        });
        const parts = parse(option.val, matches);

        return (
          <li {...props}>
            <div>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{
                    fontWeight: part.highlight ? 700 : 400,
                  }}
                >
                  {part.text}
                </span>
              ))}
            </div>
          </li>
        );
      }}
    />
  );
};

function sortAlphanumeric(s1: ResultTag, s2: ResultTag) {
  return s1.val > s2.val ? 1 : -1;
}
