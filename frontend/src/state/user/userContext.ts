import React from 'react';
import { initState, UserAction, UserState } from './userReducer';

/**
 * TODO: replace with zustand
 */

interface UserContext {
  userState: UserState;
  dispatchUser: React.Dispatch<UserAction>;
}

const initUserContext: UserContext = {
  userState: initState,
  dispatchUser: null,
};

export const userContext = React.createContext<UserContext>(initUserContext);
