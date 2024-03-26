import React, { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { Router } from './Router';
import { LABEL_FILE, useLabelStore } from './LabelStore';
import { getAssetValidated } from './utils/API';

export function App() {
  const { setLabels } = useLabelStore();
  useEffect(() => {
    getAssetValidated(LABEL_FILE).then(r => r.json().then(j => setLabels(j)));
  }, []);

  return (
    <>
      <CssBaseline />
      <Router />
    </>
  );
}
