import { FormFieldprops } from '../common/FormFieldProps';
import { SpinnerIcon } from '../common/SpinnerIcon';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '../../utils/useDebounce';
import { formatCitation } from './formatCitation';
import { InputAdornment } from '@mui/material';
import { SplitRow } from '../common/SplitRow';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { CitationStyle } from './CitationStyle';
import { TextFieldStyled } from '../common/TextFieldStyled';
import { Label } from '../common/Label';
import { CitationToolTipHelp } from './CitationToolTipHelp';

type CitationFieldProps = FormFieldprops & {
  input: string;
  formatted?: string;
  onChange: (input: string) => void;
};

export function CitationField(props: CitationFieldProps) {
  const [inputValue, setInputValue] = useState(props.input);
  const debouncedInputValue = useDebounce(inputValue, 250);
  const [formatted, setFormatted] = useState<string>(props.formatted);
  const [isLoading, setLoading] = useState(false);
  const [citationStyle, setCitationStyle] = useState(CitationStyle.apa);
  const [isCollapsed, setCollapsed] = useState(true);

  useEffect(() => {
    setFormatted(props.formatted);
  }, [inputValue, citationStyle]);

  useEffect(() => {
    createCitation();

    async function createCitation() {
      if (!debouncedInputValue) {
        return;
      }
      setLoading(true);
      try {
        const formatted = await formatCitation(inputValue, citationStyle);
        setFormatted(formatted);
      } catch (e) {
        setFormatted(null);
      }
      props.onChange(inputValue);
      setLoading(false);
    }
  }, [debouncedInputValue, citationStyle]);

  return (
    <>
      <Label>{props.label || 'Citation'}</Label>
      <SplitRow
        left={
          <TextFieldStyled
            fullWidth
            onChange={e => setInputValue(e.target.value)}
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
            selectedOption={citationStyle}
            onSelectOption={o => setCitationStyle(o)}
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
