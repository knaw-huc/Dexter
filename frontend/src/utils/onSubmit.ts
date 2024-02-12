import React from 'react';

/**
 * Prevent 'server submitting' the form on enter
 */
export function onSubmit(handleSubmit: () => Promise<void>) {
  return function (event: React.FormEvent<HTMLFormElement | HTMLInputElement>) {
    event.preventDefault();
    handleSubmit();
  };
}
