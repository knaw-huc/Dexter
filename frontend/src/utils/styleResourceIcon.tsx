import { FC } from 'react';
import styled from '@emotion/styled';
import { grey } from '@mui/material/colors';

export type ResourceIconProps = {
  iconColor?: string;
  fontSize?: 'small' | 'large' | 'inherit';
  verticalAlign?: 'middle' | 'bottom';
  isInline?: boolean;
};

const propsToForward = ['fontSize'];

export const styleResourceIcon = (component: FC<ResourceIconProps>) => styled(
  component,
  {
    shouldForwardProp: prop => propsToForward.includes(prop),
  },
)`
  margin-right: ${(props: ResourceIconProps) =>
    props.isInline !== false ? '0.4em' : 'inherit'};
  color: ${(props: ResourceIconProps) => props.iconColor ?? grey[500]};
  vertical-align: ${(props: ResourceIconProps) =>
    props.verticalAlign ?? 'middle'};
`;
