import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import LoginIcon from '@mui/icons-material/Login';
import * as React from 'react';
import { useEffect } from 'react';
import { login } from '../utils/API';
import { useThrowSync } from './common/error/useThrowSync';
import { useImmer } from 'use-immer';
import { useUserStore } from '../state/UserStore';
import { isResponseError } from './common/isResponseError';
import { assign } from '../utils/draft/assign';

export function LoginAvatar() {
  const [isLoggingIn, setLoggingIn] = useImmer(false);
  const { setUser } = useUserStore();
  const throwSync = useThrowSync();

  useEffect(() => {
    if (!isLoggingIn) {
      return;
    }
    tryLogin();
  }, [isLoggingIn]);

  useEffect(() => {
    tryLogin();
  }, []);

  function tryLogin() {
    login()
      .then(user => setUser(draft => assign(draft, user)))
      .catch(e => {
        if (isResponseError(e) && e.response.status === 401) {
          throwSync(
            new Error('Could not login: username & password incorrect'),
          );
        } else {
          throwSync(new Error('Could not login'));
        }
      });
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton onClick={() => setLoggingIn(true)} sx={{ p: 0 }}>
        <Avatar>
          <LoginIcon />
        </Avatar>
      </IconButton>
    </Box>
  );
}
