/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { css } from "@emotion/react";

interface PageLayoutProps {
  leftAction: (() => JSX.Element) | JSX.Element;
  leftPaper: (() => JSX.Element) | JSX.Element;
  rightPaper: (() => JSX.Element) | JSX.Element;
}

export const PageLayout = (props: PageLayoutProps) => {
  return (
    <Box
      css={css`
        display: flex;
        flex-flow: column nowrap;
        flex: 1;
        flex-grow: 1;
      `}
    >
      <Box pb={1}>{props.leftAction}</Box>
      <Grid
        container
        spacing={2}
        display={"flex"}
        flex={1}
        flexDirection={"row"}
      >
        <Grid
          item
          xs={6}
          display={"flex"}
          flexDirection={"column"}
          flexGrow={1}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              gap: 2,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            {props.leftPaper}
          </Paper>
        </Grid>
        <Grid
          item
          xs={6}
          display={"flex"}
          flexDirection={"column"}
          flexGrow={1}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              gap: 2,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            {props.rightPaper}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
