import { ResultTag } from '../../model/DexterModel';
import React from 'react';
import { SelectTagField } from './SelectTagField';
import { ButtonWithIcon } from '../common/icon/ButtonWithIcon';
import { FilterIcon } from '../common/icon/FilterIcon';
import { useImmer } from 'use-immer';

export function TagsFilter(props: {
  options: ResultTag[];
  selected: ResultTag[];
  onChangeSelected: (keys: ResultTag[]) => void;
  placeholder?: string;
}) {
  const [isOpen, setOpen] = useImmer(!!props.selected.length);

  if (!isOpen) {
    return <FilterButton onClick={() => setOpen(true)} />;
  }

  return (
    <SelectTagField
      selected={props.selected}
      onChangeSelected={props.onChangeSelected}
      options={props.options}
      placeholder={props.placeholder}
      useAutocomplete={false}
    />
  );
}

function FilterButton(props: { onClick: () => void }) {
  return (
    <ButtonWithIcon
      variant="contained"
      style={{ float: 'right' }}
      onClick={props.onClick}
    >
      <FilterIcon />
      Tag
    </ButtonWithIcon>
  );
}
