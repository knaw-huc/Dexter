import Alert from "@mui/material/Alert";
import React from "react";
import { ACTIONS } from "../../State/actions";
import { errorContext } from "../../State/Error/errorContext";

export const ErrorMessage = () => {
  const { errorState, errorDispatch } = React.useContext(errorContext);

  const onCloseHandler = () => {
    errorDispatch({
      type: ACTIONS.SET_ERROR,
      message: "",
    });
  };

  return (
    <>
      {errorState.message && (
        <Alert
          onClose={onCloseHandler}
          style={{ position: "fixed", width: "100%", zIndex: "99" }}
          severity="error"
        >
          {errorState.message}
        </Alert>
      )}
    </>
  );
};
