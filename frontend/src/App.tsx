import React, { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { Router } from './Router';
import { LABEL_FILE, useLabelStore } from './LabelStore';
import { getAssetValidated } from './utils/API';
import { enableMapSet } from 'immer';
import { useUser } from './state/resources/hooks/useUser';
import { useLanguages } from './state/resources/hooks/useLanguages';

export function App() {
  // Use maps and sets with Immer:
  enableMapSet();

  const { initLanguages } = useLanguages();
  const { initUserResources } = useUser();
  const { setLabels } = useLabelStore();

  useEffect(init, []);

  function init() {
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
