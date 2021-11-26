import { TodoItem as Item } from "../types";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

export const TodoItem = (props: { item: Item; onEdit: () => void }) => {
  return (
    <ListItem
      secondaryAction={
        <IconButton onClick={props.onEdit} edge="end" aria-label="edit">
          <EditIcon />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar>
          <CheckBoxIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={props.item.title}
        secondary={props.item.description}
      />
    </ListItem>
  );
};
