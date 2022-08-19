import React, { ReactNode } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { Button } from "..";
import CloseIcon from "@mui/icons-material/Close";

type ModelProperties = {
  open: boolean;
  handleClose: () => void;
  children: ReactNode;
  title?: string;
  confirmation?: boolean;
  handleConfirm?: () => void;
};
const Modal: React.FC<ModelProperties> = ({
  open,
  handleClose,
  children,
  title,
  confirmation,
  handleConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby={title}
      aria-describedby="modal-modal-description"
    >
      <DialogTitle>
        <Grid container justifyContent="space-between" alignItems="center">
          {title}
          <Button
            startIcon={<CloseIcon />}
            toolTip="Close"
            onClick={handleClose}
          />
        </Grid>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {confirmation && (
        <DialogActions>
          <Button
            variant="outlined"
            type="secondary"
            label="Cancel"
            size="large"
            onClick={handleClose}
          />
          <Button
            type="secondary"
            label="Confirm"
            size="large"
            onClick={() => handleConfirm?.()}
          />
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
