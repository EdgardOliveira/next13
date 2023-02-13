import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, ReactElement, Ref } from "react";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IConfirmationDialog {
  title: string;
  contentText: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationDialog({
  onClose,
  onConfirm,
  open,
  title,
  contentText,
}: IConfirmationDialog) {
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      open={open}
    >
      <DialogTitle style={{ color: "green" }}>{title}</DialogTitle>
      <DialogContent dividers>{contentText}</DialogContent>
      <DialogActions disableSpacing={true}>
        <Button onClick={handleClose} variant="outlined" color="success">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="outlined" color="success">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
