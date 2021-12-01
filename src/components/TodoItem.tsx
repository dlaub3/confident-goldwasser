/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { TodoItem as Item } from "../types";

export const TodoItem = (props: {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
  onToggleDone: () => void;
}) => {
  return (
    <ListItem
      secondaryAction={
        props.item.done ? (
          <IconButton
            css={css`
              :hover svg {
                fill: crimson;
              }
            `}
            onClick={props.onDelete}
            edge="end"
            aria-label="edit"
          >
            <DeleteIcon />
          </IconButton>
        ) : (
          <IconButton onClick={props.onEdit} edge="end" aria-label="edit">
            <EditIcon />
          </IconButton>
        )
      }
    >
      <ListItemAvatar>
        <IconButton
          onClick={props.onToggleDone}
          edge="end"
          aria-label="toggle done"
          css={css`
            :hover svg {
              fill: ${!props.item.done ? "#c850c0" : "grey"};
            }
            svg {
              fill: ${props.item.done ? "#c850c0" : "grey"};
            }
          `}
        >
          {props.item.done ? (
            <CheckCircleIcon />
          ) : (
            <CheckCircleIcon color="action" />
          )}
        </IconButton>
      </ListItemAvatar>
      <ListItemText
        primary={props.item.title}
        secondary={props.item.description}
      />
    </ListItem>
  );
};
