import { FC } from 'react';
import styled from '@emotion/styled';
import { AnyProp } from '../components/common/Any';

export type IconStyledProps = {
  color?: string;
  hoverColor?: string;
};

export const styleHoverIcon = (
  component: FC<IconStyledProps & AnyProp>,
) => styled(component, {
  shouldForwardProp: prop => !['color', 'hoverColor'].includes(prop),
})`
  color: ${(props: IconStyledProps) => props.color || 'grey'};
  font-size: 1.4em;
  &:hover {
    cursor: pointer;
    color: ${(props: IconStyledProps) => props.hoverColor || 'black'};
  }
`;
