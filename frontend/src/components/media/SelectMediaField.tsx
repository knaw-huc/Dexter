import { Autocomplete, Chip, TextField, TextFieldProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ResultMedia, SupportedMediaType } from '../../model/DexterModel';
import { useDebounce } from '../../utils/useDebounce';
import { createMedia, getMediaAutocomplete } from '../../utils/API';
import _ from 'lodash';
import { grey } from '@mui/material/colors';
import { truncateMiddle } from '../../utils/truncateMiddle';
import isUrl from '../../utils/isUrl';
import { UNTITLED } from './Title';

export interface SelectMediaFieldProps {
  selected: ResultMedia[];
  onChangeSelected: (selected: ResultMedia[]) => void;

  /**
   * Options to select from
   */
  options?: ResultMedia[];

  /**
   * Should additional options be fetched from autocomplete endpoint?
   */
  useAutocomplete?: boolean;

  /**
   * Should option be shown to create new media when not existing?
   */
  allowCreatingNew?: boolean;

  size?: 'small' | 'medium';
}

const MIN_AUTOCOMPLETE_LENGTH = 1;
const CREATE_NEW_MEDIA = 'create-new-media';

const createNewMediaOption: Omit<ResultMedia, 'url'> = {
  id: CREATE_NEW_MEDIA,
  title: `Create new media from current url`,
  // backend determines media type and createdBy:
  mediaType: 'unknown' as SupportedMediaType,
  createdBy: undefined,
};

/**
 * Create, link and unlink media
 */
export const SelectMediaField = (props: SelectMediaFieldProps) => {
  const [inputValue, setInputValue] = React.useState('');
  const debouncedInput = useDebounce<string>(inputValue, 250);
  const [autocomplete, setAutocomplete] = useState([]);
  const [loading, setLoading] = React.useState(false);

  function getOptions() {
    const options: ResultMedia[] = [
      ...autocomplete,
      ...props.selected,
      ...(props.options ?? []),
    ];
    const inputIsOption = options.find(o => o.url === inputValue);
    if (props.allowCreatingNew && !inputIsOption && isUrl(inputValue)) {
      options.push({
        ...createNewMediaOption,
        url: inputValue,
      });
    }
    const uniqueOptions = _.uniqBy(options, 'url');
    return uniqueOptions.sort(sortAlphanumeric);
  }

  const handleDeleteMedia = (media: ResultMedia) => {
    const newSelected = props.selected.filter(t => t.id !== media.id);
    props.onChangeSelected(newSelected);
  };

  useEffect(() => {
    if (
      !props.useAutocomplete ||
      debouncedInput.length < MIN_AUTOCOMPLETE_LENGTH
    ) {
      return;
    }
    setLoading(true);
    getMediaAutocomplete(debouncedInput).then(t => {
      setAutocomplete(t);
      setLoading(false);
    });
  }, [debouncedInput]);

  function renderInputField(params: TextFieldProps): JSX.Element {
    return (
      <TextField
        {...params}
        placeholder="Find media by url or title"
        value={inputValue}
        size={props.size ? props.size : 'medium'}
      />
    );
  }

  async function handleChangeSelected(data: ResultMedia[]) {
    const selectedIsNewMedia = data.findIndex(t => t.id === CREATE_NEW_MEDIA);
    if (selectedIsNewMedia !== -1) {
      data[selectedIsNewMedia] = await createMedia({
        url: inputValue,
        title: '',
      });
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
      options={getOptions()}
      isOptionEqualToValue={(option, value) => option.url === value.url}
      value={props.selected}
      renderInput={renderInputField}
      forcePopupIcon={false}
      renderTags={(mediaValue, getMediaProps) => (
        <div style={{ width: '100%' }}>
          {mediaValue.map((media: ResultMedia, index) => (
            <Chip
              key={index}
              label={toSelectedLabel(media)}
              {...getMediaProps({ index })}
              onDelete={() => {
                handleDeleteMedia(media);
              }}
              size={props.size ? props.size : 'medium'}
            />
          ))}
        </div>
      )}
      onChange={(_, data) => handleChangeSelected(data as ResultMedia[])}
      renderOption={(props, option: ResultMedia) => {
        const label = toOptionLabel(option, inputValue);
        return (
          <li {...props} style={{ display: 'block' }}>
            {label}
          </li>
        );
      }}
      getOptionLabel={(option: ResultMedia) => toStringLabel(option)}
    />
  );
};

function toSelectedLabel(media: ResultMedia): JSX.Element {
  const title = _.truncate(media?.title || UNTITLED, { length: 40 });
  const url = truncateMiddle(media?.url || '', 20);
  return (
    <>
      {title} <span style={{ color: grey[700] }}>({url})</span>
    </>
  );
}

function toOptionLabel(media: ResultMedia, inputValue: string): JSX.Element {
  const label = toStringLabel(media);
  const pattern = `(.*)(${inputValue})(.*)`;
  const matches = label.match(pattern);
  return matches ? (
    <>
      {matches[1]}
      <strong>{matches[2]}</strong>
      {matches[3]}
    </>
  ) : (
    <>{label}</>
  );
}

function toStringLabel(media: ResultMedia): string {
  return media.title ? `${media.title} (${media.url})` : media.url;
}

function sortAlphanumeric(s1: ResultMedia, s2: ResultMedia) {
  return s1.title > s2.title ? 1 : -1;
}
