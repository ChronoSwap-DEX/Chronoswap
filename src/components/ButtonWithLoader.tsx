import {
  CircularProgress,
  makeStyles,
  Typography,
} from "@mui/material";

import { ReactChild } from "react";
import { Button } from "@/components/button"
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
          className={className + "w-6/12 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg mt-4 text-white"}
          disabled={disabled}
          onClick={onClick}>
          {children}
        </Button>

        {showLoader ? (
          <CircularProgress size={15} color="inherit" className={className || "loader"}/>
        ) : null}
      {error ? (
        <p className="block text-md font-medium text-red-600 error">
        {error}
        </p>
      ) : null}
    </>
  );
}
