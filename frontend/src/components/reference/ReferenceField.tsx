import { FormFieldprops } from '../common/FormFieldProps';
import { SpinnerIcon } from '../common/SpinnerIcon';
import { InputAdornment } from '@mui/material';
import { SplitRow } from '../common/SplitRow';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { ReferenceStyle } from './ReferenceStyle';
import { TextFieldStyled } from '../common/TextFieldStyled';
import { Label } from '../common/Label';
import { ReferenceToolTipHelp } from './ReferenceToolTipHelp';
import { SubmitFormReference } from '../../model/DexterModel';
import _ from 'lodash';
import { formatReference } from './formatReference';
import { useImmer } from 'use-immer';
import React from 'react';

type ReferenceFieldProps = FormFieldprops & {
  toEdit: SubmitFormReference;
  onChange: (input: string) => void;
  referenceStyle: ReferenceStyle;
  isLoading: boolean;
};

/**
 *  TODO: v2:
 *   - create user config
 *   - use styling stored in user config
 *   - add style selector on index page that modifies styling in user config
 **/
export function ReferenceField(props: ReferenceFieldProps) {
  const toEdit = props.toEdit;
  const isLoading = props.isLoading;

  const [isCollapsed, setCollapsed] = useImmer(true);

  const csl = toEdit?.csl || '';
  const inputValue = toEdit?.input || '';

  return (
    <>
      <Label>{props.label || 'Reference'}</Label>
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
                  <ReferenceToolTipHelp
                    isManaged={!!csl}
                    isEmpty={!inputValue}
                    isLoading={isLoading}
                  />
                </InputAdornment>
              ),
            }}
          />
        }
        right={
          <ValidatedSelectField<ReferenceStyle>
            disabled={true}
            selectedOption={props.referenceStyle}
            onSelectOption={_.noop}
            options={Object.values(ReferenceStyle)}
          />
        }
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
