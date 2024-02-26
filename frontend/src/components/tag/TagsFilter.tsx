import { ResultTag } from '../../model/DexterModel';
import React, { useState } from 'react';
import { SelectTagField } from './SelectTagField';
import { ButtonWithIcon } from '../common/ButtonWithIcon';
import { FilterIconStyled } from '../common/FilterIconStyled';

export function TagsFilter(props: {
  all: ResultTag[];
  selected: ResultTag[];
  onChangeSelected: (keys: ResultTag[]) => void;
  placeholder?: string;
}) {
  const [isOpen, setOpen] = useState(!!props.selected.length);

  if (!isOpen) {
    return <FilterButton onClick={() => setOpen(true)} />;
  }

  return (
    <SelectTagField
      selected={props.selected}
      onChangeSelected={props.onChangeSelected}
      options={props.all}
      size="small"
      placeholder={props.placeholder}
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
      <FilterIconStyled />
      Tag
    </ButtonWithIcon>
  );
}
