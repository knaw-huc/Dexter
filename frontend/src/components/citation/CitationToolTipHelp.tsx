import { Tooltip } from '@mui/material';
import { OkIcon } from '../common/OkIcon';
import { HelpIcon } from '../common/HelpIcon';
import { WarningIcon } from '../common/WarningIcon';
import React from 'react';
import { SpinnerIcon } from '../common/SpinnerIcon';

type CitationToolTipHelpProps = {
  isManaged: boolean;
  isEmpty: boolean;
  isLoading: boolean;
};

export function CitationToolTipHelp(props: CitationToolTipHelpProps) {
  const notRecognized = 'Current citation format is not recognized.';
  const explainFormat =
    'To export citations in various citation styles, please enter a doi, bibtex or one of the other input formats supported by citation.js';
  const formatIsRecognized =
    'Current citation format is recognized and can be exported to the various citation styles supported by citation.js';
  const formatIsNotRecognized =
    props.isEmpty || props.isLoading
      ? explainFormat
      : `${notRecognized} ${explainFormat}`;
  const title = props.isManaged ? formatIsRecognized : formatIsNotRecognized;
  return (
    <span>
      <Tooltip title={title}>
        {props.isLoading ? (
          <>
            <SpinnerIcon />
          </>
        ) : props.isManaged ? (
          <OkIcon />
        ) : props.isEmpty ? (
          <HelpIcon />
        ) : (
          <WarningIcon />
        )}
      </Tooltip>
    </span>
  );
}
