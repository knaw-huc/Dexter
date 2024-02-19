import React from 'react';
import {
  ResourceIconProps,
  styleResourceIcon,
} from '../../utils/styleResourceIcon';
import PermMediaIcon from '@mui/icons-material/PermMedia';

const PermMediaIconStyled = styleResourceIcon(PermMediaIcon);

type MediaIconprops = ResourceIconProps & {
  filled?: boolean;
};

export function MediaIcon(props: MediaIconprops) {
  const iconProps = {
    ...props,
    fontSize: props.fontSize ? props.fontSize : 'inherit',
  };
  return <PermMediaIconStyled {...iconProps} />;
}
