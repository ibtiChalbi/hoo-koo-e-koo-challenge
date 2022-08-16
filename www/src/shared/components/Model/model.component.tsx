import React, { ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

type ModelProperties = {
  open: boolean;
  handleClose: () => void;
  children: ReactNode;
  title?: string;
};
const Model: React.FC<ModelProperties> = ({
  open,
  handleClose,
  children,
  title,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Model;
