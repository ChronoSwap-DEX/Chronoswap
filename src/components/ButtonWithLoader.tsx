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
      <div className="root">
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
            size={24}
            color="inherit"
            className={className || "loader"}
          />
        ) : null}
      </div>
      {error ? (
        <Typography color="error" className="error">
          {error}
        </Typography>
      ) : null}
    </>
  );
}
