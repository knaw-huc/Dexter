import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import React from 'react';
import ScrollableModal from '../common/ScrollableModal';
import { SubmitButton } from '../common/SubmitButton';
import { onSubmit } from '../../utils/onSubmit';
import { Exportable } from './mapper/Exportable';
import { useThrowSync } from '../common/error/useThrowSync';
import { useExporter } from './useExporter';
import { SpinnerIcon } from '../common/icon/SpinnerIcon';
import { NextIcon } from '../common/icon/NextIcon';
import { TopRightCloseIcon } from '../common/icon/CloseIcon';

type ExportFormProps = {
  toExport?: Exportable;
  onExported: () => void;
  onClose: () => void;
};

styled(TextField)`
  display: block;
`;

export function ExportForm(props: ExportFormProps) {
  const throwSync = useThrowSync();
  const { runExport, isExporting } = useExporter();
  async function handleSubmit() {
    try {
      await runExport(props.toExport);
      props.onExported();
    } catch (error) {
      throwSync(error);
    }
  }

  return (
    <>
      <ScrollableModal handleClose={props.onClose} fullHeight={false}>
        <TopRightCloseIcon onClick={props.onClose} />

        <h1>Export to CSV</h1>
        <form onSubmit={onSubmit(handleSubmit)}>
          {isExporting && (
            <>
              <SpinnerIcon /> Exporting...{' '}
            </>
          )}
          <SubmitButton
            label={
              <>
                Export{' '}
                <NextIcon
                  sx={{
                    marginLeft: '1em',
                    marginRight: '0 !important',
                  }}
                />
              </>
            }
            onClick={handleSubmit}
          />
        </form>
      </ScrollableModal>
    </>
  );
}
