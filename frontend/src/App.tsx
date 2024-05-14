import React, { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { Router } from './Router';
import { LABEL_FILE, useLabelStore } from './LabelStore';
import { getAssetValidated } from './utils/API';
import { enableMapSet } from 'immer';
import { useUser } from './resources/useUser';
import { useLanguages } from './resources/useLanguages';
import { useThrowSync } from './components/common/error/useThrowSync';

// Use maps and sets with Immer:
enableMapSet();

export function App() {
  const { initLanguages } = useLanguages();
  const { initUserResources } = useUser();
  const { setLabels } = useLabelStore();
  const throwSync = useThrowSync();
  const { login } = useUser();

  useEffect(() => void init(), []);

  async function init() {
    try {
      await login();
    } catch (e) {
      if (e.response?.status === 401) {
        throwSync(new Error('Could not login: username & password incorrect'));
      } else {
        throwSync(new Error('Could not login'));
      }
    }
    initUserResources();
    initLanguages();
    getAssetValidated(LABEL_FILE).then(r => r.json().then(setLabels));
  }

  return (
    <>
      <CssBaseline />
      <Router />
    </>
  );
}
