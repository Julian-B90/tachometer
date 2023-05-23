import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Box, Button, Stack, Typography } from "@mui/material";
import {
  ChartLabel,
  HorizontalGridLines,
  LineSeries,
  LineSeriesPoint,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from "react-vis";
import "../../node_modules/react-vis/dist/style.css";
import { DockerStats, useStats } from "../hook/useStats";
import Head from "./Head";

interface LineSeriesData {
  cpu: LineSeriesPoint[];
  mem: LineSeriesPoint[];
}

export function Details() {
  const { id } = useParams();
  const [data, setData] = useState<LineSeriesData>();
  const [savedStats, setSavedStats] = useState<DockerStats[]>([]);

  const stats = useStats(id);

  useEffect(() => {
    if (savedStats && stats) {
      if (savedStats.length < 300) {
        setSavedStats([...savedStats, ...stats]);
      } else {
        savedStats.splice(1, 1);
        setSavedStats([...savedStats, ...stats]);
      }
    }
  }, [stats]);

  useEffect(() => {
    const lineSeriesData: LineSeriesData = {
      cpu: [],
      mem: [],
    };
    savedStats.forEach((item, index) => {
      lineSeriesData.cpu.push({ x: index, y: parseFloat(item.CPUPerc) });
      lineSeriesData.mem.push({ x: index, y: parseFloat(item.MemPerc) });
    });
    setData(lineSeriesData);
  }, [savedStats]);

  return (
    <>
      <Head />
      <Button sx={{ mb: 4 }} component={Link} to={`/`}>
        Back
      </Button>
      <Stack direction="column" spacing={4}>
        <Box>
          <Typography variant="subtitle1">CPU usage</Typography>
          <XYPlot width={450} height={300}>
            <HorizontalGridLines />
            <VerticalGridLines />
            <XAxis />
            <YAxis />
            <ChartLabel
              text="X Axis"
              className="alt-x-label"
              includeMargin={false}
              xPercent={0.025}
              yPercent={1.01}
            />
            <ChartLabel
              text=""
              className="alt-y-label"
              includeMargin={false}
              xPercent={0.05}
              yPercent={0.1}
              style={{
                transform: "rotate(-90)",
                textAnchor: "end",
              }}
            />
            <LineSeries data={data?.cpu} strokeStyle="solid" />
          </XYPlot>
        </Box>

        <Box>
          <Typography variant="subtitle1">Memory usage</Typography>
          <XYPlot width={450} height={300}>
            <HorizontalGridLines />
            <VerticalGridLines />
            <XAxis />
            <YAxis />
            <ChartLabel
              text="X Axis"
              className="alt-x-label"
              includeMargin={false}
              xPercent={0.025}
              yPercent={1.01}
            />
            <ChartLabel
              text=""
              className="alt-y-label"
              includeMargin={false}
              xPercent={0.05}
              yPercent={0.1}
              style={{
                transform: "rotate(-90)",
                textAnchor: "end",
              }}
            />
            <LineSeries data={data?.mem} strokeStyle="solid" />
          </XYPlot>
        </Box>
      </Stack>
    </>
  );
}
