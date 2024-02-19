import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Providers } from './Providers';
import './App.css';
import { Router } from './Router';

export function App() {
  return (
    <>
      <CssBaseline />
      <Providers>
        <Router />
      </Providers>
    </>
  );
}
