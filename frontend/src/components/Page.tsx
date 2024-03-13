import { Container } from '@mui/material';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './/Header';
import ErrorBoundary from './common/error/ErrorBoundary';

export const Page = () => {
  const location = useLocation();
  const refreshOnPathChange = location.pathname;
  return (
    <div
      style={{
        marginBottom: '4em',
      }}
    >
      <Header />
      <Container
        style={{
          marginTop: '2em',
        }}
      >
        <ErrorBoundary key={refreshOnPathChange}>
          <Outlet />
        </ErrorBoundary>
      </Container>
    </div>
  );
};
