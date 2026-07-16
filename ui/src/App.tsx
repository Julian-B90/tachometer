import { Box, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import GroupList from "./components/GroupList";
import AggregateStats from "./components/AggregateStats";
import { useStats } from "./hook/useStats";
import { useHistory } from "./hook/useHistory";
import { useContainerLabels } from "./hook/useContainerLabels";
import Head from "./components/Head";
import SearchBar from "./components/SearchBar";
import SortIcon from "@mui/icons-material/Sort";
import { useState } from "react";

export function App() {
  const [sort, setSort] = useState(false);
  const [search, setSearch] = useState("");
  const stats = useStats();
  const { spacing } = useTheme();
  useHistory(stats);
  const labels = useContainerLabels();

  const filteredStats = stats
    ? stats.filter((s) =>
        s.Name.toLowerCase().includes(search.toLowerCase()) ||
        s.Container.toLowerCase().includes(search.toLowerCase())
      )
    : stats;

  const sortedStats = sort && filteredStats
    ? [...filteredStats].sort((a, b) => parseFloat(a.CPUPerc) - parseFloat(b.CPUPerc))
    : filteredStats;

  return (
    <>
      <Head />
      {!stats && (
        <Stack
          sx={{ height: "100vh", alignItems: "center", justifyContent: "center" }}
          direction="column"
        >
          <Typography variant="h2" sx={{ mb: 2, fontSize: spacing(2) }}>
            No containers running
          </Typography>
          <Box>Run a container to show stats</Box>
        </Stack>
      )}
      {stats && (
        <>
          <AggregateStats stats={stats} />
          <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: "center" }}>
            <SearchBar value={search} onChange={setSearch} />
            <Tooltip title="Sort by CPU">
              <IconButton aria-label="Sort" onClick={() => setSort(!sort)} color={sort ? "primary" : "default"}>
                <SortIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <GroupList stats={sortedStats ?? []} labels={labels} />
        </>
      )}
    </>
  );
}
