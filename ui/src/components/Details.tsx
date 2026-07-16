import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
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
import { getHistoryForContainer, useHistory } from "../hook/useHistory";
import { parseIOPair } from "../utils/parseIO";
import Head from "./Head";

export function Details() {
  const { id } = useParams();
  const [savedStats, setSavedStats] = useState<DockerStats[]>([]);
  const [mode, setMode] = useState<"live" | "history">("live");

  const stats = useStats(id);
  const { history } = useHistory(stats);

  useEffect(() => {
    if (stats && mode === "live") {
      setSavedStats((previousStats) =>
        [...previousStats, ...stats].slice(-300)
      );
    }
  }, [stats, mode]);

  const historyData = useMemo(() => {
    if (!id) return [];
    return getHistoryForContainer(history, id);
  }, [history, id]);

  const liveData = useMemo(() => {
    return savedStats.map((item, index) => {
      const netIO = parseIOPair(item.NetIO);
      const blockIO = parseIOPair(item.BlockIO);
      return {
        sample: index + 1,
        cpu: parseFloat(item.CPUPerc),
        memory: parseFloat(item.MemPerc),
        netRx: netIO.rx / 1024,
        netTx: netIO.tx / 1024,
        blockRead: blockIO.rx / 1024,
        blockWrite: blockIO.tx / 1024,
      };
    });
  }, [savedStats]);

  const historyChartData = useMemo(() => {
    return historyData.map((item, index) => {
      const netIO = parseIOPair(item.stats.NetIO);
      const blockIO = parseIOPair(item.stats.BlockIO);
      return {
        sample: index + 1,
        time: new Date(item.timestamp).toLocaleTimeString(),
        cpu: parseFloat(item.stats.CPUPerc),
        memory: parseFloat(item.stats.MemPerc),
        netRx: netIO.rx / 1024,
        netTx: netIO.tx / 1024,
        blockRead: blockIO.rx / 1024,
        blockWrite: blockIO.tx / 1024,
      };
    });
  }, [historyData]);

  const data = mode === "live" ? liveData : historyChartData;
  const xKey = mode === "live" ? "sample" : "time";

  return (
    <>
      <Head />
      <Button sx={{ mb: 4 }} component={Link} to={`/`}>
        Back
      </Button>
      <Stack direction="column" spacing={4}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Typography variant="subtitle1">Data source:</Typography>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, value) => value && setMode(value)}
            size="small"
          >
            <ToggleButton value="live">Live</ToggleButton>
            <ToggleButton value="history">History ({historyData.length})</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            CPU & Memory over time
          </Typography>
          <Box
            aria-label="Line chart showing CPU and memory usage over time"
            role="img"
            sx={{ height: 320, maxWidth: 720, width: "100%" }}
          >
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} label={{ value: mode === "live" ? "Sample" : "Time", position: "insideBottom", offset: -4 }} />
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

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Network I/O over time
          </Typography>
          <Box
            aria-label="Line chart showing network I/O over time"
            role="img"
            sx={{ height: 320, maxWidth: 720, width: "100%" }}
          >
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} label={{ value: mode === "live" ? "Sample" : "Time", position: "insideBottom", offset: -4 }} />
                <YAxis unit=" kB" domain={[0, "auto"]} />
                <Tooltip
                  formatter={(value) => {
                    const numericValue = Array.isArray(value) ? value[0] : value;
                    return `${Number(numericValue).toFixed(2)} kB`;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="netRx"
                  name="RX"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="netTx"
                  name="TX"
                  stroke="#f472b6"
                  strokeDasharray="6 3"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Block I/O over time
          </Typography>
          <Box
            aria-label="Line chart showing block I/O over time"
            role="img"
            sx={{ height: 320, maxWidth: 720, width: "100%" }}
          >
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} label={{ value: mode === "live" ? "Sample" : "Time", position: "insideBottom", offset: -4 }} />
                <YAxis unit=" kB" domain={[0, "auto"]} />
                <Tooltip
                  formatter={(value) => {
                    const numericValue = Array.isArray(value) ? value[0] : value;
                    return `${Number(numericValue).toFixed(2)} kB`;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="blockRead"
                  name="Read"
                  stroke="#fb923c"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="blockWrite"
                  name="Write"
                  stroke="#f87171"
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
