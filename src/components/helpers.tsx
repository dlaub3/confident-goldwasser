import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { RD } from "../deps";
import { RdRenderers, renderRemoteData } from "../helpers";

export const PendingSkelleton = (
  props: { width?: number | string; height?: number | string } = {
    width: "100%",
    height: "100%",
  },
) => {
  const sx = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  } as const;

  return (
    <Box sx={sx}>
      <Skeleton
        variant="rectangular"
        width={props.width}
        height={props.height}
      />
    </Box>
  );
};

export const ErrorPage = (props: {
  children: string | JSX.Element | JSX.Element[];
}) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignContent="center"
  >
    {props.children}
  </Box>
);

export const RendeRemoteData = <A, B>(props: {
  rd: RD.RemoteData<A, B>;
  children: RdRenderers<A, B>;
}) => {
  return renderRemoteData(props.rd, ...props.children);
};
