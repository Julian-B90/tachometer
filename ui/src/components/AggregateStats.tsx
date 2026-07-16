import { Box, Paper, Stack, Typography } from "@mui/material";
import { DockerStats } from "../hook/useStats";

interface AggregateStatsProps {
  stats: DockerStats[];
}

const AggregateStats: React.FC<AggregateStatsProps> = ({ stats }) => {
  const totalCPU = stats.reduce((sum, s) => sum + parseFloat(s.CPUPerc || "0"), 0);
  const totalMem = stats.reduce((sum, s) => sum + parseFloat(s.MemPerc || "0"), 0);

  return (
    <Paper sx={{ mb: 2, p: 2 }}>
      <Stack direction="row" spacing={4} sx={{ justifyContent: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Containers
          </Typography>
          <Typography variant="h4">{stats.length}</Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Total CPU
          </Typography>
          <Typography variant="h4" color={totalCPU > 90 ? "error" : "inherit"}>
            {totalCPU.toFixed(1)}%
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Total Memory
          </Typography>
          <Typography variant="h4" color={totalMem > 90 ? "error" : "inherit"}>
            {totalMem.toFixed(1)}%
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default AggregateStats;
