import { Autocomplete, Chip, TextField, TextFieldProps } from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React, { useEffect, useState } from 'react';
import { ServerKeyword } from '../../model/DexterModel';
import { useDebounce } from '../../utils/useDebounce';
import { createKeyword, getKeywordsAutocomplete } from '../../utils/API';
import _ from 'lodash';

interface KeywordsFieldProps {
  selected: ServerKeyword[];
  onChangeSelected: (selected: ServerKeyword[]) => void;

  /**
   * Options to select from
   */
  options?: ServerKeyword[];

  /**
   * Should additional options be fetched from autocomplete endpoint?
   */
  useAutocomplete?: boolean;

  /**
   * Should option be shown to create new keyword when not existing?
   */
  allowCreatingNew?: boolean;

  size?: 'small' | 'medium';
}

const MIN_AUTOCOMPLETE_LENGTH = 1;
const CREATE_NEW_KEYWORD = 'create-new-keyword';

/**
 * Create, link and unlink keywords
 */
export const SelectKeywordsField = (props: KeywordsFieldProps) => {
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
        id: CREATE_NEW_KEYWORD,
        val: `Create new keyword: ${inputValue}`,
      };
      options.push(createCurrentValue);
    }
    return _.uniqBy(options, 'val');
  }

  const handleDeleteKeyword = (keyword: ServerKeyword) => {
    const newSelected = props.selected.filter(k => k.id !== keyword.id);
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
    getKeywordsAutocomplete(debouncedInput).then(k => {
      setAutocomplete(k);
      setLoading(false);
    });
  }, [debouncedInput]);

  function renderInputField(params: TextFieldProps): JSX.Element {
    return (
      <TextField
        {...params}
        placeholder="Filter by keywords"
        value={inputValue}
        size={props.size ? props.size : 'medium'}
      />
    );
  }

  async function handleChangeSelected(data: ServerKeyword[]) {
    const selectedIsNewKeyword = data.findIndex(
      k => k.id === CREATE_NEW_KEYWORD,
    );
    if (selectedIsNewKeyword !== -1) {
      data[selectedIsNewKeyword] = await createKeyword({ val: inputValue });
    }
    props.onChangeSelected(data);
  }

  return (
    <Autocomplete
      inputValue={inputValue}
      open={debouncedInput.length >= MIN_AUTOCOMPLETE_LENGTH}
      onInputChange={async (event, value) => {
        setInputValue(value);
      }}
      multiple={true}
      loading={loading}
      id="keywords-autocomplete"
      options={getOptions()}
      getOptionLabel={(keyword: ServerKeyword) => keyword.val}
      isOptionEqualToValue={(option, value) => option.val === value.val}
      value={props.selected}
      renderInput={renderInputField}
      forcePopupIcon={false}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((keyword, index) => (
          <Chip
            key={index}
            label={keyword.val}
            {...getTagProps({ index })}
            onDelete={() => {
              handleDeleteKeyword(keyword);
            }}
            size={props.size ? props.size : 'medium'}
          />
        ))
      }
      onChange={(_, data) => handleChangeSelected(data as ServerKeyword[])}
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

function sortAlphanumeric(s1: ServerKeyword, s2: ServerKeyword) {
  return s1.val > s2.val ? 1 : -1;
}
