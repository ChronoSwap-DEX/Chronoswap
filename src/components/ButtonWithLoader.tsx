import {
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from "@mui/material";

import { ReactChild } from "react";

export default function ButtonWithLoader({
  disabled,
  onClick,
  showLoader,
  error,
  children,
  className,
}: {
  disabled?: boolean;
  onClick: () => void;
  showLoader?: boolean;
  error?: string;
  children: ReactChild;
  className?: string;
}) {

  return (
    <>

        <Button
          color="primary"
          variant="contained"
          className={className || "button"}
          disabled={disabled}
          onClick={onClick}>
          {children}
        </Button>
        {showLoader ? (
          <CircularProgress
            size={15}
            color="inherit"
            className={className || "loader"}
          />
        ) : null}
      {error ? (
        <p className="block text-md font-medium text-red-600 error">
        {error}
        </p>
      ) : null}
    </>
  );
}
