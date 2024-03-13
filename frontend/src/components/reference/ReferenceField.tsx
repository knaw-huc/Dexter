import { FormFieldprops } from '../common/FormFieldProps';
import { SpinnerIcon } from '../common/SpinnerIcon';
import React, { useState } from 'react';
import { InputAdornment } from '@mui/material';
import { SplitRow } from '../common/SplitRow';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { ReferenceStyle } from './ReferenceStyle';
import { TextFieldStyled } from '../common/TextFieldStyled';
import { Label } from '../common/Label';
import { ReferenceToolTipHelp } from './ReferenceToolTipHelp';
import { SubmitFormReference } from '../../model/DexterModel';
import _ from 'lodash';

type ReferenceFieldProps = FormFieldprops & {
  toEdit: SubmitFormReference;
  onChange: (input: string) => void;
  referenceStyle: ReferenceStyle;
};

/**
 * TODO: Hoe moet het citeren eruit zien?
 *  v1:
 *  - altijd default style gebruiken
 *  - toevoegen nieuwe reference: sla ook op reference.formatted, in default style
 *  - als reference al bestaat: geen foutmelding, maar info met disabled submit knop
 *  - sources page:
 *    - 'add new' > reference form
 *      - create new resource and link to source
 *    - 'add existing' > autocomplete
 *      - search full text in reference.formatted
 *      - display as options
 *      - select and link to source
 *  v2:
 *  - store styling in user config
 *  - add restyle component on index page
 *    - it updates all references
 *    - it shows progress indicator
 *
 **/
export function ReferenceField(props: ReferenceFieldProps) {
  const toEdit = props.toEdit;
  const [isCollapsed, setCollapsed] = useState(true);

  const formatted = toEdit?.formatted || '';
  const isLoading = toEdit?.isLoading || false;
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
          <ValidatedSelectField<ReferenceStyle>
            disabled={true}
            selectedOption={props.referenceStyle}
            onSelectOption={_.noop}
            options={Object.values(ReferenceStyle)}
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
