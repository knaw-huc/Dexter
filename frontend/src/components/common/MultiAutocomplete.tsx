import { Autocomplete, Chip, TextField, TextFieldProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '../../utils/useDebounce';
import { HighlightedLabel } from './HighlightedLabel';
import { AutocompleteRenderGetTagProps } from '@mui/material/Autocomplete/Autocomplete';
import { WithId } from '../../model/DexterModel';
import _ from 'lodash';

export type MultiAutocompleteProps<T> = {
  placeholder: string;
  selected: T[];
  onAutocompleteOptions: (inputValue: string) => Promise<T[]>;
  toStringLabel: (o: T) => string;
  toSelectedLabel?: (o: T) => JSX.Element;
  isOptionEqualToValue: (option: T, value: T) => boolean;
  onRemoveSelected: (selected: T) => void;
  onAddSelected: (selected: T) => void;

  /**
   * Create new when option with id {@link CREATE_NEW_OPTION} is selected:
   */
  allowCreatingNew: boolean;

  /**
   * Only needed when allowCreatingNew:
   */
  onCreateSelected?: (selected: T, inputValue: string) => Promise<T>;
};

export const CREATE_NEW_OPTION = 'create-new-option';

export function MultiAutocomplete<T extends WithId>(
  props: MultiAutocompleteProps<T>,
) {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const debouncedInput = useDebounce<string>(inputValue, 250);

  useEffect(() => {
    setLoading(true);
  }, [inputValue]);

  useEffect(() => {
    props.onAutocompleteOptions(debouncedInput).then(update => {
      const withSelected = [...props.selected, ...update];
      const unique = _.uniqWith(withSelected, props.isOptionEqualToValue);
      setOptions(unique);
      setLoading(false);
    });
  }, [debouncedInput]);

  async function handleRemoveSelected(selected: T) {
    props.onRemoveSelected(selected);
  }

  function removeSelected(options: T[]) {
    return options.filter(o => !props.selected.find(s => s.id === o.id));
  }

  async function handleChangeSelected(selected: T[]) {
    let update = selected.at(-1) as T;
    if (!update) {
      return;
    }
    if (props.allowCreatingNew && update.id === CREATE_NEW_OPTION) {
      update = await props.onCreateSelected(update, inputValue);
    }
    props.onAddSelected(update);
  }

  function renderOption(
    liProps: React.HTMLAttributes<HTMLLIElement>,
    option: T,
  ) {
    const label = props.toStringLabel(option);
    return (
      <li {...liProps} style={{ display: 'block' }}>
        <HighlightedLabel toMatch={inputValue} text={label} />
      </li>
    );
  }

  function renderInputField(params: TextFieldProps): JSX.Element {
    return (
      <TextField
        {...params}
        placeholder={props.placeholder}
        value={inputValue}
        size="medium"
      />
    );
  }

  function renderSelected(
    selected: T[],
    getAutocompleteProps: AutocompleteRenderGetTagProps,
  ) {
    return (
      <div style={{ width: '100%' }}>
        {selected.map((s: T, index) => (
          <Chip
            key={index}
            label={
              props.toSelectedLabel
                ? props.toSelectedLabel(s)
                : props.toStringLabel(s)
            }
            {...getAutocompleteProps({ index })}
            onDelete={() => handleRemoveSelected(s)}
            size="medium"
          />
        ))}
      </div>
    );
  }

  return (
    <Autocomplete
      multiple={true}
      inputValue={inputValue}
      onInputChange={async (_, value) => setInputValue(value)}
      loading={loading}
      value={props.selected}
      onChange={(_, data) => handleChangeSelected(data as T[])}
      renderInput={renderInputField}
      options={options}
      isOptionEqualToValue={props.isOptionEqualToValue}
      getOptionLabel={props.toStringLabel}
      renderOption={(liProps, option) => renderOption(liProps, option)}
      filterOptions={removeSelected}
      renderTags={renderSelected}
    />
  );
}