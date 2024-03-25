import React, { PropsWithChildren, useEffect } from 'react';
import { useUserState } from './state/user/userReducer';
import { userContext } from './state/user/userContext';
import { LABEL_FILE, useLabelStore } from './LabelStore';
import { getAssetValidated } from './utils/API';

export const Providers = (props: PropsWithChildren) => {
  const [userState, dispatchUser] = useUserState();

  const { setLabels } = useLabelStore();
  useEffect(() => {
    getAssetValidated(LABEL_FILE).then(r => r.json().then(j => setLabels(j)));
  }, []);

  return (
    <userContext.Provider value={{ userState, dispatchUser }}>
      {props.children}
    </userContext.Provider>
  );
};
