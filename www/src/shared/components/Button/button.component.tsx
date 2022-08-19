import React from "react";
import {
  Button as MaterialButton,
  CircularProgress,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { buttonTheme } from "shared/theme/button-theme";

declare type ButtonVariant = "contained" | "outlined" | "text";
declare type ButtonType =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
  | undefined;
declare type ButtonSize = "large" | "medium" | "small";
declare type ButtonHtmlType = "submit" | "reset" | "button";

interface ButtonProps {
  label?: string;
  labelClass?: string;
  toolTip?: string;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  disabled?: boolean;
  spinning?: boolean;
  variant?: ButtonVariant;
  type?: ButtonType;
  fullWidth?: boolean;
  size?: ButtonSize;
  htmlType?: ButtonHtmlType;
  className?: string;
  ariaRef?: React.RefObject<HTMLButtonElement>;
  ariaHaspopup?: boolean;
  ariaControls?: string;
  onClick?(event?: React.MouseEvent<HTMLButtonElement>): void;
}

export function Button(props: ButtonProps): JSX.Element {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down("md"));

  if (props.label) {
    return (
      <ThemeProvider theme={buttonTheme}>
        <MaterialButton
          ref={props.ariaRef}
          size={props.size || "large"}
          variant={props.variant}
          color={props.type}
          disabled={props.disabled}
          fullWidth={props.fullWidth ?? !md}
          className={props.className}
          startIcon={props.startIcon ? { ...props.startIcon } : null}
          endIcon={props.endIcon ? { ...props.endIcon } : null}
          type={props.htmlType || "button"}
          onClick={props.onClick}
          aria-haspopup={props.ariaHaspopup}
          aria-controls={props.ariaControls}
        >
          <span className={props.labelClass}>{props.label}</span>
          {props.spinning && (
            <CircularProgress
              style={{ marginLeft: "0.5rem" }}
              size={20}
              color="inherit"
            />
          )}
        </MaterialButton>
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider theme={buttonTheme}>
      <Tooltip title={props.toolTip || ""}>
        <IconButton
          color={props.type}
          disabled={props.disabled}
          className={props.className}
          onClick={props.onClick}
        >
          {props.spinning ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            props.startIcon && { ...props.startIcon }
          )}
        </IconButton>
      </Tooltip>
    </ThemeProvider>
  );
}

Button.defaultProps = {
  variant: "contained",
  type: "primary",
};
