import { Container } from '@mui/material';
import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './/Header';
import ErrorBoundary from './common/error/ErrorBoundary';
import { CenteredSpinner } from './common/CenteredSpinner';
import { useIsResourcesLoading } from '../resources/useLoading';
import { SpinnerIcon } from './common/icon/SpinnerIcon';

export const Page = () => {
  const location = useLocation();
  const refreshOnPathChange = location.pathname;
  const isLoading = useIsResourcesLoading();

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
          {isLoading ? (
            <CenteredSpinner label="Loading user data..." />
          ) : (
            <Suspense fallback={<SpinnerIcon />}>
              <Outlet />
            </Suspense>
          )}
        </ErrorBoundary>
      </Container>
    </div>
  );
};
