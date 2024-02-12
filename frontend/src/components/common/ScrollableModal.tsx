import React from 'react';
import { PropsWithChildren } from 'react';
import { Box, Modal } from '@mui/material';

const modalStyle = {
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '800px',
  overflow: 'scroll',
  height: '100%',
  display: 'block',
  overflowX: 'hidden',
};

type ScrollModalProps = PropsWithChildren & {
  show: boolean;
  handleClose: () => void;
  fullHeight?: boolean;
};

export default function ScrollableModal(props: ScrollModalProps) {
  const newModalStyle = { ...modalStyle };
  if (props.fullHeight === false) {
    delete newModalStyle.height;
  }
  return (
    <Modal open={props.show} onClose={props.handleClose}>
      <Box sx={newModalStyle}>{props.children}</Box>
    </Modal>
  );
}
