import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { Item } from "../types";
import * as RR from "fp-ts/lib/ReadonlyRecord";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { pipe, identity, flow, constVoid } from "fp-ts/lib/function";
import { itemC } from "../codecs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { renderOption } from "../helpers";
import { lenses } from "../optics";
import { match } from "ts-pattern";

export const EditItemDialog = (props: {
  item: O.Option<Item>;
  handleSave: (x: Item) => void;
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const handleClose = () => {
    props.handleClose();
  };

  const [item, updateItem] = React.useState<O.Option<Item>>(props.item);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as "title" | "description";
    const value = e.target.value;

    const setField = match(field)
      .with("title", () => {
        return lenses.title.set(value);
      })
      .with("description", () => {
        return lenses.description.set(value);
      })
      .exhaustive();

    updateItem(O.map(setField));
  };

  const handleSave = () => {
    pipe(item, O.fold(constVoid, props.handleSave));
  };

  return renderOption(item, (item) => (
    <Dialog open={props.isOpen} onClose={handleClose}>
      <DialogTitle>Edit: {item.title}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Title"
            placeholder="Enter Title"
            multiline
            variant="filled"
            value={item.title}
            name="title"
            onChange={handleChange}
            aria-describedby="component-error-text"
          />
          <FormHelperText error id="component-error-text"></FormHelperText>

          <TextField
            label="Description"
            name="description"
            placeholder={"Enter Description"}
            multiline
            rows={4}
            value={item.description}
            variant="filled"
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  ));
};
