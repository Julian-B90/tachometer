import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Box, Button, Stack, Typography } from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DockerStats, useStats } from "../hook/useStats";
import Head from "./Head";

export function Details() {
  const { id } = useParams();
  const [savedStats, setSavedStats] = useState<DockerStats[]>([]);

  const stats = useStats(id);

  useEffect(() => {
    if (stats) {
      setSavedStats((previousStats) =>
        [...previousStats, ...stats].slice(-300)
      );
    }
  }, [stats]);

  const data = useMemo(() => {
    return savedStats.map((item, index) => ({
      sample: index + 1,
      cpu: parseFloat(item.CPUPerc),
      memory: parseFloat(item.MemPerc),
    }));
  }, [savedStats]);

  return (
    <>
      <Head />
      <Button sx={{ mb: 4 }} component={Link} to={`/`}>
        Back
      </Button>
      <Stack direction="column" spacing={4}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Container usage over time
          </Typography>
          <Box
            aria-label="Line chart showing CPU and memory usage over time"
            role="img"
            sx={{ height: 320, maxWidth: 720, width: "100%" }}
          >
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sample" label={{ value: "Sample", position: "insideBottom", offset: -4 }} />
                <YAxis unit="%" domain={[0, "auto"]} />
                <Tooltip
                  formatter={(value) => {
                    const numericValue = Array.isArray(value) ? value[0] : value;
                    return `${Number(numericValue).toFixed(2)}%`;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  name="CPU"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="memory"
                  name="Memory"
                  stroke="#38bdf8"
                  strokeDasharray="6 3"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Stack>
    </>
  );
}
