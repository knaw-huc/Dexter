import { FormFieldprops } from '../common/FormFieldProps';
import { TextFieldWithError } from './TextFieldWithError';
import { Spinner } from '../common/Spinner';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '../../utils/useDebounce';
import { formatCitation } from './formatCitation';

type CitationFieldProps = FormFieldprops;

export function CitationField(props: CitationFieldProps) {
  const [citation, setCitation] = useState<string>();
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 250);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setError(null);
  }, [inputValue]);

  useEffect(() => {
    convertInputIntoCitation();

    async function convertInputIntoCitation() {
      if (!debouncedInputValue) {
        return;
      }
      setLoading(true);
      try {
        const formatted = await formatCitation(inputValue);
        setCitation(formatted);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    }
  }, [debouncedInputValue]);

  return (
    <>
      <TextFieldWithError
        label={
          props.label ||
          'Enter citation (doi, bibtex or other format supported by citation.js)'
        }
        onChange={setInputValue}
        value={inputValue}
        multiline={true}
        rows={countNewlines(inputValue)}
        inputProps={{ wrap: 'off' }}
        error={error || props.error}
      />
      {citation && <p dangerouslySetInnerHTML={{ __html: citation }}></p>}

      {loading && (
        <p>
          <span>
            <Spinner />
          </span>{' '}
          Loading
        </p>
      )}
      <hr style={{ marginTop: '2em' }} />
    </>
  );
}

function countNewlines(content: string): number {
  if (!content) {
    return 1;
  }
  // return /[\r\n]/.exec(pasted);
  return content.match(/\n/g).length + 1;
}
