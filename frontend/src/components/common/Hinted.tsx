import { Tooltip } from '@mui/material';
import React from 'react';
import { LabelKey, useLabelStore } from '../../LabelStore';
import styled from '@emotion/styled';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import _ from 'lodash';

const HintIcon = styled(HelpOutlineOutlinedIcon)`
  position: relative;
  top: 0.12em;
  margin-left: 0.5em;
  font-size: 1.1em;
  color: gray;
`;

export function Hinted(props: { txt: string; hint: LabelKey | string }) {
  const { getLabel } = useLabelStore();

  return (
    <>
      {_.capitalize(props.txt)}
      <Tooltip title={getLabel(props.hint as LabelKey)}>
        <HintIcon />
      </Tooltip>
    </>
  );
}
