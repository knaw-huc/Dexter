import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import LoginIcon from '@mui/icons-material/Login';
import * as React from 'react';
import { useContext, useEffect } from 'react';
import { login } from '../utils/API';
import { userContext } from '../state/user/userContext';
import { useThrowSync } from './common/error/useThrowSync';
import { useImmer } from 'use-immer';

export function LoginAvatar() {
  const [isLoggingIn, setLoggingIn] = useImmer(false);
  const { dispatchUser } = useContext(userContext);
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
      .then(r => dispatchUser({ username: r.name }))
      .catch(e => {
        if (e.response.status === 401) {
          throwSync(
            new Error('Could not login: username & password incorrect'),
          );
        } else {
          throwSync(new Error('Error while logging in'));
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
