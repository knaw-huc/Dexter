import { ServerKeyword } from '../../model/DexterModel';
import React, { useState } from 'react';
import { SelectKeywordsField } from './SelectKeywordsField';
import { ButtonWithIcon } from '../common/ButtonWithIcon';
import { FilterIconStyled } from '../common/FilterIconStyled';

export function KeywordsFilter(props: {
  all: ServerKeyword[];
  selected: ServerKeyword[];
  onChangeSelected: (keys: ServerKeyword[]) => void;
}) {
  const [isOpen, setOpen] = useState(!!props.selected.length);

  if (!isOpen) {
    return <FilterButton onClick={() => setOpen(true)} />;
  }

  return (
    <SelectKeywordsField
      selected={props.selected}
      onChangeSelected={props.onChangeSelected}
      options={props.all}
      size="small"
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
      Keyword
    </ButtonWithIcon>
  );
}
