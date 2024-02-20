import React from 'react';
import {
  ResourceIconProps,
  styleResourceIcon,
} from '../../utils/styleResourceIcon';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';

const PermMediaOutlinedIconStyled = styleResourceIcon(PermMediaOutlinedIcon);

type MediaIconprops = ResourceIconProps & {
  filled?: boolean;
};

export function MediaIcon(props: MediaIconprops) {
  const iconProps = {
    ...props,
    fontSize: props.fontSize ? props.fontSize : 'inherit',
  };
  return <PermMediaOutlinedIconStyled {...iconProps} />;
}
