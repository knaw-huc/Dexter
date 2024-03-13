import React, { PropsWithChildren } from 'react';
import { useUserState } from './state/user/userReducer';
import { userContext } from './state/user/userContext';

export const Providers = (props: PropsWithChildren) => {
  const [userState, dispatchUser] = useUserState();

  return (
    <userContext.Provider value={{ userState, dispatchUser }}>
      {props.children}
    </userContext.Provider>
  );
};
