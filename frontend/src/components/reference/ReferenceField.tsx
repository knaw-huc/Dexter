import { FormFieldprops } from '../common/FormFieldProps';
import { SpinnerIcon } from '../common/icon/SpinnerIcon';
import { InputAdornment } from '@mui/material';
import { ReferenceStyle } from './ReferenceStyle';
import { TextFieldStyled } from '../common/TextFieldStyled';
import { Label } from '../common/Label';
import { ReferenceToolTipHelp } from './ReferenceToolTipHelp';
import { SubmitFormReference } from '../../model/DexterModel';
import { formatReference } from './formatReference';
import { useImmer } from 'use-immer';
import React from 'react';

type ReferenceFieldProps = FormFieldprops & {
  toEdit: SubmitFormReference;
  onChange: (input: string) => void;
  referenceStyle: ReferenceStyle;
  isLoading: boolean;
};

export function ReferenceField(props: ReferenceFieldProps) {
  const toEdit = props.toEdit;
  const isLoading = props.isLoading;

  const [isCollapsed, setCollapsed] = useImmer(true);

  const csl = toEdit?.csl || '';
  const inputValue = toEdit?.input || '';

  return (
    <>
      {props.label && <Label>{props.label}</Label>}

      <TextFieldStyled
        fullWidth
        onChange={e => props.onChange(e.target.value)}
        onFocus={() => setCollapsed(false)}
        value={inputValue}
        multiline={true}
        rows={isCollapsed ? 1 : countNewlines(inputValue)}
        inputProps={{
          wrap: 'off',
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <ReferenceToolTipHelp
                isManaged={!!csl}
                isEmpty={!inputValue}
                isLoading={isLoading}
              />
            </InputAdornment>
          ),
        }}
      />

      {csl && (
        <p
          dangerouslySetInnerHTML={{
            __html: formatReference(csl, props.referenceStyle),
          }}
        ></p>
      )}

      {isLoading && (
        <p>
          <span>
            <SpinnerIcon />
          </span>{' '}
          Importing
        </p>
      )}
    </>
  );
}

function countNewlines(content: string): number {
  if (!content) {
    return 1;
  }
  const matches = content.match(/\n/g);
  if (!matches) {
    return 1;
  }
  return matches.length + 1;
}
