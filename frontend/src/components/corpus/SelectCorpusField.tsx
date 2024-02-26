import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React, { useState } from 'react';
import { ResultCorpus, ResultSource } from '../../model/DexterModel';

export type SelectCorpusFieldProps = {
  options: ResultCorpus[];
  selected?: ResultCorpus;
  onSelectCorpus: (corpusId: string) => void;
  onDeselectCorpus: (corpusId: string) => void;
};

export const SelectCorpusField = (props: SelectCorpusFieldProps) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Autocomplete
      inputValue={inputValue}
      renderInput={params => (
        <TextField {...params} margin="dense" value={inputValue} />
      )}
      onInputChange={async (_, value) => {
        setInputValue(value);
      }}
      multiple={false}
      value={props.selected ?? null}
      onChange={(_, selected) => {
        const selectedCorpus = selected as ResultSource;
        if (selectedCorpus?.id) {
          props.onSelectCorpus(selectedCorpus.id);
        } else {
          props.onDeselectCorpus(selectedCorpus.id);
        }
      }}
      options={props.options}
      getOptionLabel={(corpus: ResultCorpus) => corpus.title}
      filterOptions={x => x}
      isOptionEqualToValue={(option, value) => option.title === value?.title}
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
};
