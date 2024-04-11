import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import LoginIcon from '@mui/icons-material/Login';
import * as React from 'react';
import { useEffect } from 'react';
import { useThrowSync } from './common/error/useThrowSync';
import { isResponseError } from './common/isResponseError';
import { useUser } from '../resources/useUser';
import _ from 'lodash';

export function LoginAvatar() {
  const throwSync = useThrowSync();
  const { login } = useUser();

  useEffect(() => {
    tryLogin();
  }, []);

  function tryLogin() {
    login().catch(e => {
      if (isResponseError(e) && e.response.status === 401) {
        throwSync(new Error('Could not login: username & password incorrect'));
      } else {
        throwSync(new Error('Could not login'));
      }
    });
  }

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
