import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import LoginIcon from '@mui/icons-material/Login';
import * as React from 'react';
import _ from 'lodash';

export function LoginAvatar() {
  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton onClick={_.noop} sx={{ p: 0 }}>
        <Avatar>
          <LoginIcon />
        </Avatar>
      </IconButton>
    </Box>
  );
}
