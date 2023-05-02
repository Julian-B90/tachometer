import { Box, Stack, Typography, useTheme } from "@mui/material";
import CardList from "./components/CardList";
import { useStats } from "./hook/useStats";

export function App() {
  const stats = useStats();
  const {spacing, palette} = useTheme();

  return (
    <>
      <Typography variant="h1" sx={{fontSize: spacing(2.875), mb: spacing(1.5)}}>
        Tachometer
      </Typography>
      <Box>Shows real-time cpu and memory usage of containers</Box>
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
          sx={{ mt: 3 }}
          useFlexGap
          flexWrap="wrap"
        >
          <CardList dockerStats={stats}  />
        </Stack>
      )}
    </>
  );
}
