import { Box, Stack, Typography, useTheme } from "@mui/material";
import CardList from "./components/CardList";
import { useStats } from "./hook/useStats";
import Head from "./components/Head";

export function App() {
  const stats = useStats();
  const {spacing} = useTheme();

  return (
    <>
      <Head />
      {!stats && (
        <Stack
          sx={{ height: "100vh" }}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" sx={{ mb: 2, fontSize: spacing(2) }}>
            No containers running
          </Typography>
          <Box>Run a container to show stats</Box>
        </Stack>
      )}
      {stats && (
        <Stack
          direction="row"
          alignItems="start"
          justifyContent="center"
          spacing={2}
          useFlexGap
          flexWrap="wrap"
        >
          <CardList dockerStats={stats}  />
        </Stack>
      )}
    </>
  );
}
