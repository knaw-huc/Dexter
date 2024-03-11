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
import _ from 'lodash';

type CitationFieldProps = FormFieldprops & {
  toEdit: SubmitFormCitation;
  onChange: (input: string) => void;
  citationStyle: CitationStyle;
};

/**
 * TODO: Hoe moet het citeren eruit zien?
 *  v1:
 *  - altijd default style gebruiken
 *  - toevoegen nieuwe citation: sla ook op citation.formatted, in default style
 *  - als citation al bestaat: geen foutmelding, maar info met disabled submit knop
 *  - sources page:
 *    - 'add new' > citation form
 *      - create new resource and link to source
 *    - 'add existing' > autocomplete
 *      - search full text in citation.formatted
 *      - display as options
 *      - select and link to source
 *  v2:
 *  - store styling in user config
 *  - add restyle component on index page
 *    - it updates all citations
 *    - it shows progress indicator
 *
 **/
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
            disabled={true}
            selectedOption={props.citationStyle}
            onSelectOption={_.noop}
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
