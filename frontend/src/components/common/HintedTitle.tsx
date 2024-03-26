import { Tooltip } from '@mui/material';
import React from 'react';
import { toTitleHint, useLabelStore } from '../../LabelStore';
import styled from '@emotion/styled';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const HintIcon = styled(HelpOutlineOutlinedIcon)`
  position: relative;
  top: 0.08em;
  margin-left: 0.5em;
  font-size: 0.66em;
  color: #ccc;
  font-weight: lighter;
`;

export function HintedTitle(props: { title: string; hint?: string }) {
  const { getLabel } = useLabelStore();

  return (
    <>
      {props.title}
      <Tooltip title={getLabel(toTitleHint(props.hint ?? props.title))}>
        <HintIcon />
      </Tooltip>
    </>
  );
}
