import React, { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { Router } from './Router';
import { LABEL_FILE, useLabelStore } from './LabelStore';
import { getAssetValidated, getLanguages, getUserResources } from './utils/API';
import { useBoundStore } from './state/resources/useBoundStore';
import { enableMapSet } from 'immer';

export function App() {
  enableMapSet();
  const { userResources, languages } = useBoundStore();

  const { setLabels } = useLabelStore();
  useEffect(() => {
    getAssetValidated(LABEL_FILE).then(r => r.json().then(setLabels));
    getUserResources()
      .then(r => {
        userResources.setUserResources(r);
        userResources.setLoading(false);
      })
      .catch(userResources.setError);
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
