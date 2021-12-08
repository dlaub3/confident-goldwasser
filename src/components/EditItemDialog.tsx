import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import { match } from "ts-pattern";
import { TodoItem } from "../types";
import { renderOption } from "../utils";
import * as optics from "../optics";
import { validate } from "../validation";
import { validate as vFree } from "../validationFree";
import { O, pipe, E, RD, RNEA } from "../deps";
import {
  ErrorPage,
  PendingSkelleton,
  RendeRemoteData,
} from "./helperComponents";

export const EditItemDialog = (props: {
  loading?: boolean;
  item: RD.RemoteData<string, TodoItem>;
  handleSave: (x: TodoItem) => void;
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const [errors, setErrors] = React.useState<
    O.Option<RNEA.ReadonlyNonEmptyArray<string>>
  >(O.none);

  const [item, updateItem] = React.useState<RD.RemoteData<string, TodoItem>>(
    props.item,
  );

  const handleClose = () => {
    props.handleClose();
  };

  React.useEffect(() => {
    updateItem(props.item);
  }, [props.item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as "title" | "description";
    const value = e.target.value;

    const setField = match(field)
      .with("title", () => {
        return optics.title.set(value);
      })
      .with("description", () => {
        return optics.description.set(value);
      })
      .exhaustive();

    if (O.isSome(errors)) {
      pipe(
        RD.toOption(item),
        O.map(setField),
        handleValidation,
        E.fold(
          (xs) => setErrors(O.some(xs)),
          () => setErrors(O.none),
        ),
      );
    }

    updateItem(RD.map(setField));
  };

  const handleValidationF = (item: O.Option<TodoItem>) => {
    return pipe(
      item,
      E.fromOption<RNEA.ReadonlyNonEmptyArray<string>>(() => [
        `item is O.None<TodoItem>`,
      ]),
      E.chain(vFree),
    );
  };
  const handleValidation = (item: O.Option<TodoItem>) => {
    return pipe(
      item,
      E.fromOption<string>(() => `item is O.None<TodoItem>`),
      E.chain(validate),
      E.mapLeft(RNEA.of),
    );
  };

  const handleSave = () => {
    pipe(
      RD.toOption(item),
      handleValidationF,
      E.fold(
        (xs) => setErrors(O.some(xs)),
        (x) => {
          props.handleSave(x);
          props.handleClose();
        },
      ),
    );
  };

  const isError = O.isSome(errors);

  return (
    <Dialog open={props.isOpen} onClose={handleClose} sx={{ p: 4, gap: 2 }}>
      <RendeRemoteData rd={item}>
        {[
          () => <></>,
          () => (
            <DialogContent sx={{ p: 4, width: "55ch", height: 369 }}>
              <PendingSkelleton height={"100%"} />
            </DialogContent>
          ),
          (e) => (
            <DialogContent sx={{ p: 4, width: "55ch" }}>
              <ErrorPage>{e}</ErrorPage>
            </DialogContent>
          ),
          (item) => (
            <>
              <DialogTitle>Edit: {item.title}</DialogTitle>
              <DialogContent sx={{ p: 4, width: "55ch" }}>
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": {
                      m: 1,
                    },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
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
                    error={isError}
                  />
                  <FormHelperText
                    sx={{ p: 2 }}
                    error={isError}
                    id="component-error-text"
                  >
                    {renderOption(errors, (messages) =>
                      pipe(
                        messages,
                        RNEA.mapWithIndex((i, msg) => (
                          <React.Fragment key={i}>
                            <span>-{msg}</span>
                            <br />
                          </React.Fragment>
                        )),
                        (xs) => <>{xs}</>,
                      ),
                    )}
                  </FormHelperText>

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
                <Button disabled={isError} onClick={handleSave}>
                  Save
                </Button>
              </DialogActions>
            </>
          ),
        ]}
      </RendeRemoteData>
    </Dialog>
  );
};
