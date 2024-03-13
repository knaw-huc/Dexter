import React from 'react';
import { PropsWithChildren } from 'react';
import { Box, Modal } from '@mui/material';

const modalStyle = {
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  position: 'absolute',
  left: '50%',
  width: '800px',
  overflow: 'scroll',
  display: 'block',
  overflowX: 'hidden',
};

const fullHeightModalStyle = {
  ...modalStyle,
  height: '100%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};

const partialHeightModalStyle = {
  ...modalStyle,
  top: '0',
  transform: 'translate(-50%, 0)',
  marginTop: '4em',
};

type ScrollModalProps = PropsWithChildren & {
  handleClose: () => void;
  fullHeight?: boolean;
};

export default function ScrollableModal(props: ScrollModalProps) {
  const newModalStyle =
    props.fullHeight === false ? partialHeightModalStyle : fullHeightModalStyle;
  return (
    <Modal open={true} onClose={props.handleClose}>
      <Box sx={newModalStyle}>{props.children}</Box>
    </Modal>
  );
}
