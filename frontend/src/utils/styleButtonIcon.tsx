import { FC } from 'react';
import styled from '@emotion/styled';
import { Any } from '../components/common/Any';

export const styleButtonIcon = (component: FC<{ [x: string]: Any }>) => styled(
  component,
  {
    shouldForwardProp: prop => prop !== 'hoverColor',
  },
)`
  margin-top: -0.15em;
  margin-right: 0.4em;
`;
