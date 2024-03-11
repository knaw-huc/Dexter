import { FormFieldprops } from '../common/FormFieldProps';
import { SpinnerIcon } from '../common/SpinnerIcon';
import React, { useState } from 'react';
import { InputAdornment } from '@mui/material';
import { SplitRow } from '../common/SplitRow';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { CitationStyle } from './CitationStyle';
import { TextFieldStyled } from '../common/TextFieldStyled';
import { Label } from '../common/Label';
import { CitationToolTipHelp } from './CitationToolTipHelp';
import { SubmitFormCitation } from '../../model/DexterModel';

type CitationFieldProps = FormFieldprops & {
  toEdit: SubmitFormCitation;
  onChange: (input: string) => void;
  style: CitationStyle;
  onChangeStyle: (style: CitationStyle) => void;
};

export function CitationField(props: CitationFieldProps) {
  const toEdit = props.toEdit;
  const [isCollapsed, setCollapsed] = useState(true);

  const formatted = toEdit?.formatted || '';
  const isLoading = toEdit?.isLoading || false;
  const inputValue = toEdit?.input || '';

  return (
    <>
      <Label>{props.label || 'Citation'}</Label>
      <SplitRow
        left={
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
                  <CitationToolTipHelp
                    isManaged={!!formatted}
                    isEmpty={!inputValue}
                    isLoading={isLoading}
                  />
                </InputAdornment>
              ),
            }}
          />
        }
        right={
          <ValidatedSelectField<CitationStyle>
            disabled={!formatted}
            selectedOption={props.style}
            onSelectOption={o => props.onChangeStyle(o)}
            options={Object.values(CitationStyle)}
          />
        }
      />
      {formatted && <p dangerouslySetInnerHTML={{ __html: formatted }}></p>}

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
