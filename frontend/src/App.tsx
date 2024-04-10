import React, { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { Router } from './Router';
import { LABEL_FILE, useLabelStore } from './LabelStore';
import { getAssetValidated, getLanguages } from './utils/API';
import { useBoundStore } from './state/resources/useBoundStore';
import { enableMapSet } from 'immer';
import { useUser } from './state/resources/hooks/useUser';

export function App() {
  enableMapSet();
  const { languages } = useBoundStore();
  const { getUserResources } = useUser();

  const { setLabels } = useLabelStore();
  useEffect(() => {
    getAssetValidated(LABEL_FILE).then(r => r.json().then(setLabels));
    getUserResources();
    getLanguages()
      .then(l => {
        languages.setLanguages(l);
        languages.setLoading(false);
      })
      .catch(languages.setError);
  }, []);

  return (
    <>
      <CssBaseline />
      <Router />
    </>
  );
}
