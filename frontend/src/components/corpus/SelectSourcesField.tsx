import { ResultSource, Source } from '../../model/DexterModel';
import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { normalizeInput } from '../../utils/normalizeInput';

export type SelectSourcesFieldProps = {
  options: ResultSource[];
  selected: ResultSource[];
  onSelectSource: (sourceId: string) => void;
  onDeselectSource: (sourceId: string) => void;
};

export function SelectSourcesField(props: SelectSourcesFieldProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const normalizedInput = normalizeInput(inputValue);

  return (
    <Autocomplete
      inputValue={inputValue}
      onInputChange={async (_, value) => {
        setInputValue(value);
      }}
      multiple={true}
      id="link-source-autocomplete"
      options={props.options}
      getOptionLabel={(source: Source) => source.title}
      filterOptions={all =>
        all.filter(source =>
          normalizeInput(source.title).includes(normalizedInput),
        )
      }
      isOptionEqualToValue={(option, value) => option.title === value?.title}
      filterSelectedOptions
      value={props.selected}
      renderInput={params => (
        <TextField
          {...params}
          margin="dense"
          label="Search and select sources"
          value={inputValue}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((source, index) => (
          <Chip
            label={source.title}
            key={index}
            {...getTagProps({ index })}
            onDelete={() => {
              props.onDeselectSource(source.id);
            }}
          />
        ))
      }
      onChange={(_, selected) => {
        const selectedSource = selected.at(-1) as ResultSource;
        if (!selectedSource) {
          return;
        }
        props.onSelectSource(selectedSource.id);
      }}
      renderOption={(props, option, { inputValue }) => {
        const matches = match(option.title, inputValue, {
          insideWords: true,
        });
        const parts = parse(option.title, matches);

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
}
