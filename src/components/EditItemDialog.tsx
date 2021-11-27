import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { TodoItem } from "../types";
import * as O from "fp-ts/lib/Option";
import { pipe, constVoid } from "fp-ts/lib/function";
import FormHelperText from "@mui/material/FormHelperText";
import { renderOption } from "../helpers";
import { lenses } from "../optics";
import { match } from "ts-pattern";

export const EditItemDialog = (props: {
  item: O.Option<TodoItem>;
  handleSave: (x: TodoItem) => void;
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const handleClose = () => {
    props.handleClose();
  };

  const [item, updateItem] = React.useState<O.Option<TodoItem>>(props.item);

  React.useEffect(() => {
    updateItem(props.item);
  }, [props.item]);

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
    props.handleClose();
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
