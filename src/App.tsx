/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { css } from "@emotion/react";
import { TodoItem } from "./components/TodoItem";
import { RA, RD, IOTST, flow } from "./deps";
import { useRemoteDataRequest } from "./hooks/useRemoteDataRequest";
import { useSwitch } from "./hooks/useSwitch";
import { useList } from "./hooks/useList";
import { PageLayout } from "./components/PageLayout";
import { EditItemDialog } from "./components/EditItemDialog";
import { TodoItem as Item, ItemId } from "./types";
import { coerceNewType, getWindowEnv } from "./utils";
import { getUUID } from "./api";
import { newItemId } from "./optics";
import { UUIDv4_URL } from "./env";

export const getDefaultItem = (id: ItemId) =>
  ({
    id,
    title: getWindowEnv("dev") === true ? "Dev Mode On" : "",
    done: false,
  } as Item);

export default function App() {
  const toggleEditModal = useSwitch();
  const state = useList({ todoList: [] });

  const [item, setItem] = React.useState<RD.RemoteData<string, Item>>(
    RD.initial,
  );

  const { request } = useRemoteDataRequest({
    request: getUUID,
    setRemoteData: setItem,
    codec: IOTST.NonEmptyString,
    onDecodeSuccess: flow(newItemId, getDefaultItem),
    onDecodeFailure: (s: string) => `Failed to decode UUID ${s}`,
  });

  const handleEditModalClose = () => {
    setItem(RD.initial);
    toggleEditModal.switchOff();
  };

  const onToggleDone = (item: Item) => {
    return () => state.toggleItemDone(item.id);
  };

  const onEdit = (x: Item) => () => {
    setItem(RD.success(x));
    toggleEditModal.switchOn();
  };

  const onDelete = (x: Item) => () => state.onDelete([x]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Typography
        className={"rainbow-text"}
        sx={{ mt: 0, mb: 2 }}
        variant="h1"
        component="div"
      >
        fp-ts TODO list
      </Typography>
      <PageLayout
        leftAction={
          <Button
            css={css`
              align-self: flex-end;
              margin-right: 0;
            `}
            title="Add Item"
            onClick={() => {
              toggleEditModal.switchOn();
              request(UUIDv4_URL);
            }}
            aria-label="add"
            startIcon={<AddIcon />}
          >
            Add TODO Item
          </Button>
        }
        leftPaper={
          <React.Fragment>
            {" "}
            <Box display="flex" justifyContent="space-between">
              <Typography
                variant="h4"
                component="h2"
                sx={{ color: "#000000BB", fontWeight: "bolder" }}
              >
                TODO
              </Typography>

              <Button
                disabled={RA.isEmpty(state.todoList)}
                css={css`
                  align-self: flex-start;
                `}
                onClick={() => {
                  state.toggleDone();
                }}
              >
                Move to DONE
              </Button>
            </Box>
            <List dense>
              {state.todoList.map((x) => (
                <TodoItem
                  key={coerceNewType(x.id)}
                  item={x}
                  onEdit={onEdit(x)}
                  onDelete={onDelete(x)}
                  onToggleDone={onToggleDone(x)}
                />
              ))}
            </List>
          </React.Fragment>
        }
        rightPaper={
          <React.Fragment>
            <Box display="flex" justifyContent="space-between">
              <Typography
                variant="h4"
                component="h2"
                sx={{ color: "#000000BB", fontWeight: "bolder" }}
              >
                DONE
              </Typography>

              <Button
                disabled={RA.isEmpty(state.doneList)}
                css={css`
                  align-self: flex-start;
                `}
                onClick={() => {
                  state.toggleTodo();
                }}
              >
                Move to TODO
              </Button>
            </Box>
            <List>
              {state.doneList.map((x) => (
                <TodoItem
                  key={coerceNewType(x.id)}
                  item={x}
                  onEdit={onEdit(x)}
                  onDelete={onDelete(x)}
                  onToggleDone={onToggleDone(x)}
                />
              ))}
            </List>
          </React.Fragment>
        }
      />
      <EditItemDialog
        handleSave={state.editItem}
        isOpen={toggleEditModal.on}
        handleClose={handleEditModalClose}
        item={item}
      />
    </Box>
  );
}
