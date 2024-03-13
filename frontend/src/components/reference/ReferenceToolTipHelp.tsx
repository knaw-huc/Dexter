import { Tooltip } from '@mui/material';
import { OkIcon } from '../common/OkIcon';
import { HelpIcon } from '../common/HelpIcon';
import { WarningIcon } from '../common/WarningIcon';
import React from 'react';
import { SpinnerIcon } from '../common/SpinnerIcon';

type ReferenceToolTipHelpProps = {
  isManaged: boolean;
  isEmpty: boolean;
  isLoading: boolean;
};

const helpInputEmpty =
  'To export references in various reference styles, please enter a doi, bibtex or one of the other input formats supported by reference.js';
const helpInputNotRecognized = `Current reference format is not recognized. ${helpInputEmpty}`;
const helpInputRecognized =
  'Current reference format is recognized and can be exported to the various reference styles supported by reference.js';

export function ReferenceToolTipHelp(props: ReferenceToolTipHelpProps) {
  let help: string;
  if (props.isEmpty) {
    help = helpInputEmpty;
  } else if (props.isLoading) {
    help = helpInputEmpty;
  } else if (props.isManaged) {
    help = helpInputRecognized;
  } else {
    help = helpInputNotRecognized;
  }
  return (
    <span>
      <Tooltip title={help}>
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
