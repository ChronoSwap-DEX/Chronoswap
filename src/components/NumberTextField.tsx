import { TextField, TextFieldProps } from "@mui/material";
import { useCallback } from 'react'
import { NumberRegex } from "../utils/dex";

export default function NumberTextField({
  ...props
}: TextFieldProps) {
  const onChange = useCallback((e) => {
    if (NumberRegex.test(e.target.value)) {
      props.onChange?.(e)
    }
  }, [props])

  return (
    <TextField
      type="text"
      {...props}
      InputProps={{ ...(props?.InputProps || {}) }}
      onChange={onChange}
    />
  );
}
