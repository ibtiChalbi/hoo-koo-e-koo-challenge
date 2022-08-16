import { InputAdornment, TextField } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import { inputTheme } from "shared/theme";
import { Button } from "..";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { FieldInputProps, FieldMetaState } from "react-final-form";

declare type InputType = "password" | "number" | "search" | "email" | "text";
declare type InputSize = "medium" | "small" | undefined;
declare type InputColor = "primary" | "secondary";

interface InputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: FieldMetaState<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, any>;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  defaultValue?: string;
  helperText?: string;
  type?: InputType;
  size?: InputSize;
  className?: string;
  color?: InputColor;
}

/**
 * Component Input
 *
 * @component
 *
 * @example
 * return (
 *   <Input />
 * )
 */
export function Input(props: InputProps): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  const handleCopyPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (props.type === "password") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = event.target.value;
    props.input.onChange(value);
  };

  return (
    <ThemeProvider theme={inputTheme}>
      <TextField
        {...props.input}
        defaultValue={props.defaultValue}
        className={`custom_input ${props.className}`}
        id={props.input.name + "-" + props.label}
        label={props.label || ""}
        placeholder={props.placeholder || ""}
        required={props.required}
        disabled={props.disabled}
        fullWidth={true}
        type={showPassword ? "text" : props.type}
        color={props.color ? props.color : "primary"}
        helperText={
          props?.meta?.touched &&
          !!props?.meta?.error && (
            <span
              style={{
                marginTop: "0.125rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {props?.meta?.error || props.helperText}
            </span>
          )
        }
        error={props?.meta?.touched && !!props?.meta?.error}
        size={props.size || "small"}
        onChange={handleChange}
        variant="outlined"
        InputProps={
          props.type === "password"
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      aria-label="password*"
                      onClick={() =>
                        setShowPassword((prevValue: boolean) => !prevValue)
                      }
                      startIcon={
                        showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )
                      }
                    />
                  </InputAdornment>
                ),
              }
            : {}
        }
        onCopy={handleCopyPaste}
        onCut={handleCopyPaste}
        onCutCapture={handleCopyPaste}
        onCopyCapture={handleCopyPaste}
        onPaste={handleCopyPaste}
        onPasteCapture={handleCopyPaste}
      />
    </ThemeProvider>
  );
}
