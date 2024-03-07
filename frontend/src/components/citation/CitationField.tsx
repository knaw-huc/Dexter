import { FormFieldprops } from '../common/FormFieldProps';
import { Spinner } from '../common/Spinner';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '../../utils/useDebounce';
import { formatCitation } from './formatCitation';
import { InputAdornment, Tooltip } from '@mui/material';
import { HelpIconStyled } from '../common/HelpIconStyled';
import { CheckIconStyled } from '../common/CheckIconStyled';
import { SplitRow } from '../common/SplitRow';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { CitationStyle } from './CitationStyle';
import { TextFieldStyled } from '../common/TextFieldStyled';
import { Label } from '../common/Label';

type CitationFieldProps = FormFieldprops;

export function CitationField(props: CitationFieldProps) {
  const [citation, setCitation] = useState<string>();
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 250);
  const [loading, setLoading] = useState(false);
  const [citationStyle, setCitationStyle] = useState(CitationStyle.apa);
  const [isCollapsed, setCollapsed] = useState(true);

  useEffect(() => {
    setCitation(null);
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
        setCitation(formatted);
      } catch (e) {
        setCitation(null);
      }
      setLoading(false);
    }
  }, [debouncedInputValue, citationStyle]);

  console.log('label?', props.label);
  return (
    <>
      <Label>{props.label || 'Citation'}</Label>
      <SplitRow
        left={
          <TextFieldStyled
            fullWidth
            onChange={e => setInputValue(e.target.value)}
            onFocus={() => setCollapsed(false)}
            onBlur={() => setCollapsed(true)}
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
                    isManaged={!!citation}
                    isEmpty={!inputValue}
                  />
                </InputAdornment>
              ),
            }}
          />
        }
        right={
          <ValidatedSelectField<CitationStyle>
            disabled={!citation}
            selectedOption={citationStyle}
            onSelectOption={o => setCitationStyle(o)}
            options={Object.values(CitationStyle)}
          />
        }
      />
      {citation && <p dangerouslySetInnerHTML={{ __html: citation }}></p>}

      {loading && (
        <p>
          <span>
            <Spinner />
          </span>{' '}
          Importing
        </p>
      )}
      <hr style={{ marginTop: '2em' }} />
    </>
  );
}

export function CitationToolTipHelp(props: {
  isManaged: boolean;
  isEmpty: boolean;
}) {
  const notRecognized = 'Current citation style is not recognized.';
  const explainFormat =
    'To export citations in various citation styles, please enter a doi, bibtex or one of the other citation.js supported input formats';
  const formatIsRecognized =
    'Current citation format is recognized and can be exported to the various citation styles supported by citation.js';
  const formatIsNotRecognized = props.isEmpty
    ? explainFormat
    : `${notRecognized} ${explainFormat}`;
  const title = props.isManaged ? formatIsRecognized : formatIsNotRecognized;
  return (
    <Tooltip title={title}>
      {props.isManaged ? <CheckIconStyled /> : <HelpIconStyled />}
    </Tooltip>
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
