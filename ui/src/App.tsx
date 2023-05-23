import { Box, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import CardList from "./components/CardList";
import { useStats } from "./hook/useStats";
import Head from "./components/Head";
import SortIcon from "@mui/icons-material/Sort";
import { useState } from "react";
import { DockerStats } from "./hook/useStats";

export function App() {
  const [sort, setSort] = useState(false);
  const stats = useStats();
  const { spacing } = useTheme();

  const changeSort = () => {
    setSort(!sort);
  }

  if (sort && stats) {
    stats.sort((a, b) => parseFloat(a.CPUPerc) - parseFloat(b.CPUPerc));
  }

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
        <>
          <Tooltip title="sort CPU">
            <IconButton aria-label="Sort" onClick={changeSort}>
              <SortIcon />
            </IconButton>
          </Tooltip>
          <Stack
            direction="row"
            alignItems="start"
            justifyContent="center"
            spacing={2}
            useFlexGap
            flexWrap="wrap"
          >
            <CardList dockerStats={stats} />
          </Stack>
        </>
      )}
    </>
  );
}
