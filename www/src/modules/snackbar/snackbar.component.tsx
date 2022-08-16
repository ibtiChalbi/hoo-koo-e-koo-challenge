import React from "react";
import { IconButton, Snackbar as SnackbarMui } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeSnackbar } from "./state/snackbar.actions";
import {
  snackbarIsOpen,
  snackbarMessage,
  snackbarSeverity,
} from "./state/snackbar.selectors";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Component Snackbar
 *
 * @component
 *
 * @example
 * return (
 *   <Snackbar />
 * )
 */
export default function Snackbar() {
  const dispatch = useDispatch();
  const open = useSelector(snackbarIsOpen);
  const message = useSelector(snackbarMessage);
  const severity = useSelector(snackbarSeverity);

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <SnackbarMui
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message || ""}
      action={action}
      className={severity}
    />
  );
}
