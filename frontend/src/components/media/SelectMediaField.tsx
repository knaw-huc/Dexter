import React from 'react';
import { ResultMedia, SupportedMediaType } from '../../model/DexterModel';
import { createMedia, getMediaAutocomplete } from '../../utils/API';
import _ from 'lodash';
import { grey } from '@mui/material/colors';
import { truncateMiddle } from '../../utils/truncateMiddle';
import isUrl from '../../utils/isUrl';
import { UNTITLED } from './Title';
import {
  CREATE_NEW_OPTION,
  MultiAutocomplete,
} from '../common/MultiAutocomplete';

export interface SelectMediaFieldProps {
  selected: ResultMedia[];
  onChangeSelected: (selected: ResultMedia[]) => void;

  /**
   * Should option be shown to create new media when not existing?
   */
  allowCreatingNew?: boolean;

  size?: 'small' | 'medium';
}

const MIN_AUTOCOMPLETE_LENGTH = 1;

const createNewMediaOption: Omit<ResultMedia, 'url'> = {
  id: CREATE_NEW_OPTION,
  title: `Create new media from current url`,
  // backend determines media type and createdBy:
  mediaType: 'unknown' as SupportedMediaType,
  createdBy: undefined,
};

/**
 * Create, link and unlink media
 */
export const SelectMediaField = (props: SelectMediaFieldProps) => {
  function toOptions(inputValue: string, autocomplete: ResultMedia[]) {
    const options = [...autocomplete];
    const inputIsOption = options.find(o => o.url === inputValue);
    if (props.allowCreatingNew && !inputIsOption && isUrl(inputValue)) {
      options.push({
        ...createNewMediaOption,
        url: inputValue,
      });
    }
    return options.sort(sortAlphanumeric);
  }

  async function handleCreateNew(toCreate: ResultMedia) {
    return createMedia({ url: toCreate.url, title: '' });
  }

  async function handleAutocomplete(inputValue: string) {
    const canAutocomplete = inputValue.length >= MIN_AUTOCOMPLETE_LENGTH;
    const autocompleteOptions = canAutocomplete
      ? await getMediaAutocomplete(inputValue)
      : [];
    return toOptions(inputValue, autocompleteOptions);
  }

  function toSelectedLabel(media: ResultMedia): JSX.Element {
    const title = _.truncate(media?.title || UNTITLED, { length: 40 });
    const url = truncateMiddle(media?.url || '', 20);
    return (
      <>
        {title} <span style={{ color: grey[700] }}>({url})</span>
      </>
    );
  }

  function toStringLabel(media: ResultMedia): string {
    return media.title ? `${media.title} (${media.url})` : media.url;
  }

  function sortAlphanumeric(s1: ResultMedia, s2: ResultMedia) {
    return s1.title > s2.title ? 1 : -1;
  }

  function handleRemoveSelected(option: ResultMedia) {
    return props.onChangeSelected(
      props.selected.filter(s => s.id !== option.id),
    );
  }

  function handleAddSelected(option: ResultMedia) {
    return props.onChangeSelected([...props.selected, option]);
  }

  return (
    <MultiAutocomplete<ResultMedia>
      placeholder="Find media by url or title"
      selected={props.selected}
      onAutocomplete={handleAutocomplete}
      toStringLabel={toStringLabel}
      toSelectedLabel={toSelectedLabel}
      isOptionEqualToValue={(option, value) => option.url === value.url}
      onAddSelected={handleAddSelected}
      onRemoveSelected={handleRemoveSelected}
      allowCreatingNew={props.allowCreatingNew}
      onCreateSelected={handleCreateNew}
    />
  );
};
